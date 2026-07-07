import type {
  ProviderRequestContext,
  VideoGenerationJob,
  VideoProvider
} from "@creator-ai-studio/shared";

export class MockVideoProvider implements VideoProvider {
  readonly name = "mock-video";

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
  ): Promise<VideoGenerationJob> {
    return {
      id: jobId,
      provider: this.name,
      status: "complete",
      resultUrl: "mock://generated/paris-house-blue-hour.mp4",
      costEstimateCents: 0
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
      id: `video_job_${traceId}`,
      provider: this.name,
      status: "queued",
      costEstimateCents: 0
    };
  }
}
