import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();

    const { deletedCount } = await db.collection('tasks').deleteMany({ userId: session.user.id });

    return NextResponse.json({ message: `Deleted ${deletedCount} tasks for user ${session.user.id}` });
  } catch (error: any) {
    console.error('DELETE /api/tasks/clear: Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
