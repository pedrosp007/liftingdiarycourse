import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(workouts.date);
}

export async function getWorkoutsByDate(date: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)));
}

export async function getRecentWorkouts(limit = 3) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select({ id: workouts.id, name: workouts.name, date: workouts.date })
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.date))
    .limit(limit);
}

export async function getWorkoutById(workoutId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
    with: {
      workoutExercises: {
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setNumber)],
          },
        },
      },
    },
  });

  return workout ?? null;
}
