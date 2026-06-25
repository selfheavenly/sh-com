interface InvitationLetterProps {
  letterBody: string;
  onExplore: () => void;
  progress: number; // 0..1 for the top progress bar (here: 0)
}

export function InvitationLetter({
  letterBody,
  onExplore,
  progress,
}: InvitationLetterProps) {
  const stanzas = letterBody.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="may-screen">
      <div className="may-stage may-stage-unlocked">
        <ProgressBar value={progress} />

        <div className="may-letter-copy">
          <h1 className="may-script may-letter-title">Dear May,</h1>

          <div className="may-serif may-letter-stanzas">
            {stanzas.map((stanza, i) => (
              <p key={i}>{stanza.trim()}</p>
            ))}
          </div>
        </div>

        <button
          onClick={onExplore}
          className="may-action-link may-letter-action"
        >
          Explore&nbsp;→
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared progress bar used on letter + stepper screens
// ---------------------------------------------------------------------------

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="may-progress may-progress-position">
      <div
        className="may-progress-fill"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}
