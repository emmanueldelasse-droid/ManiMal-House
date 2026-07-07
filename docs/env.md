# Environment

Start from `.env.example` and keep all provider credentials server-side.

## Required first

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: queue backend for BullMQ or equivalent
- `OPENAI_API_KEY`: LLM orchestration, ideas, scripts, captions, scoring, and analysis
- `OPENAI_MODEL`: default model name used by the OpenAI adapter
- `ENCRYPTION_KEY`: token encryption for social accounts and sensitive records
- `WEBHOOK_SECRET` or `WEBHOOK_SIGNING_SECRET`: webhook verification
- `STORAGE_PROVIDER`: local, R2, S3-compatible, or Supabase storage adapter
- `APP_URL`: public app URL used for OAuth redirects and callbacks

## Required when providers are enabled

- `RUNWAY_API_KEY`: Runway video generation
- `KLING_API_KEY`: Kling video generation
- `ELEVENLABS_API_KEY`: voice generation
- `R2_*`: Cloudflare R2 storage
- `META_*`: Instagram and Facebook publishing
- `TIKTOK_*`: TikTok posting flow
- `GOOGLE_*`: YouTube Data API upload and analytics

## Frontend rule

Do not expose provider keys through `NEXT_PUBLIC_*`. The browser should call the backend, and the backend should call providers.
