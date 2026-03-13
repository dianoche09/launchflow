# Tasks

## Phase 1: Project Setup
> Goal: Initialize the Next.js 14 project with necessary dependencies, empty environment variables, and folder structure.

- [x] Create Next.js 14 project (App Router, TS, Tailwind)
- [x] Install and configure Shadcn UI (new-york style, zinc)
- [x] Install dependencies (supabase, openai, bullmq, ioredis, playwright, etc.)
- [x] Create `.env.local` template with required keys
- [x] Create folder structure (app, components, lib, types)
- [x] Commit Phase 1 completion

## Phase 2: Database Schema & RLS
> Goal: Establish the local or remote Supabase database tables, relationships, and Row Level Security policies.

- [x] Create `profiles` table and `projects` table
- [x] Create `launch_content` and `platforms` tables
- [x] Create `submissions` table
- [x] Enable RLS and define policies for all tables
- [x] Commit Phase 2 completion

## Phase 3: Platform Seed Data
> Goal: Populate the `platforms` table with the initial set of 100+ launch sites, directories, and review platforms.

- [x] Insert Tier 1 Launch Platforms (Product Hunt, BetaList, Microlaunch, etc.)
- [x] Insert AI Directories
- [x] Insert SaaS Directories & Review Platforms
- [x] Insert Deal Platforms & Communities
- [x] Commit Phase 3 completion

## Phase 4: Core Application Logic & UI
> Goal: Implement Supabase clients, TypeScript definitions, openAI integrations, API endpoints, and Dashboard screens.

- [x] Setup Supabase client components (`lib/supabase/*`)
- [x] Define TypeScript types (`types/index.ts`)
- [x] Implement AI launch content generator (`lib/openai/generate-launch-content.ts`)
- [x] Build API routes for projects and submissions
- [x] Build Dashboard UI (Stats, Project list, Create Project Form)
- [x] Build Project detail page and Submissions table
- [x] Build Landing Page (Hero, Features, Pricing) and Auth page
- [x] Commit Phase 4 completion

## Phase 5: Automation Worker
> Goal: Create the standalone Node.js service for Playwright automation and Redis queue processing.

- [x] Initialize standalone `worker` directory and connect to Redis/BullMQ
- [x] Create abstract `base-bot.ts` and generic `form-bot.ts`
- [x] Create specific bots (e.g., `microlaunch-bot.ts`)
- [x] Write worker `Dockerfile` and `package.json`
- [x] Commit Phase 5 completion

## Phase 6: Deployment & Final Configs
> Goal: Setup configurations for deployment on Vercel (Frontend) and Railway (Worker).

- [ ] Create `vercel.json`
- [ ] Configure `README.md` with setup/deploy guide
- [ ] Perform final local test run
- [ ] Commit Phase 6 completion
