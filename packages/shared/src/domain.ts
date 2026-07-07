export const socialPlatforms = [
  "instagram",
  "tiktok",
  "youtube",
  "facebook",
  "snapchat",
  "pinterest"
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export const contentStatuses = [
  "idea",
  "scripted",
  "storyboard_ready",
  "assets_pending",
  "assets_generated",
  "editing",
  "edited",
  "preview_ready",
  "quality_checked",
  "needs_review",
  "approved",
  "scheduled",
  "published",
  "failed",
  "archived"
] as const;

export type ContentStatus = (typeof contentStatuses)[number];

export type AutomationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  plan: "internal" | "starter" | "studio" | "agency";
  monthlyBudgetCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrandVisualIdentity {
  palette: string[];
  typography: string;
  motif: string;
  imageStyle: string;
  overlayStyle: string;
}

export interface Brand {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  niche: string;
  language: string;
  country: string;
  city: string;
  tone: string[];
  visualIdentity: BrandVisualIdentity;
  editorialRules: string[];
  forbiddenTopics: string[];
  postingFrequency: string;
  automationLevel: AutomationLevel;
  status: "draft" | "active" | "paused" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  brandId: string;
  platform: SocialPlatform;
  accountName: string;
  accountId: string;
  permissions: string[];
  status: "connected" | "needs_reauth" | "missing_permissions" | "not_connected";
  tokenExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentIdea {
  id: string;
  brandId: string;
  title: string;
  concept: string;
  hook: string;
  angle: string;
  platformTarget: SocialPlatform;
  estimatedDurationSeconds: number;
  visualStyle: string;
  musicStyle: string;
  potentialScore: number;
  riskScore: number;
  selected: boolean;
  justification: string;
  createdAt: string;
}

export interface StoryboardScene {
  id: string;
  order: number;
  durationSeconds: number;
  visualPrompt: string;
  onScreenText: string;
  cameraDirection: string;
  audioDirection: string;
}

export interface ContentProject {
  id: string;
  brandId: string;
  ideaId: string;
  status: ContentStatus;
  title: string;
  script: string;
  storyboard: StoryboardScene[];
  caption: string;
  hashtags: string[];
  cta: string;
  globalScore: number;
  createdAt: string;
  updatedAt: string;
}

export type AssetType =
  | "raw_video"
  | "generated_video"
  | "generated_image"
  | "voiceover"
  | "music"
  | "subtitle_file"
  | "thumbnail"
  | "final_export";

export interface Asset {
  id: string;
  contentProjectId: string;
  type: AssetType;
  provider: string;
  url: string;
  storagePath: string;
  metadata: Record<string, string | number | boolean>;
  costEstimateCents: number;
  status: "pending" | "ready" | "failed" | "blocked";
  createdAt: string;
}

export interface MusicTrack {
  id: string;
  workspaceId: string;
  title: string;
  artist: string;
  source: string;
  licenseType: "user_owned" | "royalty_free" | "licensed_library" | "generated";
  licenseDocumentUrl?: string;
  bpm: number;
  mood: string;
  energyLevel: number;
  fileUrl: string;
  approvedForUse: boolean;
  createdAt: string;
}

export interface WorkflowStage {
  id: string;
  label: string;
  status: "queued" | "running" | "complete" | "needs_review" | "blocked";
  scheduledAt: string;
  owner: "system" | "editor";
}

export interface CostEntry {
  id: string;
  workspaceId: string;
  brandId: string;
  contentProjectId: string;
  provider: string;
  operationType: string;
  estimatedCostCents: number;
  actualCostCents?: number;
  createdAt: string;
}

export interface Learning {
  id: string;
  brandId: string;
  insightType: "hook" | "visual" | "music" | "timing" | "platform" | "risk";
  insight: string;
  confidenceScore: number;
  supportingData: string;
  recommendation: string;
  createdAt: string;
}
