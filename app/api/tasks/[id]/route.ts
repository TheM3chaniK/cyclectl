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

    // Step 1: Find the task by _id only to ensure it exists
    const existingTask = await db.collection("tasks").findOne({ _id: objectId });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Step 2: Perform ownership check
    if (existingTask.userId && existingTask.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this task" },
        { status: 403 },
      );
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

    // Step 2: Perform ownership check
    if (existingTask.userId && existingTask.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this task" },
        { status: 403 },
      );
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
