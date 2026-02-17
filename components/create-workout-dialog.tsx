"use client"

import { useState, useTransition } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { createWorkout } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

export function CreateWorkoutDialog({
  exercises,
}: {
  exercises: { id: number; name: string }[]
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [notes, setNotes] = useState("")
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([])
  const [isPending, startTransition] = useTransition()

  function toggleExercise(exerciseId: number) {
    setSelectedExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await createWorkout({
        name,
        date: format(date, "yyyy-MM-dd"),
        notes: notes || undefined,
        exerciseIds: selectedExerciseIds,
      })
    })
  }

  function resetForm() {
    setName("")
    setDate(new Date())
    setNotes("")
    setSelectedExerciseIds([])
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create Workout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="workout-name">Name</Label>
            <Input
              id="workout-name"
              placeholder="e.g. Push Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="workout-notes">Notes (optional)</Label>
            <Textarea
              id="workout-notes"
              placeholder="Any notes about this workout..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {exercises.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Exercises</Label>
              <div className="flex flex-col gap-2">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`exercise-${exercise.id}`}
                      checked={selectedExerciseIds.includes(exercise.id)}
                      onCheckedChange={() => toggleExercise(exercise.id)}
                    />
                    <Label
                      htmlFor={`exercise-${exercise.id}`}
                      className="font-normal"
                    >
                      {exercise.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Workout"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
