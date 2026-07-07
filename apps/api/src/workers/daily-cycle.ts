import { dailyWorkflow, parisHouseBrand, type Brand, type WorkflowStage } from "@creator-ai-studio/shared";

export interface DailyCyclePlan {
  brandId: string;
  brandName: string;
  timezone: string;
  stages: WorkflowStage[];
  autopublishEnabled: false;
}

export function createDailyCyclePlan(
  brand: Brand = parisHouseBrand,
  timezone = "Europe/Paris"
): DailyCyclePlan {
  return {
    brandId: brand.id,
    brandName: brand.name,
    timezone,
    stages: dailyWorkflow,
    autopublishEnabled: false
  };
}
