# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OddsFlow is an AI-powered football odds prediction platform built with Next.js 16, React 19, TypeScript, and Supabase. It features subscription-based access to predictions, user authentication, and multi-language support.

## Development Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Language**: TypeScript (strict mode)

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with LoadingProvider
│   ├── page.tsx            # Homepage (large, feature-rich)
│   ├── dashboard/          # Protected user dashboard
│   ├── predictions/[id]/   # Dynamic prediction routes
│   ├── leagues/            # League browsing
│   ├── performance/        # Analytics with charts
│   ├── auth/callback/      # OAuth callback handler
│   └── login/, get-started/ # Auth pages
├── components/
│   └── LoadingProvider.tsx # Global loading state with image overlay
└── lib/
    └── supabase.ts         # Supabase client, auth helpers, TypeScript interfaces
```

### Key Patterns
- **Client Components**: Use `"use client"` directive for interactive components
- **Path Alias**: `@/*` maps to `./src/*`
- **Authentication**: Supabase Auth with Email and Google OAuth
- **Styling**: Dark theme with emerald/cyan accents, utility-first Tailwind

### Supabase Integration (`src/lib/supabase.ts`)
Contains auth helpers and TypeScript interfaces for:
- `UserSubscription` - User subscription plans with limits
- `Prematch` - Upcoming fixtures
- `League` - League info
- `Moneyline1x2Prediction`, `OverUnderPrediction`, `HandicapPrediction` - AI predictions
- `ProfitSummary` - ROI and performance metrics
- `FootballNews` - News articles

### Loading UX
`LoadingProvider` intercepts navigation to `/predictions`, `/leagues`, `/performance` and displays a random football image from `/public/loading/` during transitions.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database

Schema is defined in `supabase_user_subscriptions.sql`. The main `user_subscriptions` table has Row Level Security enabled with user isolation policies.

## Multi-language Support

The homepage and leagues page support 9 languages (EN, ES, PT, DE, FR, JA, KO, ZH-CN, ZH-TW) with in-component translation objects.
