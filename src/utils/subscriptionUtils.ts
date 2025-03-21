
import { SubscriptionPlan } from "@/context/SubscriptionContext";

interface PlanFeatureLimit {
  maxEmployees: number;
  maxDepartments: number;
  maxDocuments: number;
}

export const getPlanLimits = (plan: SubscriptionPlan): PlanFeatureLimit => {
  switch (plan) {
    case "Starter":
      return {
        maxEmployees: 10,
        maxDepartments: 3,
        maxDocuments: 50
      };
    case "Professional":
      return {
        maxEmployees: 30,
        maxDepartments: 7,
        maxDocuments: 200
      };
    case "Business":
      return {
        maxEmployees: 100,
        maxDepartments: 15,
        maxDocuments: 500
      };
    case "Enterprise":
      return {
        maxEmployees: 500,
        maxDepartments: 50,
        maxDocuments: 2000
      };
    default:
      return {
        maxEmployees: 3,
        maxDepartments: 1,
        maxDocuments: 10
      };
  }
};

export const canAddEmployee = async (currentPlan: SubscriptionPlan, currentEmployeeCount: number): Promise<boolean> => {
  const limits = getPlanLimits(currentPlan);
  return currentEmployeeCount < limits.maxEmployees;
};

export const getRemainingQuota = (currentPlan: SubscriptionPlan, currentEmployeeCount: number): number => {
  const limits = getPlanLimits(currentPlan);
  return Math.max(0, limits.maxEmployees - currentEmployeeCount);
};
