# Creator AI Studio

Creator AI Studio is a modular SaaS foundation for creating, reviewing, scoring, and preparing short-form media concepts for vertical social brands.

The first demo brand is Paris House: house music, Paris nightlife, rooftops, premium visual direction, and human validation before any publication.

## What is included

- Next.js studio interface in `apps/web`
- TypeScript API skeleton in `apps/api`
- Shared domain types and scoring logic in `packages/shared`
- Product and architecture notes in `docs`
- Provider adapter contracts for LLM, video, voice, and publishing workflows

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

Automatic social publishing, payments, full multi-user SaaS workflows, and autopilot are intentionally out of scope for the first slice.
