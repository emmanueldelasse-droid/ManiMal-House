# Integrations Tome 4

Creator AI Studio must hide technical orchestration behind a simple creative studio experience.

Bad path:

```txt
Frontend -> direct Runway call -> video file -> direct Instagram publish
```

Correct path:

```txt
Frontend
-> API Backend
-> Orchestrator
-> Queue Job
-> Provider Adapter
-> Storage
-> Quality Check
-> Human Validation
-> Publishing Adapter
-> Analytics
-> Learning
```

## Adapter rule

No external provider should be called directly from business logic.

The shared package now defines contracts for:

- LLM providers
- video providers
- image providers
- voice providers
- music providers
- editing providers
- storage providers
- publishing providers
- analytics providers
- trend/search providers
- cost providers

The API package includes:

- `ProviderRegistry`
- `AutoVideoProviderSelector`
- job helpers
- webhook normalization and idempotence helpers
- environment validation

## MVP integration phases

Phase 1:

- OpenAI
- FFmpeg
- storage
- manual upload
- mock video provider
- MP4 export

Phase 2:

- Runway or Kling
- ElevenLabs
- image generation
- advanced music rights

Phase 3:

- Instagram
- Instagram analytics
- scheduled publication

Phase 4:

- TikTok
- YouTube Shorts
- multi-platform adaptation

## Queue system

Long-running work must not run inside a normal HTTP request.

Queues:

- `ai-generation-queue`
- `video-generation-queue`
- `editing-queue`
- `publishing-queue`
- `analytics-queue`
- `learning-queue`
- `cleanup-queue`

Job statuses:

- pending
- queued
- running
- waiting_provider
- succeeded
- failed
- cancelled
- retrying

## Webhooks

Every webhook must:

- verify signature if available
- reject invalid requests
- be idempotent
- store the raw event
- avoid processing the same external event twice
- trigger the next job when valid

The database schema includes `WebhookEvent` with a unique `(provider, externalEventId)` constraint.

## OAuth

OAuth connections are tracked separately from public social account display state.

Rules:

- encrypt access tokens
- encrypt refresh tokens
- never log tokens
- never expose tokens to the frontend
- track token expiration
- track scopes
- journal OAuth errors
- verify scopes before publishing

## Storage

Private by default.

Canonical storage layout:

```txt
workspaces/{workspaceId}/brands/{brandId}/projects/{contentProjectId}/raw/
workspaces/{workspaceId}/brands/{brandId}/projects/{contentProjectId}/generated/
workspaces/{workspaceId}/brands/{brandId}/projects/{contentProjectId}/exports/
workspaces/{workspaceId}/brands/{brandId}/projects/{contentProjectId}/thumbnails/
workspaces/{workspaceId}/music/
```

Signed URLs must expire. Temporary files should be cleaned by a daily cleanup job.

## Errors

Errors use a normalized shape:

```ts
type AppError = {
  code: string;
  category:
    | "auth"
    | "permissions"
    | "quota"
    | "validation"
    | "provider"
    | "network"
    | "format"
    | "copyright"
    | "factual"
    | "budget"
    | "unknown";
  message: string;
  userMessage: string;
  retryable: boolean;
  provider?: string;
  details?: unknown;
};
```

Do not show raw provider messages such as `Error 400` to the user. Show clear recovery guidance.

## Retry policy

Retry only:

- timeout
- network error
- temporary provider error
- provider unavailable
- unknown status

Do not retry:

- invalid API key
- missing permission
- exceeded budget
- rejected format
- unapproved music
- repeated schema error

## Video fallback policy

Default order:

```txt
Veo -> Runway -> Kling -> Mock
```

Fallback requires human approval when:

- cost increases
- quality drops
- provider is not approved
- publication is imminent
- content is high priority

## Critical sequences

Video generation:

1. user clicks generate video
2. backend validates project, script, and storyboard
3. cost control checks budget
4. video-generation job is created
5. worker selects provider
6. provider starts async generation
7. external job id is stored
8. worker polls status or waits for webhook
9. result is downloaded
10. storage provider uploads to private storage
11. asset is created
12. technical quality check runs
13. project status is updated
14. user notification is created

Editing:

1. user clicks create edit
2. backend validates assets
3. music license check runs
4. editing job is created
5. worker downloads assets into isolated temp folder
6. FFmpeg assembles clips, music, text overlays
7. preview is exported
8. preview is uploaded to storage
9. technical quality check runs
10. AI score can be refreshed
11. project moves to edit ready

Instagram publication:

1. user clicks publish or schedule
2. backend checks human validation
3. minimum score is checked
4. music validation is checked
5. connected account and scopes are checked
6. final video file is checked
7. publishing job is created
8. Instagram adapter publishes or schedules
9. platform post id is stored
10. analytics sync is scheduled

Analytics:

1. publication is live
2. analytics job runs after delay
3. provider fetches metrics
4. metrics are normalized
5. analytics agent summarizes
6. learning agent extracts insight
7. brand memory is updated
8. dashboard refreshes
