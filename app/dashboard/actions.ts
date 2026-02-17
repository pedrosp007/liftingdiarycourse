"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { db } from "@/db"
import { workouts, workoutExercises } from "@/db/schema"

export async function createWorkout(formData: {
  name: string
  date: string
  notes?: string
  exerciseIds: number[]
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const { name, date, notes, exerciseIds } = formData

  if (!name.trim()) {
    throw new Error("Workout name is required")
  }

  const [workout] = await db
    .insert(workouts)
    .values({
      userId,
      name: name.trim(),
      date,
      notes: notes?.trim() || null,
    })
    .returning({ id: workouts.id })

  if (exerciseIds.length > 0) {
    await db.insert(workoutExercises).values(
      exerciseIds.map((exerciseId, index) => ({
        workoutId: workout.id,
        exerciseId,
        order: index + 1,
      }))
    )
  }

  redirect(`/dashboard?date=${date}`)
}
