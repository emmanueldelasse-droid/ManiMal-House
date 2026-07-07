# Operations, tests, deployment and monetization

Tome 5 turns Creator AI Studio from a navigable prototype into an operational product plan.

The main rule remains:

```txt
Paris House first. Quality first. Manual MP4 export first.
```

Automatic publishing, billing, TikTok, YouTube and autopilot come after the MVP can reliably produce strong vertical videos.

## Complete workflows

The shared package exposes complete workflows in `packages/shared/src/operations.ts`:

- brand creation
- idea generation
- content production
- FFmpeg editing
- human validation
- publication
- analytics
- learning

Each workflow defines objective, trigger, owner, steps, outputs, blockers, and success criterion.

## Publication and export gates

Publication is blocked when human approval is missing, score is too low, music is not approved, copy is incomplete, video format is invalid, social access is missing, budget is exceeded, or copyright/factual risk is blocking.

The API module `apps/api/src/modules/workflow-gates.ts` exposes:

- `evaluatePublishingGate`
- `evaluateManualExportGate`
- `createAnalyticsSyncPlan`

For the MVP, social publishing blockers should usually lead to manual export rather than product failure.

## FFmpeg quality checks

Every final MP4 should pass checks for file readability, duration, 9:16 ratio, 1080x1920 resolution, readable audio, correct volume, no black start, visible text, acceptable file size, and hook before two seconds.

## Test strategy

Required test layers:

- unit tests for business rules
- AI regression tests for structured outputs and risk signals
- integration tests for providers, storage, FFmpeg and publication
- end-to-end tests for the manual export workflow
- security tests for secrets, workspace isolation, signed URLs, logging and audit trails

The first e2e milestone is simple: create Paris House, generate ideas, select one, create script and storyboard, upload video and approved music, export MP4, score, approve and download.

## Deployment environments

Local uses mock providers, disabled publication, local or dev storage, and local FFmpeg.

Staging uses real providers only when needed, low budget, test social accounts, disabled or draft-only publication, and complete logs.

Production uses secure secrets, backed-up database, private cloud storage, monitoring and alerts, and real publication only after human validation.

## Monitoring

Track backend errors, failed jobs, stuck jobs, generation duration, provider cost, provider success rate, publication failures, expired social tokens, budget overrun, storage usage, FFmpeg failures, and invalid AI JSON.

## Roadmap

1. Phase 0: framing
2. Phase 1: manual export MVP
3. Phase 2: advanced AI generation
4. Phase 3: Instagram publishing
5. Phase 4: analytics and learning
6. Phase 5: multi-platform
7. Phase 6: advanced multi-brand
8. Phase 7: commercial SaaS

Do not move to phase 3 until phase 1 exports are strong enough to post manually.

## Monetization

Possible SaaS plans: Starter, Creator, Pro, and Agency.

Paris House can also become its own media asset through events, club partnerships, rooftop partnerships, DJs, labels, playlists, ticketing affiliation, sponsored content and templates.

The service offer can come before the SaaS:

```txt
Premium AI content operations for clubs, rooftops, restaurants and events.
```

This helps validate the market while improving the product.

## Success criteria

Short term success means useful ideas, scripts better than a simple prompt, clean exports, regular manual publication, and a 30-day Paris House content run.

Technical success means no frontend secrets, interchangeable providers, long jobs in queues, clear errors, tracked costs, reliable storage, working score, understandable logs, and a multi-brand capable database.
