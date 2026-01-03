import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: projectId, userId: memberId } = await params;
    const { newRole } = await request.json();

    if (!newRole || !['owner', 'editor', 'viewer'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if the current user is the owner of the project
    if (project.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Only the project owner can change member roles' }, { status: 403 });
    }

    // Check if the member to update exists in the team
    const memberToUpdate = project.team.find((member: any) => member.userId.toString() === memberId);
    if (!memberToUpdate) {
      return NextResponse.json({ error: 'Team member not found in project' }, { status: 404 });
    }

    // Prevent sole owner from changing their own role to non-owner
    if (memberToUpdate.role === 'owner' && newRole !== 'owner' && project.ownerId.toString() === memberId) {
      const otherOwners = project.team.filter((member: any) => member.role === 'owner' && member.userId.toString() !== memberId);
      if (otherOwners.length === 0) {
        return NextResponse.json({ error: 'Cannot change role of the sole owner to a non-owner role' }, { status: 400 });
      }
    }

    await db.collection('projects').updateOne(
      { _id: new ObjectId(projectId), 'team.userId': memberId },
      { $set: { 'team.$.role': newRole } }
    );

    return NextResponse.json({ message: 'Member role updated successfully' }, { status: 200 });

  } catch (error: any) {
    console.error("Error changing team member role:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: projectId, userId: memberId } = await params; // memberId is the userId of the member to remove

    const { db } = await connectToDatabase();

    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if the current user is the owner of the project
    if (project.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Only the project owner can remove members' }, { status: 403 });
    }

    // Check if the member to remove exists in the team
    const memberToRemove = project.team.find((member: any) => member.userId.toString() === memberId);
    if (!memberToRemove) {
      return NextResponse.json({ error: 'Team member not found in project' }, { status: 404 });
    }

    // Prevent owner from removing themselves if they are the only owner
    if (memberToRemove.role === 'owner' && project.ownerId.toString() === memberId) {
      const otherOwners = project.team.filter((member: any) => member.role === 'owner' && member.userId.toString() !== memberId);
      if (otherOwners.length === 0) {
        return NextResponse.json({ error: 'Cannot remove the sole owner of the project' }, { status: 400 });
      }
    }

    // Remove the member from the team array
    await db.collection('projects').updateOne(
      { _id: new ObjectId(projectId) },
      { $pull: { team: { userId: memberId } } }
    );

    return NextResponse.json({ message: 'Team member removed successfully' }, { status: 200 });

  } catch (error: any) {
    console.error("Error removing team member:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
