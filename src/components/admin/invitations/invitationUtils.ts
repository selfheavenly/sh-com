import type { Invitation, StepKey } from "../../../api";

export const RESPONSE_STEP_LABELS: Record<StepKey, string> = {
  film: "Film",
  table: "Table",
  glass: "Glass",
  activity: "Activity",
};

export function formatDate(value: string | null | undefined) {
  if (!value) return "Never";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function countOptions(invitation: Invitation) {
  return invitation.steps.reduce((sum, step) => sum + step.options.length, 0);
}

export function selectedResponseOption(
  invitation: Invitation,
  key: StepKey,
  optionId: string | null,
) {
  const step = invitation.steps.find((item) => item.key === key);
  const option = step?.options.find((item) => item.id === optionId);

  return {
    stepLabel: RESPONSE_STEP_LABELS[key],
    stepTitle: step?.title || RESPONSE_STEP_LABELS[key],
    optionLabel: option?.label ?? optionId ?? "Not selected",
    imageUrl: option?.imageUrl ?? "",
    selected: Boolean(optionId),
    known: Boolean(option),
  };
}
