import {
  defaultRetryPolicy,
  queueDefinitions,
  shouldRetryProviderError,
  type AppError,
  type IntegrationJob,
  type JobStatus,
  type ProviderName,
  type QueueName
} from "@creator-ai-studio/shared";

export interface CreateJobInput {
  workspaceId: string;
  brandId?: string;
  contentProjectId?: string;
  type: QueueName;
  provider?: ProviderName | string;
  input: Record<string, unknown>;
  maxAttempts?: number;
}

export function createIntegrationJob(input: CreateJobInput): IntegrationJob {
  const now = new Date().toISOString();

  return {
    id: `job_${cryptoSafeId()}`,
    workspaceId: input.workspaceId,
    ...(input.brandId ? { brandId: input.brandId } : {}),
    ...(input.contentProjectId ? { contentProjectId: input.contentProjectId } : {}),
    type: input.type,
    ...(input.provider ? { provider: input.provider } : {}),
    status: "queued",
    progress: 0,
    input: input.input,
    attempts: 0,
    maxAttempts: input.maxAttempts ?? defaultRetryPolicy.maxAttempts,
    createdAt: now
  };
}

export function transitionJob(job: IntegrationJob, status: JobStatus, patch?: Partial<IntegrationJob>): IntegrationJob {
  const timestamp = new Date().toISOString();

  return {
    ...job,
    ...patch,
    status,
    ...(status === "running" ? { startedAt: job.startedAt ?? timestamp } : {}),
    ...(status === "succeeded" || status === "failed" || status === "cancelled" ? { finishedAt: timestamp } : {})
  };
}

export function shouldRetryJob(job: IntegrationJob, error: AppError): boolean {
  return job.attempts < job.maxAttempts && shouldRetryProviderError(error);
}

export function queueExists(queue: QueueName): boolean {
  return queueDefinitions.some((definition) => definition.name === queue);
}

function cryptoSafeId(): string {
  return Math.random().toString(36).slice(2, 10);
}
