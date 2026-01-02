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
        const { searchParams } = new URL(request.url);
        const project = searchParams.get('project');

        if (!project) {
            return NextResponse.json({ error: 'Project name is required.' }, { status: 400 });
        }
        
        const tasks: Task[] = await request.json(); // Get JSON directly from body

        if (!Array.isArray(tasks)) {
            return NextResponse.json({ error: 'Invalid JSON format. Expected an array of tasks.' }, { status: 400 });
        }

        const lastTask = await db.collection('tasks').findOne(
            { project, userId: session.user.id },
            { sort: { order_index: -1 } }
        );
        const highestOrderIndex = lastTask?.order_index || 0;

        const tasksWithProjectAndOrder = tasks.map((task, index) => ({
            ...task,
            _id: undefined, // Ensure MongoDB generates a new _id
            userId: session.user.id,
            project: project,
            order_index: highestOrderIndex + index + 1,
        }));

        await db.collection('tasks').insertMany(tasksWithProjectAndOrder);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error importing tasks:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
