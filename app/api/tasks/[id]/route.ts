import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { id } = await params;

    delete body._id;
    
    const objectId = new ObjectId(id);

    // Step 1: Find the task by _id
    const existingTask = await db.collection("tasks").findOne({ _id: objectId });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Step 2: Perform project-based permission check
    const project = await db.collection('projects').findOne({ _id: new ObjectId(existingTask.projectId) });
    if (!project) {
        return NextResponse.json({ error: 'Project not found for task' }, { status: 404 });
    }

    const teamMember = project.team.find((member: any) => member.userId.toString() === session.user.id);
    if (!teamMember) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Permission 4: Only owner can move tasks between months (i.e., change task.month)
    if (body.month && body.month !== existingTask.month && teamMember.role !== 'owner') {
        return NextResponse.json({ error: 'Only the project owner can move tasks between months' }, { status: 403 });
    }

    // Permission 3: Only owner and editor can edit task title, description, and dates
    // Permission 6: Only owner and editor can reorder tasks (by changing order_index)
    // Permission 7: Only owner and editor can change task status
    if (!['owner', 'editor'].includes(teamMember.role)) {
        return NextResponse.json({ error: 'Not authorized to update tasks in this project' }, { status: 403 });
    }

    // Step 3: Ensure userId is always set/updated to the current session user's ID in the body
    body.userId = session.user.id;

    const updateResult = await db
      .collection("tasks")
      .updateOne({ _id: objectId }, { $set: body });

    if (updateResult.matchedCount === 0) {
      // This case should ideally not be reached if existingTask was found
      return NextResponse.json({ error: "Task not found or failed to update" }, { status: 404 });
    }

    const updatedTask = await db.collection("tasks").findOne({ _id: objectId });

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error("PUT: Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();
    const { id } = await params;

    const objectId = new ObjectId(id);

    // Step 1: Find the task by _id only to ensure it exists
    const existingTask = await db.collection("tasks").findOne({ _id: objectId });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Step 2: Perform project-based permission check (Permission 5: Only owner can delete tasks)
    const project = await db.collection('projects').findOne({ _id: new ObjectId(existingTask.projectId) });
    if (!project) {
        return NextResponse.json({ error: 'Project not found for task' }, { status: 404 });
    }

    const teamMember = project.team.find((member: any) => member.userId.toString() === session.user.id);
    if (!teamMember || teamMember.role !== 'owner') { // Changed to 'owner' only
        return NextResponse.json({ error: 'Only the project owner can delete tasks' }, { status: 403 });
    }

    const deleteResult = await db.collection("tasks").deleteOne({ _id: objectId });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found or failed to delete" }, { status: 404 });
    }

    return NextResponse.json({ deleted: existingTask });
  } catch (error: any) {
    console.error("DELETE: Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
