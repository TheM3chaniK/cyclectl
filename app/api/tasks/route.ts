import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/lib/database.types';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    const query: { year?: number, userId?: string } = { userId: session.user.id };
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
      project: 'SHIPCTRL',
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

    const { insertedId } = await db.collection('tasks').insertOne({ ...body, userId: session.user.id });

    const new_task = await db.collection('tasks').findOne({_id: insertedId});

    return NextResponse.json(new_task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
