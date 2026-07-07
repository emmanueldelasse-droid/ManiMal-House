# Creator AI Studio

Creator AI Studio is a modular SaaS foundation for creating, reviewing, scoring, and preparing short-form media concepts for vertical social brands.

The first demo brand is Paris House: house music, Paris nightlife, rooftops, premium visual direction, and human validation before any publication.

## What is included

- Next.js studio interface in `apps/web`
- TypeScript API skeleton in `apps/api`
- Shared domain types and scoring logic in `packages/shared`
- Product, architecture, workflow, UX, AI engine, integration, and operations notes in `docs`
- Provider adapter contracts for LLM, video, voice, and publishing workflows
- Operational workflows, release gates, tests, deployment, roadmap, and monetization notes

## Requirements

- Node.js 20.11 or newer
- npm 11 or newer

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

The web app runs at `http://localhost:3000` by default.

## Verify

```bash
npm run typecheck
npm run build
```

## MVP scope

This repository starts with the MVP phase:

- create and configure a media brand
- generate and compare content ideas
- produce script, storyboard, captions, hashtags, and video prompts
- upload or attach manual assets later
- score content before publication
- keep human review mandatory

## UX prototype

The web app now includes a navigable MVP product prototype covering onboarding, dashboard, brands, identity, calendar, ideas, studio, video library, music library, publications, analytics, learnings, costs, social connections, and settings. See `docs/ux-ui.md`.

## AI engine

The repository includes the Tome 3 AI engine foundation: specialized agent contracts, structured-output schemas, prompt definitions, Paris House memory, AI regression cases, and a mock orchestrator with logs and runtime gates. See `docs/ai-engine.md`.

## Integrations

The repository includes the Tome 4 integration foundation: provider adapter contracts, standardized errors, retry and fallback policies, queues, webhooks, OAuth connection models, storage paths, monitoring alerts, and a provider registry. See `docs/integrations.md`.

## Operations

The repository includes the Tome 5 operations layer: complete workflows, publication/export gates, FFmpeg checks, test strategy, deployment environments, monitoring, roadmap, monetization, launch strategy, and risk register. See `docs/operations.md`.

Automatic social publishing, payments, full multi-user SaaS workflows, and autopilot are intentionally out of scope for the first slice.
