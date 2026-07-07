import {
  calculateQualityScore,
  sampleIdeas,
  type ContentIdea,
  type ContentProject,
  type LlmProvider,
  type ProviderRequestContext,
  type QualityScoreInput,
  type QualityScoreResult
} from "@creator-ai-studio/shared";

export class MockLlmProvider implements LlmProvider {
  readonly name = "mock-llm";

  async generateIdeas(_context: ProviderRequestContext, count: number): Promise<ContentIdea[]> {
    return sampleIdeas.slice(0, count);
  }

  async generateScript(_context: ProviderRequestContext, idea: ContentIdea): Promise<string> {
    return [
      `Hook: ${idea.hook}`,
      `Build the reel around ${idea.angle.toLowerCase()}.`,
      "Keep text minimal, avoid unverifiable claims, and leave space for the music."
    ].join("\n");
  }

  async scoreContent(
    _context: ProviderRequestContext,
    _project: ContentProject,
    input: QualityScoreInput
  ): Promise<QualityScoreResult> {
    return calculateQualityScore(input);
  }

  async analyzePerformance(_context: ProviderRequestContext, projectId: string): Promise<string> {
    return `No live metrics for ${projectId} yet. Keep this content in human review.`;
  }

  async summarizeTrends(_context: ProviderRequestContext, query: string): Promise<string> {
    return `Mock trend summary for "${query}". Real trend claims must be sourced before publication.`;
  }
}
