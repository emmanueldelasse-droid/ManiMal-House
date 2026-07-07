# Provider Adapters

Provider integrations must implement the interfaces in `packages/shared/src/providers.ts`.

## LLM

OpenAI should be the first real `LlmProvider`.

Responsibilities:

- generate content ideas
- generate scripts
- create captions, hashtags, and CTA
- score content
- summarize sourced trend context
- analyze performance and generate learnings

## Video

Implement one adapter per provider:

- `RunwayVideoProvider`
- `KlingVideoProvider`
- `VeoVideoProvider`
- `MockVideoProvider` for local development only

The product must store provider, prompt, model, cost estimate, status, and result URL for every generation.

## Voice

Implement `ElevenLabsVoiceProvider` when voiceover enters Phase 2.

## Publishing

Implement one publishing provider per platform:

- `InstagramPublishingProvider`
- `TikTokPublishingProvider`
- `YouTubePublishingProvider`

Publishing providers must validate permissions, token expiry, account status, publication status, retry behavior, and metrics collection.

## Factual claims

Adapters may propose ideas from trend data, but any real venue, artist, date, event, price, or availability claim must include source metadata before it can be approved.
