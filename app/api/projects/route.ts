import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/lib/database.types';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name } = await request.json();
        if (!name) {
            return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        
        const newProject: Omit<Project, '_id' | 'created_at' | 'updated_at'> = {
            name,
            ownerId: session.user.id,
            team: [{
                userId: session.user.id,
                email: session.user.email!,
                role: 'owner',
            }],
        };

        const result = await db.collection('projects').insertOne({
            ...newProject,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        const createdProject = await db.collection('projects').findOne({ _id: result.insertedId });

        return NextResponse.json(createdProject, { status: 201 });
    } catch (error: any) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        const { db } = await connectToDatabase();

        if (name) {
            const project = await db.collection('projects').findOne({ name, 'team.userId': session.user.id });
            if (!project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            }
            return NextResponse.json(project);
        } else {
            const projects = await db.collection('projects').find({ 'team.userId': session.user.id }).toArray();
            return NextResponse.json(projects);
        }
    } catch (error: any) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}