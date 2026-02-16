import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { eq, and } from "drizzle-orm"
import { format } from "date-fns"

import { db } from "@/db"
import { workouts, workoutExercises, exercises, sets } from "@/db/schema"
import { DatePicker } from "@/components/date-picker"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const params = await searchParams
  const dateStr = params.date ?? format(new Date(), "yyyy-MM-dd")
  const selectedDate = new Date(dateStr + "T00:00:00")

  const userWorkouts = await db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), eq(workouts.date, dateStr)),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
    },
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DatePicker date={selectedDate} />
      </div>

      {userWorkouts.length === 0 ? (
        <p className="text-muted-foreground">No workouts logged for this day.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {userWorkouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                {workout.notes && (
                  <CardDescription>{workout.notes}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {workout.workoutExercises.map((we) => (
                    <div key={we.id}>
                      <h3 className="mb-2 font-medium">{we.exercise.name}</h3>
                      {we.sets.length > 0 ? (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-muted-foreground border-b text-left">
                              <th className="pb-1 font-medium">Set</th>
                              <th className="pb-1 font-medium">Reps</th>
                              <th className="pb-1 font-medium">Weight</th>
                              <th className="pb-1 font-medium">RPE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {we.sets.map((set) => (
                              <tr key={set.id} className="border-b last:border-0">
                                <td className="py-1">{set.setNumber}</td>
                                <td className="py-1">{set.reps}</td>
                                <td className="py-1">{set.weight}</td>
                                <td className="py-1">
                                  {set.rpe ?? "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No sets recorded.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
