import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const teamMember = project.team.find((member: any) => member.userId.toString() === session.user.id);
    if (!teamMember || teamMember.role !== 'owner') { // Changed to 'owner' only
        return NextResponse.json({ error: 'Only the project owner can clear tasks' }, { status: 403 });
    }

    const { deletedCount } = await db.collection('tasks').deleteMany({ 
      userId: session.user.id,
      projectId: projectId
    });

    return NextResponse.json({ message: `Deleted ${deletedCount} tasks for user ${session.user.id}` });
  } catch (error: any) {
    console.error('DELETE /api/tasks/clear: Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
