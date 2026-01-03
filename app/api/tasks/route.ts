import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/lib/database.types';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const project = await db.collection('projects').findOne({ _id: new ObjectId(projectId) });
    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isUserInTeam = project.team.some((member: any) => member.userId.toString() === session.user.id);
    if (!isUserInTeam) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const query: { year?: number, projectId?: string } = { projectId };
    if (year) {
      query.year = parseInt(year);
    }

    const tasks = await db
      .collection('tasks')
      .find(query)
      .sort({ order_index: 1 })
      .toArray();

    const grouped = tasks.reduce((acc: Record<string, Task[]>, task: any) => {
      if (!acc[task.month]) {
        acc[task.month] = [];
      }
      acc[task.month].push(task);
      return acc;
    }, {});

    return NextResponse.json({
      year: year ? parseInt(year) : new Date().getFullYear(),
      project: 'CYCLECTL', // This might need to be updated later
      schedule: Object.keys(grouped).map(month => ({
        month,
        tasks: grouped[month]
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const body = await request.json();

    const project = await db.collection('projects').findOne({ _id: new ObjectId(body.projectId) });
    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const teamMember = project.team.find((member: any) => member.userId.toString() === session.user.id);
    if (!teamMember || !['owner', 'editor'].includes(teamMember.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { insertedId } = await db.collection('tasks').insertOne({ ...body, userId: session.user.id });

    const new_task = await db.collection('tasks').findOne({_id: insertedId});

    return NextResponse.json(new_task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
