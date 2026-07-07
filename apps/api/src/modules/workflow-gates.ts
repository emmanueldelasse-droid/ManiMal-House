import {
  buildAnalyticsCollectionPlan,
  evaluatePublicationReadiness,
  ffmpegQualityChecks,
  minimumPublicationScore,
  type PublicationReadinessInput,
  type PublicationReadinessResult
} from "@creator-ai-studio/shared";

export interface ManualExportReadinessInput {
  previewReady: boolean;
  musicApproved: boolean;
  score?: number;
  budgetAvailable: boolean;
  ffmpegChecksPassed: string[];
  copyrightRiskBlocking: boolean;
  factualRiskBlocking: boolean;
}

export interface ManualExportReadinessResult {
  ok: boolean;
  blockers: string[];
  missingFfmpegChecks: string[];
}

export function evaluatePublishingGate(
  input: PublicationReadinessInput
): PublicationReadinessResult {
  return evaluatePublicationReadiness({
    ...input,
    minimumScore: input.minimumScore ?? minimumPublicationScore
  });
}

export function evaluateManualExportGate(
  input: ManualExportReadinessInput
): ManualExportReadinessResult {
  const missingFfmpegChecks = ffmpegQualityChecks
    .filter((check) => check.required && !input.ffmpegChecksPassed.includes(check.id))
    .map((check) => check.id);

  const blockers: string[] = [];

  if (!input.previewReady) {
    blockers.push("preview_not_ready");
  }

  if (!input.musicApproved) {
    blockers.push("music_license_missing");
  }

  if (typeof input.score !== "number" || input.score < minimumPublicationScore) {
    blockers.push("score_below_threshold");
  }

  if (!input.budgetAvailable) {
    blockers.push("budget_exceeded");
  }

  if (input.copyrightRiskBlocking) {
    blockers.push("copyright_risk_blocking");
  }

  if (input.factualRiskBlocking) {
    blockers.push("factual_risk_blocking");
  }

  if (missingFfmpegChecks.length > 0) {
    blockers.push("ffmpeg_quality_checks_missing");
  }

  return {
    ok: blockers.length === 0,
    blockers,
    missingFfmpegChecks
  };
}

export function createAnalyticsSyncPlan(
  publicationId: string,
  platform: "instagram" | "tiktok" | "youtube" | "facebook" | "snapchat" | "pinterest",
  publishedAt: string
) {
  return buildAnalyticsCollectionPlan(publicationId, platform, publishedAt).map((job) => ({
    ...job,
    queue: "analytics-sync-queue",
    jobName: "analytics_sync_job"
  }));
}
