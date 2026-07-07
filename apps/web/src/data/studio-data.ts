import {
  calculateQualityScore,
  dailyWorkflow,
  parisHouseBrand,
  sampleIdeas,
  sampleProject,
  type CostEntry,
  type Learning,
  type MusicTrack,
  type QualityScoreInput,
  type SocialAccount
} from "@creator-ai-studio/shared";

export const brand = parisHouseBrand;
export const ideas = sampleIdeas;
export const project = sampleProject;
export const workflow = dailyWorkflow;

export const initialQualityInput: QualityScoreInput = {
  hook: 92,
  visual: 88,
  rhythm: 84,
  brandFit: 94,
  originality: 78,
  retention: 86,
  share: 76,
  save: 82,
  copyrightRisk: 12,
  factualRisk: 8
};

export const initialQuality = calculateQualityScore(initialQualityInput);

export const socialAccounts: SocialAccount[] = [
  {
    id: "social_instagram_paris_house",
    brandId: brand.id,
    platform: "instagram",
    accountName: "@paris.house",
    accountId: "pending_meta_connection",
    permissions: ["content_publish", "basic_profile"],
    status: "needs_reauth",
    createdAt: "2026-07-07T00:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z"
  },
  {
    id: "social_tiktok_paris_house",
    brandId: brand.id,
    platform: "tiktok",
    accountName: "Paris House",
    accountId: "not_connected",
    permissions: [],
    status: "not_connected",
    createdAt: "2026-07-07T00:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z"
  },
  {
    id: "social_youtube_paris_house",
    brandId: brand.id,
    platform: "youtube",
    accountName: "Paris House Shorts",
    accountId: "not_connected",
    permissions: [],
    status: "not_connected",
    createdAt: "2026-07-07T00:00:00.000Z",
    updatedAt: "2026-07-07T00:00:00.000Z"
  }
];

export const musicTracks: MusicTrack[] = [
  {
    id: "track_rooftop_warmup",
    workspaceId: brand.workspaceId,
    title: "Rooftop Warmup 122",
    artist: "User library",
    source: "manual_upload",
    licenseType: "user_owned",
    licenseDocumentUrl: "/licenses/rooftop-warmup.pdf",
    bpm: 122,
    mood: "Warm afro house",
    energyLevel: 82,
    fileUrl: "/audio/rooftop-warmup.mp3",
    approvedForUse: true,
    createdAt: "2026-07-07T00:00:00.000Z"
  },
  {
    id: "track_midnight_line",
    workspaceId: brand.workspaceId,
    title: "Midnight Line",
    artist: "Generated draft",
    source: "generated",
    licenseType: "generated",
    bpm: 124,
    mood: "Minimal club pulse",
    energyLevel: 75,
    fileUrl: "/audio/midnight-line.mp3",
    approvedForUse: false,
    createdAt: "2026-07-07T00:00:00.000Z"
  }
];

export const costs: CostEntry[] = [
  {
    id: "cost_idea_generation",
    workspaceId: brand.workspaceId,
    brandId: brand.id,
    contentProjectId: project.id,
    provider: "OpenAI",
    operationType: "idea_generation",
    estimatedCostCents: 22,
    actualCostCents: 19,
    createdAt: "2026-07-07T08:15:00.000Z"
  },
  {
    id: "cost_storyboard",
    workspaceId: brand.workspaceId,
    brandId: brand.id,
    contentProjectId: project.id,
    provider: "OpenAI",
    operationType: "storyboard_generation",
    estimatedCostCents: 34,
    actualCostCents: 31,
    createdAt: "2026-07-07T09:00:00.000Z"
  },
  {
    id: "cost_edit",
    workspaceId: brand.workspaceId,
    brandId: brand.id,
    contentProjectId: project.id,
    provider: "FFmpeg worker",
    operationType: "editing_job",
    estimatedCostCents: 8,
    createdAt: "2026-07-07T10:30:00.000Z"
  }
];

export const learnings: Learning[] = [
  {
    id: "learning_short_hooks",
    brandId: brand.id,
    insightType: "hook",
    insight: "Hooks under six words are the strongest current hypothesis.",
    confidenceScore: 62,
    supportingData: "Early manual benchmark across Paris House draft concepts.",
    recommendation: "Keep the first text beat short and atmospheric.",
    createdAt: "2026-07-07T11:00:00.000Z"
  },
  {
    id: "learning_music_rights",
    brandId: brand.id,
    insightType: "risk",
    insight: "Music clearance is the main export blocker.",
    confidenceScore: 78,
    supportingData: "One approved upload and one generated track without final license note.",
    recommendation: "Require a rights note before final MP4 export.",
    createdAt: "2026-07-07T11:05:00.000Z"
  }
];

export const previewImage =
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85";
