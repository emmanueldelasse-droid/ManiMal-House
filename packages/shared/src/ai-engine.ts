import type { Brand, ContentIdea, ContentProject, MusicTrack, SocialPlatform } from "./domain";
import type { QualityScoreInput, QualityScoreResult } from "./scoring";

export type AiAgentId =
  | "brand_strategist"
  | "trend_research"
  | "idea_generation"
  | "hook"
  | "script"
  | "storyboard"
  | "prompt_engineering"
  | "music_matching"
  | "voice"
  | "editing_recommendation"
  | "quality_scoring"
  | "copyright_risk"
  | "factual_verification"
  | "platform_adaptation"
  | "publishing_recommendation"
  | "analytics"
  | "learning"
  | "cost_control";

export type AiMvpPhase = 1 | 2 | 3 | 4;

export type AiAgentStatus =
  | "queued"
  | "running"
  | "complete"
  | "blocked"
  | "needs_human_validation"
  | "skipped"
  | "failed";

export type RiskLevel = "low" | "medium" | "high" | "blocking";

export type ConfidenceLevel = "low" | "medium" | "high";

export type JsonSchema = {
  type: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: string[];
  additionalProperties?: boolean;
};

export interface AiAgentDefinition {
  id: AiAgentId;
  name: string;
  phase: AiMvpPhase;
  role: string;
  inputs: string[];
  outputs: string[];
  structuredOutputRequired: boolean;
  canBlockPublication: boolean;
}

export interface AiPromptDefinition {
  agentId: AiAgentId;
  systemPrompt: string;
  outputSchemaKey: keyof typeof aiStructuredOutputSchemas;
  safetyNotes: string[];
}

export interface AiAgentRunLog {
  id: string;
  agentId: AiAgentId;
  model: string;
  status: AiAgentStatus;
  inputSummary: string;
  outputSummary: string;
  schemaKey: keyof typeof aiStructuredOutputSchemas;
  estimatedCostCents: number;
  durationMs: number;
  contentProjectId?: string;
  userId: string;
  createdAt: string;
  error?: string;
}

export interface AiOrchestrationDecision {
  id: string;
  agentId: AiAgentId;
  decision: string;
  reason: string;
  status: "accepted" | "needs_human_validation" | "blocked" | "retry";
}

export interface AiGenerationPlanStep {
  id: string;
  label: string;
  agentId: AiAgentId;
  dependsOn: string[];
  status: AiAgentStatus;
  estimatedCostCents: number;
  humanValidationRequired: boolean;
}

export interface AiGenerationPlan {
  id: string;
  brandId: string;
  contentProjectId?: string;
  objective: string;
  steps: AiGenerationPlanStep[];
  estimatedCostCents: number;
  status: "ready" | "blocked" | "needs_human_validation";
  nextAction: string;
}

export interface AiEngineRunResult {
  plan: AiGenerationPlan;
  calledAgents: AiAgentId[];
  decisions: AiOrchestrationDecision[];
  logs: AiAgentRunLog[];
}

export interface BrandBriefOutput {
  brandName: string;
  positioning: string;
  tone: string[];
  visualStyle: string[];
  avoid: string[];
  preferredHooks: string[];
  safetyRules: string[];
}

export interface TrendResearchOutput {
  date: string;
  brandId: string;
  contextSummary: string;
  trends: Array<{
    type: "visual" | "music" | "format" | "seasonal" | "event";
    title: string;
    confidence: ConfidenceLevel;
    sourceRequired: boolean;
  }>;
  realWorldItems: Array<{
    type: string;
    title: string;
    date?: string;
    sourceUrl?: string;
    verified: boolean;
  }>;
  warnings: string[];
}

export interface GeneratedIdeaOutput {
  title: string;
  concept: string;
  hook: string;
  emotion: string;
  targetPlatform: SocialPlatform;
  estimatedDurationSeconds: number;
  visualStyle: string[];
  musicStyle: string;
  productionDifficulty: "low" | "medium" | "high";
  estimatedCostLevel: "low" | "medium" | "high";
  riskLevel: RiskLevel;
  potentialScore: number;
  reason: string;
}

export interface HookCandidate {
  text: string;
  type: "mystery" | "belonging" | "aesthetic" | "question" | "statement";
  language: "en" | "fr";
  wordCount: number;
  hookScore: number;
  reason: string;
}

export interface ScriptSceneOutput {
  start: number;
  end: number;
  onScreenText: string;
  visualIntent: string;
  audioIntent: string;
}

export interface ScriptOutput {
  title: string;
  durationSeconds: number;
  platform: SocialPlatform;
  scenes: ScriptSceneOutput[];
  voiceover: {
    enabled: boolean;
    text: string;
  };
}

export interface StoryboardSceneOutput {
  sceneNumber: number;
  start: number;
  end: number;
  shotType: string;
  cameraMovement: string;
  visualDescription: string;
  lighting: string;
  onScreenText: string;
  transitionOut: string;
  videoPrompt: string;
  negativePrompt: string;
}

export interface PromptEngineeringOutput {
  provider: "veo" | "runway" | "kling" | "mock";
  positivePrompt: string;
  negativePrompt: string;
  ratio: "9:16" | "1:1" | "16:9";
  durationSeconds: number;
  textOverlayHandledInEdit: true;
}

export interface MusicMatchOutput {
  recommendedTrack?: {
    trackId: string;
    title: string;
    bpm: number;
    mood: string[];
    licenseStatus: "validated" | "needs_review" | "blocked";
    reason: string;
  };
  alternatives: Array<{ trackId: string; reason: string }>;
  copyrightWarning: string | null;
  allowedForPublication: boolean;
}

export interface VoiceRecommendationOutput {
  voiceoverRecommended: boolean;
  reason: string;
  voiceStyle: string | null;
  voiceText: string;
}

export interface EditingPlanOutput {
  format: "9:16" | "1:1" | "16:9";
  durationSeconds: number;
  cuts: Array<{ time: number; type: string }>;
  textOverlays: Array<{
    start: number;
    end: number;
    text: string;
    position: string;
    style: string;
  }>;
  audio: {
    musicTrackId: string | null;
    startOffsetSeconds: number;
    fadeIn: number;
    fadeOut: number;
  };
}

export interface RiskCheckOutput {
  riskLevel: RiskLevel;
  blockingIssues: string[];
  warnings: string[];
  allowedForPublication: boolean;
}

export interface FactualClaimCheck {
  claim: string;
  verified: boolean;
  source: string | null;
  action: "keep" | "remove_or_verify" | "rewrite_neutral";
  safeRewrite?: string;
}

export interface FactualVerificationOutput {
  riskLevel: RiskLevel;
  claims: FactualClaimCheck[];
  allowedForPublication: boolean;
}

export interface PlatformAdaptationOutput {
  adaptations: Array<{
    platform: SocialPlatform;
    caption: string;
    hashtags: string[];
    recommendedPublishTime: string;
    adaptationNotes: string;
  }>;
}

export interface PublishingRecommendationOutput {
  recommendedSchedule: Array<{
    platform: SocialPlatform;
    publishAt: string;
    confidence: ConfidenceLevel;
    reason: string;
  }>;
}

export interface AnalyticsSummaryOutput {
  publicationId: string;
  overallResult: "below_average" | "average" | "above_average";
  viewsVsAverage: string;
  savesVsAverage: string;
  sharesVsAverage: string;
  diagnosis: string;
}

export interface LearningOutput {
  insight: string;
  confidence: ConfidenceLevel;
  basedOnPublications: number;
  supportingMetrics: Record<string, string>;
  recommendation: string;
  status: "correlation" | "hypothesis" | "conclusion";
}

export interface CostCheckOutput {
  allowed: boolean;
  estimatedCostCents: number;
  monthlyBudgetRemainingCents: number;
  warning: string | null;
}

export interface BrandMemory {
  brandId: string;
  winningPatterns: string[];
  losingPatterns: string[];
  activeRules: string[];
  refusedContentReasons: string[];
  validatedLearnings: string[];
}

export interface AiRegressionCase {
  id: string;
  title: string;
  contentSummary: string;
  expectedSignals: string[];
  forbiddenSignals: string[];
}

export interface AiEngineContext {
  brand: Brand;
  selectedIdea?: ContentIdea;
  contentProject?: ContentProject;
  qualityInput?: QualityScoreInput;
  score?: QualityScoreResult;
  musicLibrary: MusicTrack[];
  monthlyBudgetCents: number;
  usedBudgetCents: number;
  maxVideoGenerationCostCents: number;
  ideaApproved: boolean;
  scriptApproved: boolean;
  providerAvailable: boolean;
  userId: string;
  traceId: string;
}

export const aiAgentDefinitions: AiAgentDefinition[] = [
  {
    id: "brand_strategist",
    name: "Brand Strategist Agent",
    phase: 1,
    role: "Turns brand settings into an operational creative brief.",
    inputs: ["brand", "tone", "visual identity", "rules"],
    outputs: ["brand brief", "preferred hooks", "safety rules"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "trend_research",
    name: "Trend Research Agent",
    phase: 3,
    role: "Collects sourced daily context without inventing facts.",
    inputs: ["brand", "date", "sources", "calendar"],
    outputs: ["context summary", "trends", "warnings", "verified real-world items"],
    structuredOutputRequired: true,
    canBlockPublication: true
  },
  {
    id: "idea_generation",
    name: "Idea Generation Agent",
    phase: 1,
    role: "Creates differentiated short-form content ideas.",
    inputs: ["brand brief", "trends", "performance", "budget", "platform"],
    outputs: ["ideas", "potential score", "risk level", "reason"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "hook",
    name: "Hook Agent",
    phase: 1,
    role: "Creates and scores the first two seconds of the content.",
    inputs: ["idea", "brand brief", "platform"],
    outputs: ["hook variants", "recommended hook"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "script",
    name: "Script Agent",
    phase: 1,
    role: "Transforms the idea into a second-by-second mobile script.",
    inputs: ["idea", "hook", "brand brief", "duration"],
    outputs: ["script scenes", "voiceover decision"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "storyboard",
    name: "Storyboard Agent",
    phase: 1,
    role: "Turns the script into production-ready scenes.",
    inputs: ["script", "visual style", "platform"],
    outputs: ["scene plan", "camera movement", "video prompt", "negative prompt"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "prompt_engineering",
    name: "Prompt Engineering Agent",
    phase: 2,
    role: "Optimizes prompts for video and image providers.",
    inputs: ["storyboard", "provider", "duration", "ratio"],
    outputs: ["positive prompt", "negative prompt", "provider notes"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "music_matching",
    name: "Music Matching Agent",
    phase: 2,
    role: "Selects tracks only from the approved music library.",
    inputs: ["script", "duration", "mood", "BPM", "rights"],
    outputs: ["recommended track", "alternatives", "copyright warning"],
    structuredOutputRequired: true,
    canBlockPublication: true
  },
  {
    id: "voice",
    name: "Voice Agent",
    phase: 2,
    role: "Decides whether a voiceover helps or hurts the content.",
    inputs: ["script", "brand tone", "platform"],
    outputs: ["voiceover recommendation", "voice style", "voice text"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "editing_recommendation",
    name: "Editing Recommendation Agent",
    phase: 2,
    role: "Creates an FFmpeg-ready editing plan.",
    inputs: ["storyboard", "music", "assets", "format"],
    outputs: ["cuts", "text overlays", "audio plan"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "quality_scoring",
    name: "Quality Scoring Agent",
    phase: 1,
    role: "Scores content frankly before publication.",
    inputs: ["project", "script", "storyboard", "assets", "risks"],
    outputs: ["global score", "detailed scores", "diagnosis", "recommended fix"],
    structuredOutputRequired: true,
    canBlockPublication: true
  },
  {
    id: "copyright_risk",
    name: "Copyright Risk Agent",
    phase: 2,
    role: "Detects music, visual, logo, people, and license risks.",
    inputs: ["assets", "music", "licenses", "uploads"],
    outputs: ["risk level", "blocking issues", "warnings", "publication allowance"],
    structuredOutputRequired: true,
    canBlockPublication: true
  },
  {
    id: "factual_verification",
    name: "Factual Verification Agent",
    phase: 3,
    role: "Prevents false events, dates, places, prices, and claims.",
    inputs: ["script", "caption", "claims", "sources"],
    outputs: ["claim checks", "safe rewrites", "publication allowance"],
    structuredOutputRequired: true,
    canBlockPublication: true
  },
  {
    id: "platform_adaptation",
    name: "Platform Adaptation Agent",
    phase: 3,
    role: "Adapts captions, hashtags, and timing per platform.",
    inputs: ["project", "platforms", "brand brief"],
    outputs: ["platform adaptations"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "publishing_recommendation",
    name: "Publishing Recommendation Agent",
    phase: 3,
    role: "Recommends schedule and warns when confidence is limited.",
    inputs: ["performance", "calendar", "score", "platform"],
    outputs: ["recommended schedule", "confidence", "reason"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    phase: 4,
    role: "Reads post performance after publication.",
    inputs: ["metrics", "content metadata", "platform"],
    outputs: ["performance summary", "diagnosis"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "learning",
    name: "Learning Agent",
    phase: 4,
    role: "Turns performance into careful learnings.",
    inputs: ["analytics summaries", "brand memory", "sample size"],
    outputs: ["insight", "confidence", "recommendation", "status"],
    structuredOutputRequired: true,
    canBlockPublication: false
  },
  {
    id: "cost_control",
    name: "Cost Control Agent",
    phase: 1,
    role: "Blocks uncontrolled AI costs before expensive operations.",
    inputs: ["budget", "estimated cost", "provider", "variations", "score"],
    outputs: ["allowed", "estimated cost", "budget remaining", "warning"],
    structuredOutputRequired: true,
    canBlockPublication: true
  }
];

export const aiStructuredOutputSchemas = {
  brandBrief: {
    type: "object",
    properties: {
      brandName: { type: "string" },
      positioning: { type: "string" },
      tone: { type: "array", items: { type: "string" } },
      visualStyle: { type: "array", items: { type: "string" } },
      avoid: { type: "array", items: { type: "string" } },
      preferredHooks: { type: "array", items: { type: "string" } },
      safetyRules: { type: "array", items: { type: "string" } }
    },
    required: ["brandName", "positioning", "tone", "visualStyle", "avoid", "preferredHooks", "safetyRules"],
    additionalProperties: false
  },
  trends: {
    type: "object",
    properties: {
      date: { type: "string" },
      brandId: { type: "string" },
      contextSummary: { type: "string" },
      trends: { type: "array", items: { type: "object" } },
      realWorldItems: { type: "array", items: { type: "object" } },
      warnings: { type: "array", items: { type: "string" } }
    },
    required: ["date", "brandId", "contextSummary", "trends", "realWorldItems", "warnings"],
    additionalProperties: false
  },
  ideas: {
    type: "object",
    properties: {
      ideas: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            concept: { type: "string" },
            hook: { type: "string" },
            emotion: { type: "string" },
            targetPlatform: { type: "string" },
            estimatedDurationSeconds: { type: "number" },
            visualStyle: { type: "array", items: { type: "string" } },
            musicStyle: { type: "string" },
            productionDifficulty: { type: "string" },
            estimatedCostLevel: { type: "string" },
            riskLevel: { type: "string" },
            potentialScore: { type: "number" },
            reason: { type: "string" }
          },
          required: [
            "title",
            "concept",
            "hook",
            "emotion",
            "targetPlatform",
            "estimatedDurationSeconds",
            "visualStyle",
            "musicStyle",
            "productionDifficulty",
            "estimatedCostLevel",
            "riskLevel",
            "potentialScore",
            "reason"
          ],
          additionalProperties: false
        }
      }
    },
    required: ["ideas"],
    additionalProperties: false
  },
  hooks: {
    type: "object",
    properties: {
      hooks: { type: "array", items: { type: "object" } },
      recommendedHook: { type: "string" }
    },
    required: ["hooks", "recommendedHook"],
    additionalProperties: false
  },
  script: {
    type: "object",
    properties: {
      title: { type: "string" },
      durationSeconds: { type: "number" },
      platform: { type: "string" },
      scenes: { type: "array", items: { type: "object" } },
      voiceover: { type: "object" }
    },
    required: ["title", "durationSeconds", "platform", "scenes", "voiceover"],
    additionalProperties: false
  },
  storyboard: {
    type: "object",
    properties: {
      storyboard: { type: "array", items: { type: "object" } }
    },
    required: ["storyboard"],
    additionalProperties: false
  },
  promptEngineering: {
    type: "object",
    properties: {
      provider: { type: "string" },
      positivePrompt: { type: "string" },
      negativePrompt: { type: "string" },
      ratio: { type: "string" },
      durationSeconds: { type: "number" },
      textOverlayHandledInEdit: { type: "boolean" }
    },
    required: ["provider", "positivePrompt", "negativePrompt", "ratio", "durationSeconds", "textOverlayHandledInEdit"],
    additionalProperties: false
  },
  musicMatch: {
    type: "object",
    properties: {
      recommendedTrack: { type: "object" },
      alternatives: { type: "array", items: { type: "object" } },
      copyrightWarning: { type: "string" },
      allowedForPublication: { type: "boolean" }
    },
    required: ["alternatives", "allowedForPublication"],
    additionalProperties: false
  },
  voiceRecommendation: {
    type: "object",
    properties: {
      voiceoverRecommended: { type: "boolean" },
      reason: { type: "string" },
      voiceStyle: { type: "string" },
      voiceText: { type: "string" }
    },
    required: ["voiceoverRecommended", "reason", "voiceStyle", "voiceText"],
    additionalProperties: false
  },
  editingPlan: {
    type: "object",
    properties: {
      format: { type: "string" },
      durationSeconds: { type: "number" },
      cuts: { type: "array", items: { type: "object" } },
      textOverlays: { type: "array", items: { type: "object" } },
      audio: { type: "object" }
    },
    required: ["format", "durationSeconds", "cuts", "textOverlays", "audio"],
    additionalProperties: false
  },
  qualityScore: {
    type: "object",
    properties: {
      globalScore: { type: "number" },
      publishRecommendation: { type: "string" },
      scores: { type: "object" },
      diagnosis: { type: "object" }
    },
    required: ["globalScore", "publishRecommendation", "scores", "diagnosis"],
    additionalProperties: false
  },
  riskCheck: {
    type: "object",
    properties: {
      riskLevel: { type: "string" },
      blockingIssues: { type: "array", items: { type: "string" } },
      warnings: { type: "array", items: { type: "string" } },
      allowedForPublication: { type: "boolean" }
    },
    required: ["riskLevel", "blockingIssues", "warnings", "allowedForPublication"],
    additionalProperties: false
  },
  factualVerification: {
    type: "object",
    properties: {
      riskLevel: { type: "string" },
      claims: { type: "array", items: { type: "object" } },
      allowedForPublication: { type: "boolean" }
    },
    required: ["riskLevel", "claims", "allowedForPublication"],
    additionalProperties: false
  },
  platformAdaptation: {
    type: "object",
    properties: {
      adaptations: { type: "array", items: { type: "object" } }
    },
    required: ["adaptations"],
    additionalProperties: false
  },
  publishingRecommendation: {
    type: "object",
    properties: {
      recommendedSchedule: { type: "array", items: { type: "object" } }
    },
    required: ["recommendedSchedule"],
    additionalProperties: false
  },
  analyticsSummary: {
    type: "object",
    properties: {
      publicationId: { type: "string" },
      overallResult: { type: "string" },
      viewsVsAverage: { type: "string" },
      savesVsAverage: { type: "string" },
      sharesVsAverage: { type: "string" },
      diagnosis: { type: "string" }
    },
    required: ["publicationId", "overallResult", "viewsVsAverage", "savesVsAverage", "sharesVsAverage", "diagnosis"],
    additionalProperties: false
  },
  learning: {
    type: "object",
    properties: {
      insight: { type: "string" },
      confidence: { type: "string" },
      basedOnPublications: { type: "number" },
      supportingMetrics: { type: "object" },
      recommendation: { type: "string" },
      status: { type: "string" }
    },
    required: ["insight", "confidence", "basedOnPublications", "supportingMetrics", "recommendation", "status"],
    additionalProperties: false
  },
  costCheck: {
    type: "object",
    properties: {
      allowed: { type: "boolean" },
      estimatedCostCents: { type: "number" },
      monthlyBudgetRemainingCents: { type: "number" },
      warning: { type: "string" }
    },
    required: ["allowed", "estimatedCostCents", "monthlyBudgetRemainingCents"],
    additionalProperties: false
  }
} as const satisfies Record<string, JsonSchema>;

export const baseAiSystemPrompt =
  "You are a specialized agent inside Creator AI Studio. Produce operational decisions for a SaaS product. Do not invent factual information. Respect the supplied brand identity. Respond only as JSON matching the provided schema. Flag risks, uncertainty, and limits clearly. Prioritize content quality, brand coherence, legal safety, and human control.";

export const aiPromptDefinitions: AiPromptDefinition[] = [
  {
    agentId: "brand_strategist",
    systemPrompt:
      `${baseAiSystemPrompt}\nAnalyze the supplied brand and turn it into an operational creative brief for downstream AI agents. Define positioning, tone, visual style, allowed angles, forbidden angles, preferred wording, and wording to avoid.`,
    outputSchemaKey: "brandBrief",
    safetyNotes: ["Do not create generic brand claims.", "Include explicit factual and copyright safety rules."]
  },
  {
    agentId: "idea_generation",
    systemPrompt:
      `${baseAiSystemPrompt}\nGenerate differentiated short-form content ideas for the supplied brand. Each idea must include hook, emotion, visual style, music style, potential score, risk, and justification.`,
    outputSchemaKey: "ideas",
    safetyNotes: ["Produce distinct concepts.", "Avoid fake events and viral guarantees.", "Include risk level."]
  },
  {
    agentId: "hook",
    systemPrompt:
      `${baseAiSystemPrompt}\nCreate very short hooks for the first two seconds of a vertical social video. Hooks must be readable on mobile, memorable, brand-fit, and under eight words when possible.`,
    outputSchemaKey: "hooks",
    safetyNotes: ["Avoid long phrases.", "Avoid cliches and false promises."]
  },
  {
    agentId: "script",
    systemPrompt:
      `${baseAiSystemPrompt}\nTransform the selected idea into a second-by-second short video script. The hook must appear before two seconds. Every scene needs a clear function and concise on-screen text.`,
    outputSchemaKey: "script",
    safetyNotes: ["No slow intro.", "No over-explaining.", "Keep mobile readability."]
  },
  {
    agentId: "storyboard",
    systemPrompt:
      `${baseAiSystemPrompt}\nTurn the script into production-ready scenes with shot type, camera movement, visual description, lighting, transition, video prompt, and negative prompt.`,
    outputSchemaKey: "storyboard",
    safetyNotes: ["Do not rely on generated typography for important text.", "Include negative prompts."]
  },
  {
    agentId: "quality_scoring",
    systemPrompt:
      `${baseAiSystemPrompt}\nEvaluate this content like a demanding creative director. Be frank. Score each dimension and explain strengths, weaknesses, and the priority fix. If it should not be published, say it clearly.`,
    outputSchemaKey: "qualityScore",
    safetyNotes: ["Do not flatter weak content.", "Publication below 60 is blocked by default."]
  },
  {
    agentId: "cost_control",
    systemPrompt:
      `${baseAiSystemPrompt}\nCheck whether the requested AI operation is allowed under budget and cost rules before expensive generation starts.`,
    outputSchemaKey: "costCheck",
    safetyNotes: ["Block expensive fallback without validation.", "Block low-score video generation."]
  },
  {
    agentId: "copyright_risk",
    systemPrompt:
      `${baseAiSystemPrompt}\nDetect copyright and license risks across music, images, logos, people, uploads, and generated assets.`,
    outputSchemaKey: "riskCheck",
    safetyNotes: ["Unapproved music blocks publication.", "Draft export can remain allowed."]
  },
  {
    agentId: "factual_verification",
    systemPrompt:
      `${baseAiSystemPrompt}\nVerify factual claims. Events, dates, venues, DJs, weather, rankings, prices, and statistics require sources. If not verified, propose a neutral rewrite.`,
    outputSchemaKey: "factualVerification",
    safetyNotes: ["Never invent events.", "Use safe rewrites for unverified claims."]
  }
];

export const aiWorkflowStages: AiGenerationPlanStep[] = [
  {
    id: "prepare",
    label: "Prepare brand, rules, history, trends, and budget",
    agentId: "brand_strategist",
    dependsOn: [],
    status: "complete",
    estimatedCostCents: 8,
    humanValidationRequired: false
  },
  {
    id: "ideas",
    label: "Generate and pre-score 5 to 10 ideas",
    agentId: "idea_generation",
    dependsOn: ["prepare"],
    status: "complete",
    estimatedCostCents: 22,
    humanValidationRequired: false
  },
  {
    id: "hook",
    label: "Create hook variants and choose the strongest one",
    agentId: "hook",
    dependsOn: ["ideas"],
    status: "complete",
    estimatedCostCents: 8,
    humanValidationRequired: false
  },
  {
    id: "script",
    label: "Write second-by-second script",
    agentId: "script",
    dependsOn: ["hook"],
    status: "complete",
    estimatedCostCents: 12,
    humanValidationRequired: true
  },
  {
    id: "storyboard",
    label: "Create production-ready storyboard",
    agentId: "storyboard",
    dependsOn: ["script"],
    status: "complete",
    estimatedCostCents: 16,
    humanValidationRequired: true
  },
  {
    id: "cost_gate",
    label: "Validate budget before expensive assets",
    agentId: "cost_control",
    dependsOn: ["storyboard"],
    status: "blocked",
    estimatedCostCents: 2,
    humanValidationRequired: true
  },
  {
    id: "quality_gate",
    label: "Score quality and recommend next action",
    agentId: "quality_scoring",
    dependsOn: ["storyboard"],
    status: "needs_human_validation",
    estimatedCostCents: 10,
    humanValidationRequired: true
  }
];

export const parisHouseBrandMemory: BrandMemory = {
  brandId: "brand_paris_house",
  winningPatterns: [
    "English hooks under seven words",
    "Rooftop sunset or blue-hour atmosphere",
    "18 to 24 second videos",
    "Minimal white text with gold accents",
    "Deep, afro, or melodic house around 120-124 BPM"
  ],
  losingPatterns: [
    "Voiceover that explains too much",
    "Videos longer than 35 seconds",
    "Captions with too many hashtags",
    "Fake event announcements",
    "Cheap club aesthetic with excessive neon"
  ],
  activeRules: [
    "Keep on-screen text minimal.",
    "Avoid unverified venue, DJ, date, and event claims.",
    "Use only approved music for final publication.",
    "Do not promise virality.",
    "No autopublish in MVP."
  ],
  refusedContentReasons: [
    "Music rights missing.",
    "Hook too generic.",
    "Unverified event claim.",
    "Visual prompt likely to produce distorted faces."
  ],
  validatedLearnings: [
    "Rooftop mood is a stronger hypothesis than generic street nightlife.",
    "Short English hooks currently fit the brand better than explanatory French copy."
  ]
};

export const genericContentBannedPhrases = [
  "Discover Paris like never before",
  "The best vibe in Paris",
  "An incredible night",
  "Vibes only",
  "Prepare to be amazed",
  "A unique experience",
  "This will explode",
  "The perfect viral content"
];

export const parisHousePreferredPhrases = [
  "Paris sounds different after midnight.",
  "A bassline above the city.",
  "Tonight has a rhythm.",
  "Somewhere between the Seine and the kick.",
  "Golden lights. Deep bass. Paris."
];

export const aiRegressionCases: AiRegressionCase[] = [
  {
    id: "good_paris_house",
    title: "Good Paris House concept",
    contentSummary: "Short rooftop video, English hook, verified no real event claims, approved music.",
    expectedSignals: ["high brand fit", "low factual risk", "short hook"],
    forbiddenSignals: ["fake event", "music rights warning"]
  },
  {
    id: "copyright_risk",
    title: "Commercial track without rights",
    contentSummary: "Video uses a famous commercial track with no license document.",
    expectedSignals: ["publication blocked", "copyright risk"],
    forbiddenSignals: ["allowed for publication"]
  },
  {
    id: "factual_hallucination",
    title: "Unverified DJ event claim",
    contentSummary: "Caption says a real DJ plays tonight at a named club without a source.",
    expectedSignals: ["factual risk", "rewrite neutral", "source required"],
    forbiddenSignals: ["verified true"]
  },
  {
    id: "generic_content",
    title: "Generic viral promise",
    contentSummary: "Hook says discover Paris like never before and promises viral content.",
    expectedSignals: ["generic", "weak hook", "rewrite needed"],
    forbiddenSignals: ["publish recommended"]
  }
];

export function getAiAgentDefinition(agentId: AiAgentId): AiAgentDefinition {
  const agent = aiAgentDefinitions.find((definition) => definition.id === agentId);

  if (!agent) {
    throw new Error(`Unknown AI agent: ${agentId}`);
  }

  return agent;
}

export function getAgentsByPhase(maxPhase: AiMvpPhase): AiAgentDefinition[] {
  return aiAgentDefinitions.filter((agent) => agent.phase <= maxPhase);
}

export function getPromptForAgent(agentId: AiAgentId): AiPromptDefinition | undefined {
  return aiPromptDefinitions.find((prompt) => prompt.agentId === agentId);
}

export function createCostCheck(context: AiEngineContext, estimatedCostCents: number): CostCheckOutput {
  const remaining = context.monthlyBudgetCents - context.usedBudgetCents;
  const scoreTooLow = context.score ? context.score.global < 60 : false;
  const costTooHigh = estimatedCostCents > context.maxVideoGenerationCostCents;
  const allowed = remaining >= estimatedCostCents && !costTooHigh && !scoreTooLow;

  return {
    allowed,
    estimatedCostCents,
    monthlyBudgetRemainingCents: Math.max(0, remaining - estimatedCostCents),
    warning: allowed
      ? null
      : scoreTooLow
        ? "Content score is too low for expensive video generation."
        : costTooHigh
          ? "Estimated generation cost is above the per-content limit."
          : "Monthly budget is not sufficient for this operation."
  };
}

export function createMusicMatch(tracks: MusicTrack[]): MusicMatchOutput {
  const approvedTrack = tracks.find((track) => track.approvedForUse);
  const alternatives = tracks
    .filter((track) => track.id !== approvedTrack?.id)
    .slice(0, 2)
    .map((track) => ({
      trackId: track.id,
      reason: track.approvedForUse
        ? "Approved alternative with compatible energy."
        : "Draft alternative, requires rights validation before final export."
    }));

  if (!approvedTrack) {
    return {
      alternatives,
      copyrightWarning: "No approved music is available. Publication must stay blocked.",
      allowedForPublication: false
    };
  }

  return {
    recommendedTrack: {
      trackId: approvedTrack.id,
      title: approvedTrack.title,
      bpm: approvedTrack.bpm,
      mood: [approvedTrack.mood],
      licenseStatus: "validated",
      reason: "BPM and mood fit a short premium Paris House edit."
    },
    alternatives,
    copyrightWarning: null,
    allowedForPublication: true
  };
}

export function detectGenericPhrases(text: string): string[] {
  const normalized = text.toLowerCase();

  return genericContentBannedPhrases.filter((phrase) => normalized.includes(phrase.toLowerCase()));
}
