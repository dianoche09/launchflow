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

- [ ] Create `profiles` table and `projects` table
- [ ] Create `launch_content` and `platforms` tables
- [ ] Create `submissions` table
- [ ] Enable RLS and define policies for all tables
- [ ] Commit Phase 2 completion

## Phase 3: Platform Seed Data
> Goal: Populate the `platforms` table with the initial set of 100+ launch sites, directories, and review platforms.

- [ ] Insert Tier 1 Launch Platforms (Product Hunt, BetaList, Microlaunch, etc.)
- [ ] Insert AI Directories
- [ ] Insert SaaS Directories & Review Platforms
- [ ] Insert Deal Platforms & Communities
- [ ] Commit Phase 3 completion

## Phase 4: Core Application Logic & UI
> Goal: Implement Supabase clients, TypeScript definitions, openAI integrations, API endpoints, and Dashboard screens.

- [ ] Setup Supabase client components (`lib/supabase/*`)
- [ ] Define TypeScript types (`types/index.ts`)
- [ ] Implement AI launch content generator (`lib/openai/generate-launch-content.ts`)
- [ ] Build API routes for projects and submissions
- [ ] Build Dashboard UI (Stats, Project list, Create Project Form)
- [ ] Build Project detail page and Submissions table
- [ ] Build Landing Page (Hero, Features, Pricing) and Auth page
- [ ] Commit Phase 4 completion

## Phase 5: Automation Worker
> Goal: Create the standalone Node.js service for Playwright automation and Redis queue processing.

- [ ] Initialize standalone `worker` directory and connect to Redis/BullMQ
- [ ] Create abstract `base-bot.ts` and generic `form-bot.ts`
- [ ] Create specific bots (e.g., `microlaunch-bot.ts`)
- [ ] Write worker `Dockerfile` and `package.json`
- [ ] Commit Phase 5 completion

## Phase 6: Deployment & Final Configs
> Goal: Setup configurations for deployment on Vercel (Frontend) and Railway (Worker).

- [ ] Create `vercel.json`
- [ ] Configure `README.md` with setup/deploy guide
- [ ] Perform final local test run
- [ ] Commit Phase 6 completion
