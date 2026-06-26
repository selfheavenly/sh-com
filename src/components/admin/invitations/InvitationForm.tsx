import { useState } from "react";
import type { Invitation, InvitationInput, OptionItem, Step, StepKey } from "../../../api";
import { Button } from "../common/Button";
import { Field } from "../common/Field";
import { FormSection } from "../common/FormSection";
import {
  DEFAULT_LETTER_BODY,
  DEFAULT_PICKUP_TIME,
  defaultSteps,
  duplicateSteps,
} from "./invitationDefaults";

interface InvitationFormProps {
  initial: Invitation | null;
  onSave: (payload: InvitationInput) => Promise<void>;
  onCancel: () => void;
}

export function InvitationForm({ initial, onSave, onCancel }: InvitationFormProps) {
  const [letterBody, setLetterBody] = useState(
    initial?.letterBody ?? DEFAULT_LETTER_BODY,
  );
  const [pickupTime, setPickupTime] = useState(
    initial?.pickupTime ?? DEFAULT_PICKUP_TIME,
  );
  const [pin, setPin] = useState(initial ? "" : "0000");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [steps, setSteps] = useState<Step[]>(
    initial?.steps.length ? duplicateSteps(initial.steps) : defaultSteps(),
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSave() {
    setFormError(null);
    if (isActive && !initial?.hasPin && pin.length !== 4) {
      setFormError("Set a 4-digit PIN before creating an active invitation.");
      return;
    }
    if (isActive && steps.some((step) => step.options.length === 0)) {
      setFormError("Every active invitation step needs at least one option.");
      return;
    }

    setSaving(true);
    try {
      await onSave({ letterBody, pickupTime, pin, isActive, steps });
    } catch (exc) {
      setFormError(exc instanceof Error ? exc.message : "Could not save invitation.");
    } finally {
      setSaving(false);
    }
  }

  function updateStep(key: StepKey, patch: Partial<Step>) {
    setSteps((prev) =>
      prev.map((step) => (step.key === key ? { ...step, ...patch } : step)),
    );
  }

  function addOption(key: StepKey) {
    setSteps((prev) =>
      prev.map((step) =>
        step.key === key
          ? {
              ...step,
              options: [
                ...step.options,
                { id: crypto.randomUUID(), label: "", imageUrl: "" },
              ],
            }
          : step,
      ),
    );
  }

  function updateOption(key: StepKey, optionId: string, patch: Partial<OptionItem>) {
    setSteps((prev) =>
      prev.map((step) =>
        step.key === key
          ? {
              ...step,
              options: step.options.map((option) =>
                option.id === optionId ? { ...option, ...patch } : option,
              ),
            }
          : step,
      ),
    );
  }

  function removeOption(key: StepKey, optionId: string) {
    setSteps((prev) =>
      prev.map((step) =>
        step.key === key
          ? {
              ...step,
              options: step.options.filter((option) => option.id !== optionId),
            }
          : step,
      ),
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-zinc-500">
            {initial ? "Edit invitation" : "Create invitation"}
          </p>
          <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight text-white">
            {initial ? initial.pickupTime || "Untitled invitation" : "New invitation"}
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="w-full sm:w-auto" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {formError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {formError}
        </div>
      )}

      <FormSection title="Details">
        <Field label="Pickup time" hint="Shown on May's final summary">
          <input
            value={pickupTime}
            onChange={(event) => setPickupTime(event.target.value)}
            className="admin-input"
            placeholder="1:00 PM, Saturday 27.06.2026"
          />
        </Field>
        <Field
          label="PIN"
          hint={initial?.hasPin ? "Leave blank to keep the current PIN" : "Required before sharing"}
        >
          <input
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
            className="admin-input max-w-[160px]"
            placeholder={initial?.hasPin ? "unchanged" : "0000"}
            maxLength={4}
          />
        </Field>
        <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-zinc-950/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-zinc-300">Public May link</p>
            <p className="mt-1 text-xs text-zinc-600">
              {isActive ? "May can open this invitation." : "This invitation is hidden."}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((current) => !current)}
            className={`relative h-6 w-11 rounded-full transition ${
              isActive ? "bg-white" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-zinc-950 transition ${
                isActive ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </FormSection>

      <FormSection title="Letter">
        <Field label="Body">
          <textarea
            value={letterBody}
            onChange={(event) => setLetterBody(event.target.value)}
            rows={8}
            className="admin-input resize-none"
            placeholder="Write the invitation letter..."
          />
        </Field>
      </FormSection>

      {steps.map((step) => (
        <FormSection key={step.key} title={step.title || step.key}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Title">
              <input
                value={step.title}
                onChange={(event) => updateStep(step.key, { title: event.target.value })}
                className="admin-input"
              />
            </Field>
            <Field label="Subtitle">
              <input
                value={step.subtitle}
                onChange={(event) => updateStep(step.key, { subtitle: event.target.value })}
                className="admin-input"
              />
            </Field>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Options
              </p>
              <Button variant="secondary" onClick={() => addOption(step.key)}>
                Add option
              </Button>
            </div>
            {step.options.map((option) => (
              <div
                key={option.id}
                className="grid grid-cols-1 gap-2 rounded-lg border border-white/10 bg-zinc-950/40 p-2 lg:grid-cols-[1fr_2fr_auto]"
              >
                <input
                  value={option.label}
                  onChange={(event) =>
                    updateOption(step.key, option.id, { label: event.target.value })
                  }
                  className="admin-input"
                  placeholder="Label"
                />
                <input
                  value={option.imageUrl}
                  onChange={(event) =>
                    updateOption(step.key, option.id, { imageUrl: event.target.value })
                  }
                  className="admin-input"
                  placeholder="Image URL"
                />
                <Button
                  className="w-full lg:w-auto"
                  variant="ghost"
                  onClick={() => removeOption(step.key, option.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </FormSection>
      ))}
    </div>
  );
}
