import { envRequirements, type EnvVariableRequirement } from "@creator-ai-studio/shared";

export type RuntimeEnvironment = "local" | "staging" | "production";

export interface EnvValidationResult {
  environment: RuntimeEnvironment;
  missing: EnvVariableRequirement[];
  configured: EnvVariableRequirement[];
}

export function validateEnvironment(
  environment: RuntimeEnvironment,
  values: Record<string, string | undefined>
): EnvValidationResult {
  const requiredForEnvironment = envRequirements.filter((requirement) =>
    requirement.requiredIn.includes(environment)
  );

  const missing = requiredForEnvironment.filter((requirement) => !values[requirement.name]);
  const configured = requiredForEnvironment.filter((requirement) => Boolean(values[requirement.name]));

  return {
    environment,
    missing,
    configured
  };
}
