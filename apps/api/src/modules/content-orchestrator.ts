import {
  calculateQualityScore,
  parisHouseBrand,
  sampleProject,
  type ContentIdea,
  type ContentProject,
  type LlmProvider,
  type ProviderRequestContext,
  type QualityScoreResult
} from "@creator-ai-studio/shared";

export interface DailyReview {
  ideas: ContentIdea[];
  selectedIdea: ContentIdea;
  project: ContentProject;
  score: QualityScoreResult;
  nextAction: "human_review" | "improve" | "blocked";
}

export class ContentOrchestrator {
  constructor(private readonly llmProvider: LlmProvider) {}

  async prepareDailyReview(context: ProviderRequestContext): Promise<DailyReview> {
    const ideas = await this.llmProvider.generateIdeas(context, 5);
    const selectedIdea = selectBestIdea(ideas);
    const script = await this.llmProvider.generateScript(context, selectedIdea);
    const project: ContentProject = {
      ...sampleProject,
      brandId: parisHouseBrand.id,
      ideaId: selectedIdea.id,
      title: selectedIdea.title,
      script,
      status: "needs_review"
    };
    const score = calculateQualityScore({
      hook: 92,
      visual: 88,
      rhythm: 84,
      brandFit: 94,
      originality: 78,
      retention: 86,
      share: 76,
      save: 82,
      copyrightRisk: selectedIdea.riskScore,
      factualRisk: 8
    });

    return {
      ideas,
      selectedIdea,
      project: {
        ...project,
        globalScore: score.global
      },
      score,
      nextAction: score.blockers.length > 0 ? "blocked" : "human_review"
    };
  }
}

function selectBestIdea(ideas: ContentIdea[]): ContentIdea {
  const sorted = [...ideas].sort(
    (left, right) => right.potentialScore - right.riskScore - (left.potentialScore - left.riskScore)
  );

  return sorted[0]!;
}
