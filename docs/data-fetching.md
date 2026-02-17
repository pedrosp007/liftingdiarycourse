# Data Fetching

## Core Rule: Server Components Only

**ALL data fetching in this app MUST be done via Server Components.** This is non-negotiable.

Data must **NOT** be fetched via:
- Route handlers (`/app/api/*`)
- Client components (`"use client"`)
- Server actions
- Any other mechanism

The **only** way to fetch data is by calling data helper functions directly inside Server Components.

## Database Queries: The `/data` Directory

All database queries **MUST** be implemented as helper functions inside the `/data` directory.

- Every query function lives in `/data`.
- Every query function uses **Drizzle ORM** to interact with the database.
- **DO NOT use raw SQL.** Always use Drizzle's query builder or relational query API.

Example structure:
```
/data
  workouts.ts    — query helpers for workouts
  exercises.ts   — query helpers for exercises
```

## User Data Isolation (Critical)

**A logged-in user must ONLY be able to access their own data.** They must **NEVER** be able to read, modify, or delete another user's data.

Every data helper function **MUST**:
1. Retrieve the current user's ID via `auth()` from `@clerk/nextjs/server`.
2. Include a `WHERE` clause (or Drizzle equivalent) that filters by the authenticated user's ID.
3. Never accept a raw user ID as a parameter from the client — always derive it server-side from the auth session.

Example pattern:
```ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}
```

### Rules Summary

| Rule | Required |
|---|---|
| Fetch data in Server Components only | Yes |
| Query helpers live in `/data` | Yes |
| Use Drizzle ORM (no raw SQL) | Yes |
| Filter every query by authenticated `userId` | Yes |
| Derive `userId` server-side via `auth()` | Yes |
| Never trust client-supplied user IDs | Yes |
