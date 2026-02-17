import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { exercises } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getExercises() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(exercises)
    .where(eq(exercises.userId, userId))
    .orderBy(exercises.name);
}

export async function getExerciseById(exerciseId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const exercise = await db
    .select()
    .from(exercises)
    .where(and(eq(exercises.id, exerciseId), eq(exercises.userId, userId)));

  return exercise[0] ?? null;
}
