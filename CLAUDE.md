# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start development server (Next.js, default port 3000)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Architecture

This is a Next.js 16 project using the **App Router** pattern with React 19, TypeScript (strict mode), and Tailwind CSS v4.

- **`/app`** — App Router directory. All routes, layouts, and pages live here. Components are server components by default.
- **`/public`** — Static assets served at the root URL path.
- Path alias `@/*` maps to the project root (configured in tsconfig.json).

## Authentication

**Clerk** (`@clerk/nextjs`) handles authentication via the App Router pattern:
- `proxy.ts` — Middleware using `clerkMiddleware()` from `@clerk/nextjs/server`. Runs on all non-static routes.
- `<ClerkProvider>` wraps the entire app in `app/layout.tsx`.
- Clerk components (`SignInButton`, `SignUpButton`, `UserButton`, `SignedIn`, `SignedOut`) are used in the root layout header.
- Environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) are in `.env.local` (git-ignored).
- Use `auth()` from `@clerk/nextjs/server` (async) for server-side auth checks.

## Key Conventions

- **Tailwind CSS v4** with `@import "tailwindcss"` syntax and CSS custom properties for theming (see `app/globals.css`).
- **Dark mode** uses `prefers-color-scheme` media query and Tailwind's `dark:` prefix.
- **Geist font family** loaded via `next/font/google` and injected as CSS variables in the root layout.
- **ESLint 9** flat config with Next.js core-web-vitals and TypeScript rules.
