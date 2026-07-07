import {
  aiAgentDefinitions,
  aiPromptDefinitions,
  aiRegressionCases,
  aiStructuredOutputSchemas,
  aiWorkflowStages,
  calculateQualityScore,
  dailyWorkflow,
  parisHouseBrandMemory,
  parisHouseBrand,
  sampleIdeas,
  sampleProject,
  type AiAgentRunLog,
  type AiOrchestrationDecision,
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

export type StudioPage =
  | "onboarding"
  | "dashboard"
  | "brands"
  | "identity"
  | "calendar"
  | "ideas"
  | "studio"
  | "videos"
  | "music"
  | "publications"
  | "analytics"
  | "ai-engine"
  | "learnings"
  | "costs"
  | "social"
  | "settings";

export type StudioStep =
  | "idea"
  | "script"
  | "storyboard"
  | "assets"
  | "edit"
  | "score"
  | "publication";

export type ContentLifecycleStatus =
  | "idea"
  | "scripted"
  | "storyboard_ready"
  | "assets_running"
  | "assets_ready"
  | "editing"
  | "edit_ready"
  | "scored"
  | "needs_review"
  | "approved"
  | "scheduled"
  | "published"
  | "error"
  | "archived";

export interface DashboardTask {
  id: string;
  title: string;
  detail: string;
  status: ContentLifecycleStatus | "music_unverified" | "token_expiring";
  action: string;
}

export interface CalendarItem {
  id: string;
  day: string;
  date: string;
  title: string;
  platform: string;
  time: string;
  score: number;
  status: ContentLifecycleStatus;
}

export interface VideoLibraryItem {
  id: string;
  title: string;
  brandName: string;
  status: ContentLifecycleStatus;
  score: number;
  platform: string;
  date: string;
  duration: string;
  views: string;
  provider: string;
}

export interface StudioAsset {
  id: string;
  type: string;
  provider: string;
  status: "pending" | "generating" | "ready" | "error" | "rejected" | "approved";
  cost: string;
  duration: string;
  quality: number;
  license: "approved" | "needs_review" | "internal_only";
}

export interface PublicationItem {
  id: string;
  date: string;
  brandName: string;
  contentTitle: string;
  platform: string;
  status: "draft" | "ready" | "scheduled" | "publishing" | "published" | "error" | "cancelled";
  score: number;
  time: string;
  error?: string;
}

export interface ApiKeyStatus {
  id: string;
  provider: string;
  maskedKey: string;
  status: "valid" | "missing" | "invalid";
  lastChecked: string;
}

export const topStats = [
  { label: "In progress", value: "3", detail: "1 needs review" },
  { label: "Next post", value: "18:30", detail: "Instagram Reels" },
  { label: "Avg score", value: "82", detail: "+4 this week" },
  { label: "Budget", value: "$42", detail: "of $150" },
  { label: "Growth", value: "+124", detail: "last 7 days" }
];

export const dashboardTasks: DashboardTask[] = [
  {
    id: "task_review",
    title: "Validate Blue hour rooftop pulse",
    detail: "Score 84, music approved, final export waiting for review.",
    status: "needs_review",
    action: "Open Studio"
  },
  {
    id: "task_music",
    title: "Clear Midnight Line rights",
    detail: "This track is marked generated draft and cannot ship yet.",
    status: "music_unverified",
    action: "Open Music"
  },
  {
    id: "task_token",
    title: "Reconnect Instagram",
    detail: "Meta permissions need a fresh validation before scheduling.",
    status: "token_expiring",
    action: "Reconnect"
  }
];

export const performanceStats = [
  { label: "Views 7d", value: "18.4k" },
  { label: "Likes", value: "1.2k" },
  { label: "Shares", value: "218" },
  { label: "Saves", value: "341" },
  { label: "Followers", value: "+124" }
];

export const calendarItems: CalendarItem[] = [
  {
    id: "cal_today",
    day: "Tue",
    date: "Jul 7",
    title: "Blue hour rooftop pulse",
    platform: "Instagram",
    time: "18:30",
    score: 84,
    status: "needs_review"
  },
  {
    id: "cal_wed",
    day: "Wed",
    date: "Jul 8",
    title: "Seine afterwork drift",
    platform: "TikTok",
    time: "19:15",
    score: 81,
    status: "scripted"
  },
  {
    id: "cal_thu",
    day: "Thu",
    date: "Jul 9",
    title: "Doors after midnight",
    platform: "Instagram",
    time: "20:00",
    score: 84,
    status: "storyboard_ready"
  },
  {
    id: "cal_fri",
    day: "Fri",
    date: "Jul 10",
    title: "Golden rain bassline",
    platform: "YouTube",
    time: "18:45",
    score: 78,
    status: "idea"
  },
  {
    id: "cal_sat",
    day: "Sat",
    date: "Jul 11",
    title: "Somewhere above Paris",
    platform: "Instagram",
    time: "21:00",
    score: 86,
    status: "scheduled"
  },
  {
    id: "cal_sun",
    day: "Sun",
    date: "Jul 12",
    title: "Sunday rooftop low lights",
    platform: "TikTok",
    time: "20:30",
    score: 80,
    status: "assets_running"
  },
  {
    id: "cal_mon",
    day: "Mon",
    date: "Jul 13",
    title: "City lights no explanation",
    platform: "Instagram",
    time: "19:00",
    score: 83,
    status: "idea"
  }
];

export const videoLibrary: VideoLibraryItem[] = [
  {
    id: "video_blue_hour",
    title: "Blue hour rooftop pulse",
    brandName: "Paris House",
    status: "needs_review",
    score: 84,
    platform: "Instagram",
    date: "Jul 7",
    duration: "22s",
    views: "-",
    provider: "Manual upload + FFmpeg"
  },
  {
    id: "video_sunset",
    title: "Somewhere above Paris",
    brandName: "Paris House",
    status: "scheduled",
    score: 86,
    platform: "Instagram",
    date: "Jul 11",
    duration: "19s",
    views: "-",
    provider: "Mock video"
  },
  {
    id: "video_rain",
    title: "Rain on the bassline",
    brandName: "Paris House",
    status: "published",
    score: 79,
    platform: "TikTok",
    date: "Jul 4",
    duration: "18s",
    views: "7.8k",
    provider: "Manual upload"
  }
];

export const studioAssets: StudioAsset[] = [
  {
    id: "asset_uploaded_clip",
    type: "Uploaded video",
    provider: "User upload",
    status: "approved",
    cost: "$0.00",
    duration: "18s",
    quality: 86,
    license: "approved"
  },
  {
    id: "asset_music",
    type: "Music",
    provider: "User library",
    status: "approved",
    cost: "$0.00",
    duration: "22s",
    quality: 82,
    license: "approved"
  },
  {
    id: "asset_subtitles",
    type: "Subtitles",
    provider: "OpenAI",
    status: "ready",
    cost: "$0.04",
    duration: "22s",
    quality: 90,
    license: "internal_only"
  }
];

export const publicationItems: PublicationItem[] = [
  {
    id: "pub_export",
    date: "Jul 7",
    brandName: "Paris House",
    contentTitle: "Blue hour rooftop pulse",
    platform: "Instagram",
    status: "ready",
    score: 84,
    time: "18:30"
  },
  {
    id: "pub_scheduled",
    date: "Jul 11",
    brandName: "Paris House",
    contentTitle: "Somewhere above Paris",
    platform: "Instagram",
    status: "scheduled",
    score: 86,
    time: "21:00"
  },
  {
    id: "pub_error",
    date: "Jul 6",
    brandName: "Paris House",
    contentTitle: "Midnight Line draft",
    platform: "TikTok",
    status: "error",
    score: 72,
    time: "20:15",
    error:
      "TikTok cannot receive this draft because the selected music is not approved for publication."
  }
];

export const analyticsRows = [
  {
    content: "Rain on the bassline",
    platform: "TikTok",
    date: "Jul 4",
    views: "7,812",
    likes: "612",
    shares: "91",
    saves: "124",
    followers: "+38",
    score: 79,
    performance: "Above expected"
  },
  {
    content: "Golden bridge loop",
    platform: "Instagram",
    date: "Jul 2",
    views: "5,421",
    likes: "344",
    shares: "52",
    saves: "97",
    followers: "+24",
    score: 82,
    performance: "Good"
  },
  {
    content: "Club light closeups",
    platform: "Instagram",
    date: "Jun 30",
    views: "2,014",
    likes: "120",
    shares: "18",
    saves: "31",
    followers: "+8",
    score: 68,
    performance: "Weak rhythm"
  }
];

export const validationChecklist = [
  { label: "Correct 9:16 format", complete: true },
  { label: "Video readable", complete: true },
  { label: "Audio present", complete: true },
  { label: "Music rights approved", complete: true },
  { label: "Score above threshold", complete: true },
  { label: "Caption ready", complete: true },
  { label: "Hashtags clean", complete: true },
  { label: "Social account connected", complete: false },
  { label: "No blocking factual claim", complete: true },
  { label: "User approval", complete: false }
];

export const apiKeys: ApiKeyStatus[] = [
  { id: "key_openai", provider: "OpenAI", maskedKey: "sk-...9K2p", status: "valid", lastChecked: "Today" },
  { id: "key_runway", provider: "Runway", maskedKey: "rw-...11Qa", status: "missing", lastChecked: "Never" },
  { id: "key_kling", provider: "Kling", maskedKey: "kl-...44Rt", status: "missing", lastChecked: "Never" },
  { id: "key_eleven", provider: "ElevenLabs", maskedKey: "el-...73Mv", status: "invalid", lastChecked: "Yesterday" }
];

export const aiAgents = aiAgentDefinitions;
export const aiPrompts = aiPromptDefinitions;
export const aiSchemas = aiStructuredOutputSchemas;
export const aiPlanSteps = aiWorkflowStages;
export const brandMemory = parisHouseBrandMemory;
export const regressionCases = aiRegressionCases;

export const aiDecisions: AiOrchestrationDecision[] = [
  {
    id: "decision_video_gate",
    agentId: "cost_control",
    decision: "Video generation stays blocked until idea and script are validated.",
    reason: "Tome 3 forbids expensive generation without approved creative inputs and available budget.",
    status: "needs_human_validation"
  },
  {
    id: "decision_music_rights",
    agentId: "music_matching",
    decision: "Use Rooftop Warmup 122 for final export.",
    reason: "It is the only track currently marked approved for publication.",
    status: "accepted"
  },
  {
    id: "decision_no_voice",
    agentId: "voice",
    decision: "No voiceover recommended.",
    reason: "Paris House should keep the music and atmosphere dominant for this concept.",
    status: "accepted"
  },
  {
    id: "decision_human_review",
    agentId: "quality_scoring",
    decision: "Human validation required before publication.",
    reason: "The global score is below 85 and Instagram connection still needs reauthorization.",
    status: "needs_human_validation"
  }
];

export const aiLogs: AiAgentRunLog[] = [
  {
    id: "ai_log_brand",
    agentId: "brand_strategist",
    model: "mock-structured-output-model",
    status: "complete",
    inputSummary: "Paris House brand settings and editorial rules",
    outputSummary: "Operational brand brief generated with preferred hooks and safety rules.",
    schemaKey: "brandBrief",
    estimatedCostCents: 8,
    durationMs: 410,
    contentProjectId: project.id,
    userId: "user_demo",
    createdAt: "2026-07-07T08:00:00.000Z"
  },
  {
    id: "ai_log_ideas",
    agentId: "idea_generation",
    model: "mock-structured-output-model",
    status: "complete",
    inputSummary: "Brand brief, memory, budget, Instagram Reels target",
    outputSummary: "Five differentiated concepts requested, three visible in the MVP queue.",
    schemaKey: "ideas",
    estimatedCostCents: 22,
    durationMs: 780,
    contentProjectId: project.id,
    userId: "user_demo",
    createdAt: "2026-07-07T08:15:00.000Z"
  },
  {
    id: "ai_log_quality",
    agentId: "quality_scoring",
    model: "mock-structured-output-model",
    status: "needs_human_validation",
    inputSummary: "Blue hour rooftop pulse storyboard and asset plan",
    outputSummary: "Score is publishable with human validation; scene 2 should be shorter.",
    schemaKey: "qualityScore",
    estimatedCostCents: 10,
    durationMs: 520,
    contentProjectId: project.id,
    userId: "user_demo",
    createdAt: "2026-07-07T11:00:00.000Z"
  },
  {
    id: "ai_log_cost",
    agentId: "cost_control",
    model: "mock-structured-output-model",
    status: "blocked",
    inputSummary: "Requested video generation with provider fallback",
    outputSummary: "Blocked until idea, script, budget, provider, and human validation are aligned.",
    schemaKey: "costCheck",
    estimatedCostCents: 2,
    durationMs: 160,
    contentProjectId: project.id,
    userId: "user_demo",
    createdAt: "2026-07-07T11:10:00.000Z"
  }
];

export const onboardingSteps = [
  {
    label: "Welcome",
    title: "Bienvenue dans Creator AI Studio",
    detail: "Créez, automatisez et améliorez vos marques médias avec l'IA."
  },
  {
    label: "Workspace",
    title: "Creator Studio Paris",
    detail: "Personal workspace focused on launching several vertical media brands."
  },
  {
    label: "First brand",
    title: "Paris House",
    detail: "House Music / Nightlife, Paris, short French and English captions, Instagram first."
  },
  {
    label: "Style",
    title: "Luxury cinematic nightlife",
    detail: "Premium, mysterious, urban, rooftops, Seine, gold lights, clean hooks."
  },
  {
    label: "Automation",
    title: "Production assisted",
    detail: "The AI prepares content, and human validation stays mandatory."
  },
  {
    label: "First content",
    title: "Generate first ideas",
    detail: "Five Paris House concepts are ready for review."
  }
];
