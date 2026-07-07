import {
  normalizeProviderError,
  type AppError,
  type ProviderName,
  type WebhookEvent
} from "@creator-ai-studio/shared";

export interface IncomingWebhook {
  provider: ProviderName | string;
  eventType: string;
  externalEventId: string;
  payload: Record<string, unknown>;
  signature?: string;
}

const processedWebhookIds = new Set<string>();

export function verifyWebhookSignature(signature: string | undefined, expectedSecretConfigured: boolean): boolean {
  if (!expectedSecretConfigured) {
    return false;
  }

  return Boolean(signature && signature.length >= 12);
}

export function normalizeWebhookEvent(input: IncomingWebhook, signatureValid: boolean): WebhookEvent {
  return {
    id: `webhook_${input.provider}_${input.externalEventId}`,
    provider: input.provider,
    eventType: input.eventType,
    externalEventId: input.externalEventId,
    payload: input.payload,
    signatureValid,
    processed: false,
    createdAt: new Date().toISOString()
  };
}

export function processWebhookEvent(event: WebhookEvent): WebhookEvent | AppError {
  if (!event.signatureValid) {
    return normalizeProviderError({
      provider: event.provider,
      code: "WEBHOOK_SIGNATURE_INVALID",
      category: "auth",
      message: "Webhook signature validation failed",
      userMessage: "Un webhook provider a été rejeté car sa signature est invalide.",
      retryable: false
    });
  }

  if (processedWebhookIds.has(event.externalEventId)) {
    return {
      ...event,
      processed: true,
      processedAt: event.processedAt ?? new Date().toISOString()
    };
  }

  processedWebhookIds.add(event.externalEventId);

  return {
    ...event,
    processed: true,
    processedAt: new Date().toISOString()
  };
}
