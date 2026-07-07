import {
  defaultVideoFallbackPolicy,
  providerRegistry,
  selectVideoFallbackProvider,
  type ProviderHealthStatus,
  type ProviderName,
  type ProviderRegistryEntry,
  type TextToVideoInput,
  type VideoProviderName
} from "@creator-ai-studio/shared";

export class ProviderRegistry {
  constructor(private readonly entries: ProviderRegistryEntry[] = providerRegistry) {}

  list(): ProviderRegistryEntry[] {
    return this.entries;
  }

  get(provider: ProviderName): ProviderRegistryEntry | undefined {
    return this.entries.find((entry) => entry.provider === provider);
  }

  getStatus(provider: ProviderName): ProviderHealthStatus {
    return this.get(provider)?.status ?? "unavailable";
  }

  isAvailable(provider: ProviderName): boolean {
    const status = this.getStatus(provider);
    return status === "available" || status === "mock_only";
  }

  availableProviders(kind?: ProviderRegistryEntry["kind"]): ProviderName[] {
    return this.entries
      .filter((entry) => (kind ? entry.kind === kind : true))
      .filter((entry) => this.isAvailable(entry.provider))
      .map((entry) => entry.provider);
  }
}

export class AutoVideoProviderSelector {
  constructor(private readonly registry = new ProviderRegistry()) {}

  selectProvider(input: TextToVideoInput): VideoProviderName {
    const available = this.registry.availableProviders("video");
    const selected = selectVideoFallbackProvider({
      availableProviders: available,
      preferredQuality: input.quality,
      policy: defaultVideoFallbackPolicy
    });

    return normalizeVideoProviderName(selected);
  }

  requiresHumanFallbackApproval(current: ProviderName, fallback: ProviderName, estimatedCostDeltaCents: number): boolean {
    if (!defaultVideoFallbackPolicy.enabled) {
      return true;
    }

    if (current === fallback) {
      return false;
    }

    return defaultVideoFallbackPolicy.requireApprovalWhenCostIncreases && estimatedCostDeltaCents > 0;
  }
}

function normalizeVideoProviderName(provider: ProviderName): VideoProviderName {
  if (provider === "runway" || provider === "kling" || provider === "veo" || provider === "mock") {
    return provider;
  }

  return "mock";
}
