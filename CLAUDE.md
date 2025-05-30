# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Start development server with Turbopack and network access
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Architecture

**Duonote** is a bilingual vocabulary/dictionary app built with Next.js 15 App Router, Firebase Auth, and next-intl for internationalization.

### Key Architectural Patterns

1. **Internationalized Routing**: Uses `[locale]` dynamic segments with next-intl
   - Supported locales: `en` (default), `ja`
   - Middleware in `src/middleware.ts` handles locale detection and routing
   - URLs: `/en/login`, `/ja/login`, etc.

2. **Authentication Flow**: Firebase Auth with protected routes
   - Public routes: `(auth)` group (`/login`, `/register`)
   - Protected routes: `/app/*` with auth guard in `src/app/[locale]/app/layout.tsx`
   - Supports email/password and Google OAuth

3. **Route Groups**: Logical separation using Next.js route groups
   - `(auth)`: Login/register pages
   - `(marketing)`: Public marketing pages
   - `app/`: Protected application area

### Critical Configuration Files

- **`src/middleware.ts`**: Handles internationalization routing
- **`src/app/lib/firebase.ts`**: Firebase configuration (Project ID: duonote-9f2b0)
- **`src/app/lib/i18n.ts`**: next-intl configuration
- **`next.config.ts`**: Next.js + next-intl plugin setup
- **`src/app/[locale]/globals.css`**: Tailwind CSS v4 with DaisyUI plugin configuration

### Directory Structure

- `src/app/[locale]/`: Internationalized pages and layouts
- `src/app/lib/`: Core utilities (Firebase, i18n)
- `src/app/locales/`: Translation files (`en.json`, `ja.json`)
- `src/components/`: Organized by feature (auth, notes, categories, ui)
- `src/app/services/`: Service layer for data operations (planned)

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with PostCSS, DaisyUI component library
- **Icons**: Heroicons React
- **Auth**: Firebase Auth
- **i18n**: next-intl
- **Search**: FlexSearch (planned)
- **Database**: Firebase Firestore (planned)

### Development Notes

- Path alias `@/*` maps to `./src/*`
- Firebase config uses environment variables (not committed)
- Turbopack enabled for fast development
- End-to-end encryption planned for user notes
- Service layer architecture planned for backend abstraction