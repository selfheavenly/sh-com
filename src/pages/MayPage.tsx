import { useState, useEffect, useCallback } from "react";
import { getInvitation } from "../api";
import type { Invitation, StepKey } from "../api";

import { MayLock } from "../components/may/MayLock";
import { MayBox } from "../components/may/MayBox";
import { InvitationLetter } from "../components/may/InvitationLetter";
import { StepperStop } from "../components/may/StepperStop";
import { DateSummary } from "../components/may/DateSummary";
import { LoadingScreen, ErrorScreen } from "../components/may/Screens";

// ---------------------------------------------------------------------------
// Screen types
// ---------------------------------------------------------------------------
type Screen =
  | "mailbox" // Envelope
  | "lock" // PIN entry
  | "letter" // Poetic letter
  | "film" // Stepper stop 1
  | "table" // Stepper stop 2
  | "glass" // Stepper stop 3
  | "activity" // Stepper stop 4
  | "summary"; // All done

const STEPPER_ORDER: StepKey[] = ["film", "table", "glass", "activity"];
const STEPPER_SCREENS = new Set<Screen>(["film", "table", "glass", "activity"]);

// Progress bar fractions: letter=0, film=1/5, table=2/5, glass=3/5, activity=4/5, summary=1
const PROGRESS: Record<Screen, number> = {
  lock: 0,
  mailbox: 0,
  letter: 0.13,
  film: 0.27,
  table: 0.4,
  glass: 0.67,
  activity: 0.83,
  summary: 1,
};

// ---------------------------------------------------------------------------
// MayPage
// ---------------------------------------------------------------------------

export function MayPage() {
  // Read invitation ID from the query string: /may?id=<uuid>
  const params = new URLSearchParams(window.location.search);
  const invitationId = params.get("id") ?? "";

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [screen, setScreen] = useState<Screen>("mailbox");
  const [pin, setPin] = useState("");
  // stepKey → optionId
  const [selections, setSelections] = useState<
    Partial<Record<StepKey, string>>
  >({});

  // Fetch invitation on mount (before PIN so we can validate it exists)
  useEffect(() => {
    if (!invitationId) {
      setLoadError("No invitation ID found in URL.");
      return;
    }
    getInvitation(invitationId)
      .then((inv) => setInvitation(inv))
      .catch(() => setLoadError("This invitation could not be found."));
  }, [invitationId]);

  const handleOpenEnvelope = useCallback(() => setScreen("lock"), []);
  const handleUnlocked = useCallback((unlockedPin: string) => {
    setPin(unlockedPin);
    setScreen("letter");
  }, []);
  const handleExplore = useCallback(() => setScreen("film"), []);

  useEffect(() => {
    if (!invitation || !STEPPER_SCREENS.has(screen)) return;

    const stepKey = screen as StepKey;
    const step = invitation.steps.find((s) => s.key === stepKey);
    if (step) return;

    const idx = STEPPER_ORDER.indexOf(stepKey);
    setScreen(idx < STEPPER_ORDER.length - 1 ? STEPPER_ORDER[idx + 1] : "summary");
  }, [invitation, screen]);

  function handleStepNext(key: StepKey) {
    const idx = STEPPER_ORDER.indexOf(key);
    if (idx < STEPPER_ORDER.length - 1) {
      setScreen(STEPPER_ORDER[idx + 1]);
    } else {
      setScreen("summary");
    }
  }

  function handleStepBack(key: StepKey) {
    const idx = STEPPER_ORDER.indexOf(key);
    if (idx === 0) {
      setScreen("letter");
    } else {
      setScreen(STEPPER_ORDER[idx - 1]);
    }
  }

  function handleSelect(key: StepKey, optionId: string) {
    setSelections((prev) => ({ ...prev, [key]: optionId }));
  }

  function handleUpdateResponse() {
    // Reset and start over from film
    setSelections({});
    setScreen("film");
  }

  // ---------------------------------------------------------------------------
  // Loading / error guards
  // ---------------------------------------------------------------------------
  if (!invitationId) return <MayLanding />;
  if (loadError) return <ErrorScreen message={loadError} />;
  if (!invitation) return <LoadingScreen />;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (screen === "lock") {
    return <MayLock invitationId={invitationId} onUnlocked={handleUnlocked} />;
  }

  if (screen === "mailbox") {
    return <MayBox onOpen={handleOpenEnvelope} />;
  }

  if (screen === "letter") {
    return (
      <InvitationLetter
        letterBody={invitation.letterBody}
        onExplore={handleExplore}
        progress={PROGRESS.letter}
      />
    );
  }

  if (screen === "summary") {
    return (
      <DateSummary
        invitation={invitation}
        selections={selections as Record<string, string>}
        pin={pin}
        onUpdateResponse={handleUpdateResponse}
      />
    );
  }

  // Stepper screens
  if (STEPPER_SCREENS.has(screen)) {
    const stepKey = screen as StepKey;
    const step = invitation.steps.find((s) => s.key === stepKey);
    if (!step) {
      return <LoadingScreen />;
    }
    const stepIdx = STEPPER_ORDER.indexOf(stepKey);
    return (
      <StepperStop
        step={step}
        selectedId={selections[stepKey] ?? null}
        onSelect={(id) => handleSelect(stepKey, id)}
        onBack={() => handleStepBack(stepKey)}
        onNext={() => handleStepNext(stepKey)}
        progress={PROGRESS[screen]}
        isLastStep={stepIdx === STEPPER_ORDER.length - 1}
      />
    );
  }

  return <ErrorScreen message="Unknown screen." />;
}

function MayLanding() {
  return (
    <div className="may-screen">
      <div className="may-stage">
        <div className="may-empty-content">
          <h1 className="may-script may-empty-title">Dear May,</h1>
          <p className="may-empty-copy">A little invitation needs its secret link.</p>
        </div>
      </div>
    </div>
  );
}
