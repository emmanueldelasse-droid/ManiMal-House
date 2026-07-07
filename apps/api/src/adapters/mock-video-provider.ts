import type {
  ProviderRequestContext,
  VideoGenerationJob,
  VideoGenerationStatus,
  VideoProvider
} from "@creator-ai-studio/shared";

export class MockVideoProvider implements VideoProvider {
  readonly name = "mock";

  async generateTextToVideo(
    context: ProviderRequestContext,
    _prompt: string
  ): Promise<VideoGenerationJob> {
    return this.createJob(context.traceId);
  }

  async generateImageToVideo(
    context: ProviderRequestContext,
    _imageUrl: string,
    _prompt: string
  ): Promise<VideoGenerationJob> {
    return this.createJob(context.traceId);
  }

  async getGenerationStatus(
    _context: ProviderRequestContext,
    jobId: string
  ): Promise<VideoGenerationStatus> {
    return {
      externalJobId: jobId,
      provider: this.name,
      status: "succeeded",
      progress: 100,
      resultUrl: "mock://generated/paris-house-blue-hour.mp4",
      estimatedCostCents: 0,
      createdAt: new Date().toISOString()
    };
  }

  async cancelGeneration(_context: ProviderRequestContext, _jobId: string): Promise<void> {
    return undefined;
  }

  async downloadResult(_context: ProviderRequestContext, _jobId: string): Promise<Blob> {
    return new Blob(["mock-video"], { type: "video/mp4" });
  }

  private createJob(traceId: string): VideoGenerationJob {
    return {
      externalJobId: `video_job_${traceId}`,
      provider: this.name,
      status: "queued",
      estimatedCostCents: 0,
      createdAt: new Date().toISOString()
    };
  }
}
