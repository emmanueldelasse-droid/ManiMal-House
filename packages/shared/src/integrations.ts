import type { MusicTrack, SocialPlatform } from "./domain";

export type ProviderKind =
  | "llm"
  | "video"
  | "image"
  | "voice"
  | "music"
  | "editing"
  | "storage"
  | "publishing"
  | "analytics"
  | "search"
  | "cost";

export type ProviderName =
  | "openai"
  | "runway"
  | "kling"
  | "veo"
  | "elevenlabs"
  | "ffmpeg"
  | "cloudflare_r2"
  | "s3"
  | "supabase_storage"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "mock";

export type ProviderHealthStatus =
  | "available"
  | "not_configured"
  | "degraded"
  | "unavailable"
  | "mock_only";

export type AppErrorCategory =
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

export interface AppError {
  code: string;
  category: AppErrorCategory;
  message: string;
  userMessage: string;
  retryable: boolean;
  provider?: ProviderName | string;
  details?: unknown;
}

export interface ProviderError extends AppError {
  provider: ProviderName | string;
}

export type ProviderResponse<T> =
  | {
      ok: true;
      provider: ProviderName | string;
      data: T;
      costEstimateCents?: number;
      durationMs?: number;
      externalId?: string;
    }
  | {
      ok: false;
      provider: ProviderName | string;
      error: ProviderError;
      costEstimateCents?: number;
      durationMs?: number;
      externalId?: string;
    };

export interface RetryPolicy {
  maxAttempts: number;
  backoff: "fixed" | "linear" | "exponential";
  baseDelayMs: number;
  maxDelayMs: number;
  retryableCategories: AppErrorCategory[];
  retryableCodes: string[];
}

export interface FallbackPolicy {
  enabled: boolean;
  order: ProviderName[];
  requireApprovalWhenCostIncreases: boolean;
  requireApprovalWhenQualityDrops: boolean;
  allowOnlyForDrafts: boolean;
}

export type VideoProviderName = "runway" | "kling" | "veo" | "mock";

export interface TextToVideoInput {
  brandId: string;
  contentProjectId: string;
  prompt: string;
  negativePrompt?: string;
  durationSeconds: number;
  aspectRatio: "9:16" | "1:1" | "16:9";
  quality: "draft" | "standard" | "high";
  seed?: number;
  referenceStyle?: string;
  maxCostCents?: number;
}

export interface ImageToVideoInput extends TextToVideoInput {
  imageUrl: string;
}

export type ProviderJobStatus =
  | "queued"
  | "running"
  | "waiting_provider"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "retrying";

export interface VideoGenerationJob {
  provider: VideoProviderName;
  externalJobId: string;
  status: ProviderJobStatus;
  estimatedCostCents?: number;
  estimatedDurationSeconds?: number;
  createdAt: string;
}

export interface VideoGenerationStatus extends VideoGenerationJob {
  progress: number;
  resultUrl?: string;
  error?: ProviderError;
}

export interface DownloadedVideoAsset {
  externalJobId: string;
  provider: VideoProviderName;
  fileName: string;
  mimeType: "video/mp4" | "video/quicktime";
  sizeBytes: number;
  durationSeconds: number;
  localPath?: string;
  sourceUrl?: string;
}

export interface GenerateImageInput {
  contentProjectId: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: "9:16" | "1:1" | "16:9";
  purpose: "reference" | "thumbnail" | "cover" | "carousel" | "moodboard" | "image_to_video_seed";
}

export interface EditImageInput extends GenerateImageInput {
  imageUrl: string;
  editInstruction: string;
}

export interface ImageAsset {
  id: string;
  provider: ProviderName;
  url: string;
  storagePath: string;
  width: number;
  height: number;
  licenseStatus: "internal" | "validated" | "needs_review";
}

export interface Voice {
  id: string;
  name: string;
  language: "fr" | "en" | "multi";
  style: string;
}

export interface GenerateVoiceInput {
  text: string;
  voiceId: string;
  language: "fr" | "en";
  style?: "premium" | "calm" | "energetic" | "mysterious";
  stability?: number;
  similarityBoost?: number;
  contentProjectId: string;
}

export interface AudioAsset {
  id: string;
  provider: ProviderName;
  url: string;
  storagePath: string;
  durationSeconds: number;
  mimeType: "audio/mpeg" | "audio/wav";
}

export interface EditingClip {
  assetId: string;
  startSeconds: number;
  endSeconds: number;
  order: number;
}

export interface AudioTrackInput {
  assetId: string;
  startOffsetSeconds: number;
  volume: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
}

export interface TextOverlay {
  text: string;
  startSeconds: number;
  endSeconds: number;
  position: "top" | "center" | "bottom";
  style: "premium_minimal" | "subtitle" | "caption";
  safeArea: true;
}

export interface SubtitleInput {
  format: "srt" | "ass" | "drawtext";
  storagePath?: string;
}

export interface WatermarkInput {
  imageAssetId: string;
  position: "top_left" | "top_right" | "bottom_left" | "bottom_right";
  opacity: number;
}

export interface EditingInput {
  contentProjectId: string;
  format: "instagram_reel" | "tiktok" | "youtube_short";
  aspectRatio: "9:16";
  resolution: {
    width: 1080;
    height: 1920;
  };
  clips: EditingClip[];
  music?: AudioTrackInput;
  voiceover?: AudioTrackInput;
  textOverlays: TextOverlay[];
  subtitles?: SubtitleInput;
  watermark?: WatermarkInput;
}

export interface VideoAsset {
  id: string;
  provider: ProviderName;
  url: string;
  storagePath: string;
  width: number;
  height: number;
  durationSeconds: number;
  codec: "h264" | "h265" | "prores" | "unknown";
  hasAudio: boolean;
}

export interface ThumbnailInput {
  contentProjectId: string;
  sourceVideoAssetId: string;
  timestampSeconds: number;
}

export interface UploadFileInput {
  workspaceId: string;
  brandId?: string;
  contentProjectId?: string;
  path: string;
  fileName: string;
  mimeType: string;
  buffer: Uint8Array;
  visibility: "private" | "public";
  temporary: boolean;
}

export interface StoredFile {
  storageProvider: ProviderName;
  path: string;
  sizeBytes: number;
  mimeType: string;
  version: number;
  publicUrl?: string;
  expiresAt?: string;
}

export interface PublishVideoInput {
  contentProjectId: string;
  platform: SocialPlatform;
  accountId: string;
  videoUrl: string;
  caption: string;
  hashtags: string[];
  thumbnailUrl?: string;
}

export interface ScheduleVideoInput extends PublishVideoInput {
  scheduledAt: string;
}

export interface ConnectionStatus {
  connected: boolean;
  platform: SocialPlatform;
  accountName?: string;
  missingScopes: string[];
  tokenExpiresAt?: string;
  lastError?: string;
}

export interface PublishResult {
  platform: SocialPlatform;
  platformPostId?: string;
  status: "draft" | "scheduled" | "published" | "failed" | "requires_user_action";
  userMessage: string;
}

export interface PostStatus {
  platformPostId: string;
  status: "processing" | "published" | "failed" | "deleted" | "unknown";
  error?: AppError;
}

export interface PlatformMetrics {
  platform: "instagram" | "tiktok" | "youtube";
  platformPostId: string;
  views?: number | null;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  saves?: number | null;
  followersGained?: number | null;
  watchTimeSeconds?: number | null;
  completionRate?: number | null;
  clicks?: number | null;
  collectedAt: string;
}

export interface FetchPostMetricsInput {
  platform: SocialPlatform;
  platformPostId: string;
  accountId: string;
}

export interface TrendSearchInput {
  brandId: string;
  query: string;
  date: string;
  locale: string;
}

export interface VerifiedSource {
  title: string;
  url: string;
  retrievedAt: string;
  publisher?: string;
}

export interface TrendSearchResult {
  summary: string;
  sources: VerifiedSource[];
  warnings: string[];
}

export interface VerifyClaimInput {
  claim: string;
  requiredSourceTypes: Array<"event" | "weather" | "venue" | "artist" | "statistic" | "price" | "ranking">;
}

export interface ClaimVerificationResult {
  verified: boolean;
  sources: VerifiedSource[];
  safeRewrite?: string;
  userMessage: string;
}

export interface ListTracksInput {
  workspaceId: string;
  brandId?: string;
  platforms?: SocialPlatform[];
}

export interface UploadTrackInput {
  workspaceId: string;
  title: string;
  artist?: string;
  source: string;
  licenseType: string;
  proofUrl?: string;
  allowedPlatforms: SocialPlatform[];
  commercialUseAllowed: boolean;
  expiresAt?: string;
}

export interface ValidateLicenseInput {
  trackId: string;
  reviewerId: string;
  approved: boolean;
  note: string;
}

export type LicenseStatus = "validated" | "needs_review" | "blocked" | "expired" | "internal_only";

export interface SelectTrackInput {
  workspaceId: string;
  brandId: string;
  mood: string;
  bpmRange: [number, number];
  durationSeconds: number;
  platforms: SocialPlatform[];
}

export interface MusicTrackSelection {
  track?: MusicTrack;
  alternatives: MusicTrack[];
  licenseStatus: LicenseStatus;
  allowedForPublication: boolean;
  warning?: string;
}

export interface OAuthConnection {
  id: string;
  workspaceId: string;
  brandId: string;
  platform: SocialPlatform;
  accountName: string;
  platformAccountId: string;
  scopes: string[];
  status: "connected" | "needs_reauth" | "missing_scopes" | "revoked" | "not_connected";
  tokenExpiresAt?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export type QueueName =
  | "ai-generation-queue"
  | "video-generation-queue"
  | "editing-queue"
  | "publishing-queue"
  | "analytics-queue"
  | "learning-queue"
  | "cleanup-queue";

export type JobStatus =
  | "pending"
  | "queued"
  | "running"
  | "waiting_provider"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "retrying";

export interface IntegrationJob {
  id: string;
  workspaceId: string;
  brandId?: string;
  contentProjectId?: string;
  type: QueueName;
  provider?: ProviderName | string;
  status: JobStatus;
  progress: number;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: AppError;
  attempts: number;
  maxAttempts: number;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  provider: ProviderName | string;
  eventType: string;
  externalEventId: string;
  payload: Record<string, unknown>;
  signatureValid: boolean;
  processed: boolean;
  processedAt?: string;
  createdAt: string;
}

export interface EnvVariableRequirement {
  name: string;
  requiredIn: Array<"local" | "staging" | "production">;
  secret: boolean;
  purpose: string;
}

export interface ProviderRegistryEntry {
  provider: ProviderName;
  kind: ProviderKind;
  status: ProviderHealthStatus;
  configured: boolean;
  phase: 1 | 2 | 3 | 4;
  supports: string[];
  requiredEnv: string[];
  averageLatencyMs?: number;
  successRate?: number;
  lastError?: string;
}

export interface IntegrationPhase {
  phase: 1 | 2 | 3 | 4;
  name: string;
  goal: string;
  providers: ProviderName[];
}

export interface BackendRouteDefinition {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  createsJob: boolean;
  queue?: QueueName;
}

export interface MonitoringAlert {
  id: string;
  label: string;
  severity: "info" | "warning" | "critical";
  metric: string;
  threshold: string;
  status: "ok" | "triggered" | "muted";
}

export const defaultRetryPolicy: RetryPolicy = {
  maxAttempts: 3,
  backoff: "exponential",
  baseDelayMs: 5000,
  maxDelayMs: 60000,
  retryableCategories: ["network", "provider", "unknown"],
  retryableCodes: ["TIMEOUT", "NETWORK_ERROR", "PROVIDER_UNAVAILABLE", "STATUS_UNKNOWN"]
};

export const defaultVideoFallbackPolicy: FallbackPolicy = {
  enabled: true,
  order: ["veo", "runway", "kling", "mock"],
  requireApprovalWhenCostIncreases: true,
  requireApprovalWhenQualityDrops: true,
  allowOnlyForDrafts: true
};

export const providerRegistry: ProviderRegistryEntry[] = [
  {
    provider: "openai",
    kind: "llm",
    status: "not_configured",
    configured: false,
    phase: 1,
    supports: ["ideas", "hooks", "scripts", "storyboards", "scoring", "learning"],
    requiredEnv: ["OPENAI_API_KEY", "OPENAI_MODEL"]
  },
  {
    provider: "ffmpeg",
    kind: "editing",
    status: "available",
    configured: true,
    phase: 1,
    supports: ["preview", "final_export", "thumbnail", "text_overlays"],
    requiredEnv: []
  },
  {
    provider: "mock",
    kind: "video",
    status: "mock_only",
    configured: true,
    phase: 1,
    supports: ["text_to_video", "image_to_video", "local_dev"],
    requiredEnv: [],
    averageLatencyMs: 250,
    successRate: 1
  },
  {
    provider: "runway",
    kind: "video",
    status: "not_configured",
    configured: false,
    phase: 2,
    supports: ["text_to_video", "image_to_video", "async_generation"],
    requiredEnv: ["RUNWAY_API_KEY"]
  },
  {
    provider: "kling",
    kind: "video",
    status: "not_configured",
    configured: false,
    phase: 2,
    supports: ["text_to_video", "image_to_video", "async_generation"],
    requiredEnv: ["KLING_API_KEY"]
  },
  {
    provider: "veo",
    kind: "video",
    status: "not_configured",
    configured: false,
    phase: 2,
    supports: ["future_video_generation"],
    requiredEnv: []
  },
  {
    provider: "elevenlabs",
    kind: "voice",
    status: "not_configured",
    configured: false,
    phase: 2,
    supports: ["text_to_speech", "voice_library"],
    requiredEnv: ["ELEVENLABS_API_KEY"]
  },
  {
    provider: "cloudflare_r2",
    kind: "storage",
    status: "not_configured",
    configured: false,
    phase: 1,
    supports: ["private_upload", "signed_url", "versioned_exports"],
    requiredEnv: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]
  },
  {
    provider: "instagram",
    kind: "publishing",
    status: "not_configured",
    configured: false,
    phase: 3,
    supports: ["reels", "schedule", "metrics"],
    requiredEnv: ["META_APP_ID", "META_APP_SECRET", "META_REDIRECT_URI"]
  },
  {
    provider: "tiktok",
    kind: "publishing",
    status: "not_configured",
    configured: false,
    phase: 4,
    supports: ["draft_upload", "direct_post_when_approved"],
    requiredEnv: ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REDIRECT_URI"]
  },
  {
    provider: "youtube",
    kind: "publishing",
    status: "not_configured",
    configured: false,
    phase: 4,
    supports: ["shorts_export", "videos_insert", "metrics"],
    requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"]
  }
];

export const integrationPhases: IntegrationPhase[] = [
  {
    phase: 1,
    name: "MVP exportable",
    goal: "Create complete content with manual upload and MP4 export.",
    providers: ["openai", "ffmpeg", "cloudflare_r2", "mock"]
  },
  {
    phase: 2,
    name: "Automated production",
    goal: "Add real video, image, voice, and advanced music workflows.",
    providers: ["runway", "kling", "veo", "elevenlabs"]
  },
  {
    phase: 3,
    name: "Instagram loop",
    goal: "Schedule, publish, and measure Instagram content.",
    providers: ["instagram"]
  },
  {
    phase: 4,
    name: "Multi-platform",
    goal: "Add TikTok, YouTube Shorts, and cross-platform adaptation.",
    providers: ["tiktok", "youtube"]
  }
];

export const queueDefinitions: Array<{ name: QueueName; purpose: string; longRunning: boolean }> = [
  { name: "ai-generation-queue", purpose: "Structured LLM generations", longRunning: false },
  { name: "video-generation-queue", purpose: "Async video provider jobs", longRunning: true },
  { name: "editing-queue", purpose: "FFmpeg preview and final exports", longRunning: true },
  { name: "publishing-queue", purpose: "Social publishing and scheduling", longRunning: true },
  { name: "analytics-queue", purpose: "Post metrics sync", longRunning: false },
  { name: "learning-queue", purpose: "Brand memory and insights", longRunning: false },
  { name: "cleanup-queue", purpose: "Temporary file cleanup", longRunning: false }
];

export const backendRoutes: BackendRouteDefinition[] = [
  { method: "POST", path: "/api/brands", createsJob: false },
  { method: "GET", path: "/api/brands", createsJob: false },
  { method: "POST", path: "/api/content/ideas/generate", createsJob: true, queue: "ai-generation-queue" },
  { method: "POST", path: "/api/content/projects/:id/generate-video", createsJob: true, queue: "video-generation-queue" },
  { method: "POST", path: "/api/content/projects/:id/create-edit", createsJob: true, queue: "editing-queue" },
  { method: "POST", path: "/api/content/projects/:id/score", createsJob: true, queue: "ai-generation-queue" },
  { method: "POST", path: "/api/assets/upload", createsJob: false },
  { method: "GET", path: "/api/assets/:id/signed-url", createsJob: false },
  { method: "POST", path: "/api/publications/schedule", createsJob: true, queue: "publishing-queue" },
  { method: "POST", path: "/api/publications/publish", createsJob: true, queue: "publishing-queue" },
  { method: "GET", path: "/api/analytics/brand/:brandId", createsJob: true, queue: "analytics-queue" },
  { method: "GET", path: "/api/costs", createsJob: false }
];

export const envRequirements: EnvVariableRequirement[] = [
  { name: "DATABASE_URL", requiredIn: ["local", "staging", "production"], secret: true, purpose: "PostgreSQL database" },
  { name: "REDIS_URL", requiredIn: ["local", "staging", "production"], secret: true, purpose: "Queue backend" },
  { name: "OPENAI_API_KEY", requiredIn: ["staging", "production"], secret: true, purpose: "LLM provider" },
  { name: "OPENAI_MODEL", requiredIn: ["staging", "production"], secret: false, purpose: "Default LLM model" },
  { name: "RUNWAY_API_KEY", requiredIn: ["production"], secret: true, purpose: "Runway video provider" },
  { name: "KLING_API_KEY", requiredIn: ["production"], secret: true, purpose: "Kling video provider" },
  { name: "ELEVENLABS_API_KEY", requiredIn: ["production"], secret: true, purpose: "Voice provider" },
  { name: "STORAGE_PROVIDER", requiredIn: ["local", "staging", "production"], secret: false, purpose: "Storage adapter selection" },
  { name: "R2_BUCKET", requiredIn: ["staging", "production"], secret: false, purpose: "R2 bucket" },
  { name: "META_APP_ID", requiredIn: ["production"], secret: false, purpose: "Meta OAuth" },
  { name: "META_APP_SECRET", requiredIn: ["production"], secret: true, purpose: "Meta OAuth secret" },
  { name: "TIKTOK_CLIENT_KEY", requiredIn: ["production"], secret: false, purpose: "TikTok OAuth" },
  { name: "GOOGLE_CLIENT_ID", requiredIn: ["production"], secret: false, purpose: "YouTube OAuth" },
  { name: "ENCRYPTION_KEY", requiredIn: ["staging", "production"], secret: true, purpose: "Token encryption" },
  { name: "WEBHOOK_SECRET", requiredIn: ["staging", "production"], secret: true, purpose: "Webhook signature validation" },
  { name: "APP_URL", requiredIn: ["staging", "production"], secret: false, purpose: "Public app URL" }
];

export const monitoringAlerts: MonitoringAlert[] = [
  {
    id: "publication_failed",
    label: "Publication failed",
    severity: "critical",
    metric: "publishing.failed.count",
    threshold: "> 0 in 15 min",
    status: "ok"
  },
  {
    id: "video_provider_unavailable",
    label: "Video provider unavailable",
    severity: "warning",
    metric: "video.provider.success_rate",
    threshold: "< 80%",
    status: "ok"
  },
  {
    id: "budget_exceeded",
    label: "Budget exceeded",
    severity: "critical",
    metric: "cost.monthly.used_ratio",
    threshold: ">= 100%",
    status: "ok"
  },
  {
    id: "token_expired",
    label: "Social token expired",
    severity: "warning",
    metric: "oauth.expired.count",
    threshold: "> 0",
    status: "triggered"
  },
  {
    id: "queue_blocked",
    label: "Queue blocked",
    severity: "critical",
    metric: "queue.waiting_provider.oldest_age",
    threshold: "> 30 min",
    status: "ok"
  }
];

export const integrationSequences = [
  {
    id: "video_generation",
    label: "Video generation",
    steps: [
      "User clicks generate video",
      "Backend validates project, script, and storyboard",
      "Cost Control checks budget",
      "video-generation job is created",
      "Worker selects provider",
      "Provider starts async generation",
      "External job id is stored",
      "Worker polls status or waits for webhook",
      "Result is downloaded",
      "StorageProvider uploads to private storage",
      "Asset is created",
      "Technical quality check runs",
      "Project status is updated",
      "User notification is created"
    ]
  },
  {
    id: "editing",
    label: "Editing",
    steps: [
      "User clicks create edit",
      "Backend validates assets",
      "Music license check runs",
      "editing job is created",
      "Worker downloads assets into isolated temp folder",
      "FFmpeg assembles clips, music, text overlays",
      "Preview is exported",
      "Preview is uploaded to storage",
      "Technical quality check runs",
      "AI score can be refreshed",
      "Project moves to edit ready"
    ]
  },
  {
    id: "instagram_publication",
    label: "Instagram publication",
    steps: [
      "User clicks publish or schedule",
      "Backend checks human validation",
      "Minimum score is checked",
      "Music validation is checked",
      "Connected account and scopes are checked",
      "Final video file is checked",
      "publishing job is created",
      "Instagram adapter publishes or schedules",
      "platformPostId is stored",
      "Analytics sync is scheduled"
    ]
  },
  {
    id: "analytics",
    label: "Analytics",
    steps: [
      "Publication is live",
      "Analytics job runs after delay",
      "Provider fetches metrics",
      "Metrics are normalized",
      "Analytics Agent summarizes",
      "Learning Agent extracts insight",
      "Brand Memory is updated",
      "Dashboard refreshes"
    ]
  }
];

export function shouldRetryProviderError(error: AppError, policy: RetryPolicy = defaultRetryPolicy): boolean {
  if (!error.retryable) {
    return false;
  }

  return policy.retryableCategories.includes(error.category) || policy.retryableCodes.includes(error.code);
}

export function normalizeProviderError(input: {
  provider: ProviderName | string;
  code: string;
  category: AppErrorCategory;
  message: string;
  userMessage: string;
  retryable: boolean;
  details?: unknown;
}): ProviderError {
  return {
    provider: input.provider,
    code: input.code,
    category: input.category,
    message: input.message,
    userMessage: input.userMessage,
    retryable: input.retryable,
    ...(input.details === undefined ? {} : { details: input.details })
  };
}

export function selectVideoFallbackProvider({
  availableProviders,
  preferredQuality,
  policy = defaultVideoFallbackPolicy
}: {
  availableProviders: ProviderName[];
  preferredQuality: "draft" | "standard" | "high";
  policy?: FallbackPolicy;
}): ProviderName {
  if (!policy.enabled) {
    return "mock";
  }

  if (preferredQuality === "high" && availableProviders.includes("veo")) {
    return "veo";
  }

  return policy.order.find((provider) => availableProviders.includes(provider)) ?? "mock";
}

export function buildStoragePath({
  workspaceId,
  brandId,
  contentProjectId,
  folder,
  fileName
}: {
  workspaceId: string;
  brandId: string;
  contentProjectId: string;
  folder: "raw" | "generated" | "exports" | "thumbnails";
  fileName: string;
}): string {
  return `workspaces/${workspaceId}/brands/${brandId}/projects/${contentProjectId}/${folder}/${fileName}`;
}
