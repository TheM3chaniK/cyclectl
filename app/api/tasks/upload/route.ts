import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/lib/database.types';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { db } = await connectToDatabase();
        const tasks: Task[] = await request.json(); // Get JSON directly from body

        if (!Array.isArray(tasks)) {
            return NextResponse.json({ error: 'Invalid JSON format. Expected an array of tasks.' }, { status: 400 });
        }

        const tasksWithUserId = tasks.map(task => ({ ...task, userId: session.user.id }));

        await db.collection('tasks').insertMany(tasksWithUserId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error importing tasks:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
