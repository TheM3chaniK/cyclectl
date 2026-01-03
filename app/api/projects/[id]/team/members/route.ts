import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/lib/database.types';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id: projectId } = await params;
        console.log('Received projectId:', projectId);
        const { email, role } = await request.json(); // Get role from body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // Find the user to invite
        const userToInvite = await db.collection('users').findOne({ email });
        if (!userToInvite) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Find the project
        let projectObjectId;
        try {
            projectObjectId = new ObjectId(projectId);
        } catch (e) {
            console.error('Invalid projectId format:', projectId);
            return NextResponse.json({ error: 'Invalid project ID format' }, { status: 400 });
        }
        const project = await db.collection('projects').findOne({ _id: projectObjectId });
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Determine inviter's role
        const inviter = project.team.find((member: any) => member.userId.toString() === session.user.id);
        if (!inviter) {
            return NextResponse.json({ error: 'Inviter not a member of this project' }, { status: 403 });
        }

        let roleToAssign: 'owner' | 'editor' | 'viewer' = 'viewer'; // Default to viewer

        if (inviter.role === 'owner') {
            if (role && ['owner', 'editor', 'viewer'].includes(role)) {
                roleToAssign = role;
            } else {
                return NextResponse.json({ error: 'Invalid role specified by owner' }, { status: 400 });
            }
        } else if (inviter.role === 'editor') {
            roleToAssign = 'editor'; // Editors can only add other editors (or viewers)
        } else if (inviter.role === 'viewer') {
            roleToAssign = 'viewer'; // Viewers can only add other viewers
        }

        // Check if the user is already a member of the team
        if (project.team.some((member: any) => member.userId.toString() === userToInvite._id.toString())) {
            return NextResponse.json({ error: 'User is already a member of this project' }, { status: 409 });
        }

        const newMember = {
            userId: userToInvite._id.toString(),
            email: userToInvite.email,
            role: roleToAssign,
        };

        await db.collection('projects').updateOne(
            { _id: new ObjectId(projectId) },
            { $push: { team: newMember } }
        );

        return NextResponse.json(newMember, { status: 201 });

    } catch (error: any) {
        console.error("Error inviting user:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
