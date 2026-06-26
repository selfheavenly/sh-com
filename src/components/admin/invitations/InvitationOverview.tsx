import type { Invitation, StepKey } from "../../../api";
import { Button } from "../common/Button";
import { StatusBadge } from "../common/StatusBadge";
import { STEP_KEYS } from "./invitationDefaults";
import {
  countOptions,
  formatDate,
  selectedResponseOption,
} from "./invitationUtils";

interface InvitationOverviewProps {
  invitation: Invitation;
  invitationUrl: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onClearResponse: () => void;
  onDelete: () => void;
}

export function InvitationOverview({
  invitation,
  invitationUrl,
  onEdit,
  onDuplicate,
  onClearResponse,
  onDelete,
}: InvitationOverviewProps) {
  const response = invitation.response;
  const hasResponse = Boolean(response?.submittedAt);
  const canShare = invitation.isActive && invitation.hasPin;

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-zinc-500">Selected invitation</p>
          <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight text-white">
            {invitation.pickupTime || "Untitled invitation"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge tone={invitation.isActive ? "green" : "zinc"}>
              {invitation.isActive ? "Active" : "Hidden"}
            </StatusBadge>
            <StatusBadge tone={hasResponse ? "blue" : "amber"}>
              {hasResponse ? "May responded" : "Missing response"}
            </StatusBadge>
            <StatusBadge tone={invitation.hasPin ? "zinc" : "red"}>
              {invitation.hasPin ? "PIN set" : "Set a PIN before sharing"}
            </StatusBadge>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
            <span>{invitation.steps.length} steps</span>
            <span>{countOptions(invitation)} options</span>
            <span>Updated {formatDate(invitation.updatedAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <Button variant="secondary" onClick={onDuplicate}>
            Duplicate
          </Button>
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      {hasResponse && response ? (
        <MayResponsePanel
          invitation={invitation}
          submittedAt={response.submittedAt}
          selections={{
            film: response.filmId,
            table: response.tableId,
            glass: response.glassId,
            activity: response.activityId,
          }}
          onClearResponse={onClearResponse}
        />
      ) : (
        <section className="rounded-xl border border-dashed border-white/10 bg-zinc-950/40 p-4 text-sm text-zinc-500">
          May has not submitted a response yet.
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <LetterPreview invitation={invitation} />
        <MayLinkPanel invitationUrl={invitationUrl} canShare={canShare} />
      </section>
    </div>
  );
}

function MayResponsePanel({
  invitation,
  submittedAt,
  selections,
  onClearResponse,
}: {
  invitation: Invitation;
  submittedAt: string | null;
  selections: Record<StepKey, string | null>;
  onClearResponse: () => void;
}) {
  return (
    <section className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-sky-100">May response</h3>
          <p className="mt-1 text-xs text-sky-100/60">
            Submitted {formatDate(submittedAt)}
          </p>
        </div>
        <Button className="w-full sm:w-auto" variant="danger" onClick={onClearResponse}>
          Clear response
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {STEP_KEYS.map((key) => {
          const choice = selectedResponseOption(invitation, key, selections[key]);
          return <ResponseChoiceCard key={key} choice={choice} />;
        })}
      </div>
    </section>
  );
}

function ResponseChoiceCard({
  choice,
}: {
  choice: ReturnType<typeof selectedResponseOption>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70">
      <div className="aspect-[4/3] bg-white/5">
        {choice.imageUrl ? (
          <img
            src={choice.imageUrl}
            alt={choice.optionLabel}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-zinc-600">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {choice.stepLabel}
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-medium text-white">
          {choice.optionLabel}
        </p>
        {!choice.known && choice.selected && (
          <p className="mt-1 text-xs text-amber-200/70">Option no longer exists</p>
        )}
      </div>
    </div>
  );
}

function LetterPreview({ invitation }: { invitation: Invitation }) {
  return (
    <section className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
      <h3 className="text-sm font-medium text-white">Letter preview</h3>
      <p className="mt-3 max-h-80 overflow-auto whitespace-pre-line text-sm leading-6 text-zinc-400">
        {invitation.letterBody || "No letter body yet."}
      </p>
    </section>
  );
}

function MayLinkPanel({
  invitationUrl,
  canShare,
}: {
  invitationUrl: string;
  canShare: boolean;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:flex-col xl:items-start">
        <div>
          <h3 className="text-sm font-medium text-white">May link</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {canShare
              ? "Share this URL with May. Duplicates use PIN 0000 until changed."
              : "Activate this invitation and set a PIN before sharing."}
          </p>
        </div>
        {canShare && (
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => navigator.clipboard?.writeText(invitationUrl)}
          >
            Copy
          </Button>
        )}
      </div>
      {canShare ? (
        <a
          href={invitationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-300 hover:text-white"
        >
          {invitationUrl}
        </a>
      ) : (
        <div className="mt-3 rounded-lg border border-dashed border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          This May link is not public yet.
        </div>
      )}
    </section>
  );
}
