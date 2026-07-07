import type { ContentIdea, ContentProject, SocialAccount, SocialPlatform } from "./domain";
import type { QualityScoreInput, QualityScoreResult } from "./scoring";

export interface ProviderRequestContext {
  workspaceId: string;
  brandId: string;
  userId: string;
  traceId: string;
}

export interface LlmProvider {
  name: string;
  generateIdeas(context: ProviderRequestContext, count: number): Promise<ContentIdea[]>;
  generateScript(context: ProviderRequestContext, idea: ContentIdea): Promise<string>;
  scoreContent(
    context: ProviderRequestContext,
    project: ContentProject,
    input: QualityScoreInput
  ): Promise<QualityScoreResult>;
  analyzePerformance(context: ProviderRequestContext, projectId: string): Promise<string>;
  summarizeTrends(context: ProviderRequestContext, query: string): Promise<string>;
}

export interface VideoGenerationJob {
  id: string;
  provider: string;
  status: "queued" | "running" | "complete" | "failed" | "cancelled";
  resultUrl?: string;
  costEstimateCents: number;
}

export interface VideoProvider {
  name: string;
  generateTextToVideo(context: ProviderRequestContext, prompt: string): Promise<VideoGenerationJob>;
  generateImageToVideo(
    context: ProviderRequestContext,
    imageUrl: string,
    prompt: string
  ): Promise<VideoGenerationJob>;
  getGenerationStatus(context: ProviderRequestContext, jobId: string): Promise<VideoGenerationJob>;
  cancelGeneration(context: ProviderRequestContext, jobId: string): Promise<void>;
  downloadResult(context: ProviderRequestContext, jobId: string): Promise<Blob>;
}

export interface VoiceProvider {
  name: string;
  generateVoice(context: ProviderRequestContext, text: string, voiceId: string): Promise<string>;
  listVoices(context: ProviderRequestContext): Promise<Array<{ id: string; name: string }>>;
  getVoiceSettings(context: ProviderRequestContext, voiceId: string): Promise<Record<string, unknown>>;
}

export interface PublishingProvider {
  platform: SocialPlatform;
  connectAccount(context: ProviderRequestContext): Promise<SocialAccount>;
  validatePermissions(context: ProviderRequestContext, account: SocialAccount): Promise<boolean>;
  publishVideo(context: ProviderRequestContext, project: ContentProject): Promise<string>;
  scheduleVideo(context: ProviderRequestContext, project: ContentProject, scheduledAt: string): Promise<string>;
  getPostStatus(context: ProviderRequestContext, platformPostId: string): Promise<string>;
  fetchMetrics(context: ProviderRequestContext, platformPostId: string): Promise<Record<string, number>>;
}
