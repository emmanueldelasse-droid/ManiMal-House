# Architecture

Creator AI Studio is split into independent modules so the MVP can start small and still grow into a multi-brand platform.

## Applications

`apps/web` contains the Next.js studio. It handles brand configuration, idea review, quality scoring, asset status, costs, and human validation.

`apps/api` contains orchestration contracts and mock providers. The first real backend service should extend this package with HTTP routes, queues, workers, webhooks, and provider credentials.

## Packages

`packages/shared` owns the domain model, provider interfaces, scoring formula, and seeded Paris House demo data.

`packages/database` contains the initial Prisma schema for PostgreSQL.

`packages/shared/src/ai-engine.ts` owns AI agent definitions, structured-output schemas, prompt contracts, brand memory, and regression cases.

`packages/shared/src/integrations.ts` owns provider adapter contracts, standardized errors, queues, webhooks, OAuth connection shape, retry and fallback policies, storage paths, monitoring alerts, and backend route metadata.

## Core modules

- Brand Manager: workspace-scoped brand identity, tone, rules, platforms, and automation level
- Content Brain: ideas, hooks, scripts, captions, hashtags, and platform adaptations
- Trend Engine: source-backed trend summaries and factual validation
- Generation Engine: video, image, voice, music, subtitles, thumbnails, and exports
- Editing Engine: FFmpeg assembly, format control, compression, subtitles, and vertical MP4 export
- Quality Engine: scoring and publication gates
- Publishing Engine: OAuth, drafts, scheduling, publishing, retries, and status history
- Analytics Engine: platform metrics and post-level performance
- Learning Engine: recommendations generated from performance data
- AI Orchestrator: agent sequencing, structured-output gates, cost control, risk gates, logs, and human validation decisions
- Provider Registry: provider availability, environment requirements, fallback order, and adapter capabilities
- Queue System: async jobs for video, editing, publishing, analytics, learning, and cleanup
- Webhook Handler: signature verification, idempotence, raw event storage, and next-job triggering

## Safety defaults

- No API keys in the frontend
- No automatic publication in the MVP
- No final export with unapproved music rights
- No real event or venue claim without a source
- Every generation should keep prompt, model, provider, cost, duration, score, and trace id
