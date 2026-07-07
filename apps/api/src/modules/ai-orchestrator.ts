import {
  aiStructuredOutputSchemas,
  aiWorkflowStages,
  createCostCheck,
  createMusicMatch,
  detectGenericPhrases,
  getPromptForAgent,
  parisHouseBrandMemory,
  type AiAgentId,
  type AiAgentRunLog,
  type AiEngineContext,
  type AiEngineRunResult,
  type AiGenerationPlan,
  type AiGenerationPlanStep,
  type AiOrchestrationDecision
} from "@creator-ai-studio/shared";

const defaultModel = "mock-structured-output-model";

export class CreatorAiOrchestrator {
  prepareMvpPlan(context: AiEngineContext): AiEngineRunResult {
    const costCheck = createCostCheck(context, 125);
    const musicMatch = createMusicMatch(context.musicLibrary);
    const detectedGenericPhrases = context.contentProject
      ? detectGenericPhrases(`${context.contentProject.title} ${context.contentProject.caption}`)
      : [];

    const steps = aiWorkflowStages.map((step) =>
      applyRuntimeGate(step, {
        costAllowed: costCheck.allowed,
        ideaApproved: context.ideaApproved,
        scriptApproved: context.scriptApproved,
        providerAvailable: context.providerAvailable
      })
    );

    const blockedReasons = [
      !context.ideaApproved ? "Idea must be validated before expensive generation." : null,
      !context.scriptApproved ? "Script must be validated before expensive generation." : null,
      !context.providerAvailable ? "No video provider is currently available." : null,
      !costCheck.allowed ? costCheck.warning : null,
      !musicMatch.allowedForPublication ? "No approved music is available for final publication." : null,
      detectedGenericPhrases.length > 0
        ? `Generic phrases detected: ${detectedGenericPhrases.join(", ")}.`
        : null
    ].filter((reason): reason is string => Boolean(reason));

    const plan: AiGenerationPlan = {
      id: `plan_${context.traceId}`,
      brandId: context.brand.id,
      ...(context.contentProject ? { contentProjectId: context.contentProject.id } : {}),
      objective:
        "Create a traceable Paris House short-form content draft with structured agent outputs and human validation.",
      steps,
      estimatedCostCents: steps.reduce((total, step) => total + step.estimatedCostCents, 0),
      status: blockedReasons.length > 0 ? "blocked" : "needs_human_validation",
      nextAction:
        blockedReasons.length > 0
          ? blockedReasons[0]!
          : "Human editor should validate script, storyboard, music rights, and quality score."
    };

    const decisions: AiOrchestrationDecision[] = [
      {
        id: `decision_cost_${context.traceId}`,
        agentId: "cost_control",
        decision: costCheck.allowed ? "Budget gate passed." : "Budget gate blocked expensive generation.",
        reason: costCheck.warning ?? "Cost is below configured limits.",
        status: costCheck.allowed ? "accepted" : "blocked"
      },
      {
        id: `decision_music_${context.traceId}`,
        agentId: "music_matching",
        decision: musicMatch.allowedForPublication
          ? "Approved music can be used for final export."
          : "Publication must stay blocked until music rights are validated.",
        reason:
          musicMatch.recommendedTrack?.reason ??
          musicMatch.copyrightWarning ??
          "Music library requires manual review.",
        status: musicMatch.allowedForPublication ? "accepted" : "blocked"
      },
      {
        id: `decision_memory_${context.traceId}`,
        agentId: "learning",
        decision: "Use Paris House memory as creative constraints.",
        reason: parisHouseBrandMemory.winningPatterns.join("; "),
        status: "accepted"
      }
    ];

    if (detectedGenericPhrases.length > 0) {
      decisions.push({
        id: `decision_generic_${context.traceId}`,
        agentId: "quality_scoring",
        decision: "Rewrite generic copy before publication.",
        reason: detectedGenericPhrases.join(", "),
        status: "retry"
      });
    }

    const calledAgents = uniqueAgentIds(steps.map((step) => step.agentId));
    const logs = calledAgents.map((agentId, index) =>
      createAgentLog({
        agentId,
        context,
        index,
        status: steps.find((step) => step.agentId === agentId)?.status ?? "queued"
      })
    );

    return {
      plan,
      calledAgents,
      decisions,
      logs
    };
  }
}

export function validateStructuredOutput(
  schemaKey: keyof typeof aiStructuredOutputSchemas,
  output: Record<string, unknown>
): { valid: boolean; missingKeys: string[] } {
  const schema = aiStructuredOutputSchemas[schemaKey];
  const required = schema.required ?? [];
  const missingKeys = required.filter((key) => !(key in output));

  return {
    valid: missingKeys.length === 0,
    missingKeys
  };
}

function applyRuntimeGate(
  step: AiGenerationPlanStep,
  gates: {
    costAllowed: boolean;
    ideaApproved: boolean;
    scriptApproved: boolean;
    providerAvailable: boolean;
  }
): AiGenerationPlanStep {
  if (step.id === "cost_gate") {
    return {
      ...step,
      status:
        gates.costAllowed && gates.ideaApproved && gates.scriptApproved && gates.providerAvailable
          ? "complete"
          : "blocked"
    };
  }

  if (step.id === "quality_gate") {
    return {
      ...step,
      status: "needs_human_validation"
    };
  }

  return step;
}

function createAgentLog({
  agentId,
  context,
  index,
  status
}: {
  agentId: AiAgentId;
  context: AiEngineContext;
  index: number;
  status: AiAgentRunLog["status"];
}): AiAgentRunLog {
  const prompt = getPromptForAgent(agentId);

  return {
    id: `ai_log_${context.traceId}_${agentId}`,
    agentId,
    model: defaultModel,
    status,
    inputSummary: `${context.brand.name} / ${context.selectedIdea?.title ?? "no selected idea"}`,
    outputSummary: prompt
      ? `Structured output expected: ${prompt.outputSchemaKey}.`
      : "Agent registered for later MVP phase.",
    schemaKey: prompt?.outputSchemaKey ?? "qualityScore",
    estimatedCostCents: 3 + index * 2,
    durationMs: 220 + index * 45,
    ...(context.contentProject ? { contentProjectId: context.contentProject.id } : {}),
    userId: context.userId,
    createdAt: new Date().toISOString()
  };
}

function uniqueAgentIds(agentIds: AiAgentId[]): AiAgentId[] {
  return [...new Set(agentIds)];
}
