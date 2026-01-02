import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();

    const projects = await db.collection('tasks').distinct('project', { userId: session.user.id });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('GET /api/projects: Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
