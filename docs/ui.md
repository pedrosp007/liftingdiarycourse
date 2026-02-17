# UI Coding Standards

## Core Rule

**Only shadcn/ui components may be used for the UI in this project. Absolutely no custom components should be created.**

Every UI element — buttons, cards, dialogs, inputs, popovers, calendars, tables, etc. — must come from the [shadcn/ui](https://ui.shadcn.com/) component library.

## Project Configuration

- **Style:** new-york
- **Icon library:** lucide
- **Component path:** `@/components/ui`
- **Utilities path:** `@/lib/utils`

## Adding New Components

Use the shadcn/ui CLI to add components:

```bash
npx shadcn@latest add <component-name>
```

This installs components into `components/ui/`. These installed files are the only component files that should exist in the project.

## What Is Allowed

- Installing any component from the shadcn/ui registry via the CLI.
- Composing shadcn/ui components together directly inside pages, layouts, and route handlers (files in `app/`).
- Passing props, children, and applying Tailwind classes to shadcn/ui components.
- Using Clerk authentication components (`SignInButton`, `SignUpButton`, `UserButton`, etc.) as they are a third-party integration, not custom UI.

## What Is NOT Allowed

- Creating custom React components outside of `components/ui/`.
- Writing wrapper components around shadcn/ui components.
- Building bespoke UI elements from scratch (custom buttons, custom modals, custom inputs, etc.).
- Adding files to `components/` that are not installed via the shadcn/ui CLI.

## Composing UI

All UI composition should happen directly in the `app/` directory files (pages, layouts, route handlers). If a page needs a card with a button inside a popover, compose those shadcn/ui components inline in the page file — do not extract them into a separate component file.

## Currently Installed Components

| Component | Path |
|-----------|------|
| Button | `components/ui/button.tsx` |
| Calendar | `components/ui/calendar.tsx` |
| Card | `components/ui/card.tsx` |
| Checkbox | `components/ui/checkbox.tsx` |
| Dialog | `components/ui/dialog.tsx` |
| Input | `components/ui/input.tsx` |
| Label | `components/ui/label.tsx` |
| Popover | `components/ui/popover.tsx` |
| Textarea | `components/ui/textarea.tsx` |
