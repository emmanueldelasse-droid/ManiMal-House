export interface QualityScoreInput {
  hook: number;
  visual: number;
  rhythm: number;
  brandFit: number;
  originality: number;
  retention: number;
  share: number;
  save: number;
  copyrightRisk: number;
  factualRisk: number;
}

export type QualityRecommendation =
  | "publish_recommended"
  | "human_review_required"
  | "improvement_recommended"
  | "do_not_publish";

export interface QualityScoreResult extends QualityScoreInput {
  global: number;
  recommendation: QualityRecommendation;
  blockers: string[];
}

const weights: Record<keyof QualityScoreInput, number> = {
  hook: 0.2,
  visual: 0.15,
  rhythm: 0.15,
  brandFit: 0.15,
  originality: 0.1,
  retention: 0.1,
  share: 0.05,
  save: 0.05,
  copyrightRisk: -0.05,
  factualRisk: -0.05
};

export function clampScore(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getQualityRecommendation(global: number): QualityRecommendation {
  if (global >= 85) {
    return "publish_recommended";
  }

  if (global >= 75) {
    return "human_review_required";
  }

  if (global >= 60) {
    return "improvement_recommended";
  }

  return "do_not_publish";
}

export function calculateQualityScore(input: QualityScoreInput): QualityScoreResult {
  const normalized: QualityScoreInput = {
    hook: clampScore(input.hook),
    visual: clampScore(input.visual),
    rhythm: clampScore(input.rhythm),
    brandFit: clampScore(input.brandFit),
    originality: clampScore(input.originality),
    retention: clampScore(input.retention),
    share: clampScore(input.share),
    save: clampScore(input.save),
    copyrightRisk: clampScore(input.copyrightRisk),
    factualRisk: clampScore(input.factualRisk)
  };

  const global = clampScore(
    (Object.keys(normalized) as Array<keyof QualityScoreInput>).reduce(
      (total, key) => total + normalized[key] * weights[key],
      0
    )
  );

  const blockers: string[] = [];

  if (normalized.copyrightRisk > 35) {
    blockers.push("Copyright risk needs manual clearance before export.");
  }

  if (normalized.factualRisk > 35) {
    blockers.push("Factual claims need sources before publication.");
  }

  if (global < 60) {
    blockers.push("Global score is below the minimum publication threshold.");
  }

  return {
    ...normalized,
    global,
    recommendation: getQualityRecommendation(global),
    blockers
  };
}

export function formatRecommendation(recommendation: QualityRecommendation): string {
  const labels: Record<QualityRecommendation, string> = {
    publish_recommended: "Publication recommended",
    human_review_required: "Human review required",
    improvement_recommended: "Improve before approval",
    do_not_publish: "Do not publish"
  };

  return labels[recommendation];
}
