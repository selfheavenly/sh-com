import type { Step, StepKey } from "../../api";
import { ProgressBar } from "./InvitationLetter";
import { OptionCard } from "./OptionCard";

// Maps each step key to the label shown on the ← back nav
const BACK_LABELS: Record<StepKey, string> = {
  film: "Letter",
  table: "Film",
  glass: "Table",
  activity: "Glass",
};

// Maps each step key to the label shown on the → forward nav
const NEXT_LABELS: Record<StepKey, string> = {
  film: "Table",
  table: "Glass",
  glass: "Activity",
  activity: "Summary",
};

interface StepperStopProps {
  step: Step;
  selectedId: string | null;
  onSelect: (optionId: string) => void;
  onBack: () => void;
  onNext: () => void;
  progress: number; // 0..1
  isLastStep: boolean;
}

export function StepperStop({
  step,
  selectedId,
  onSelect,
  onBack,
  onNext,
  progress,
  isLastStep,
}: StepperStopProps) {
  const canAdvance = selectedId !== null;

  return (
    <div className="may-screen">
      <div className="may-stage may-stage-unlocked">
        <ProgressBar value={progress} />

        <div className="may-step-heading">
          <h2>{step.title}</h2>
          <p>{step.subtitle}</p>
        </div>

        <div className="may-options-grid">
          {step.options.map((opt) => (
            <OptionCard
              key={opt.id}
              option={opt}
              selected={opt.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>

        <div className="may-step-nav">
          <button onClick={onBack} className="may-action-link">
            ←&nbsp;{BACK_LABELS[step.key]}
          </button>
          <button
            onClick={onNext}
            disabled={!canAdvance}
            className="may-action-link"
          >
            {isLastStep ? "Summary" : NEXT_LABELS[step.key]}&nbsp;→
          </button>
        </div>
      </div>
    </div>
  );
}
