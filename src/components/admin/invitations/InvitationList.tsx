import type { Invitation } from "../../../api";
import { StatusBadge } from "../common/StatusBadge";
import { formatDate } from "./invitationUtils";

interface InvitationListProps {
  invitations: Invitation[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function InvitationList({
  invitations,
  loading,
  selectedId,
  onSelect,
}: InvitationListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-white">Invitations</h2>
          <p className="mt-1 text-xs text-zinc-500">Select one to inspect or edit.</p>
        </div>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
          {invitations.length}
        </span>
      </div>

      <div className="space-y-2">
        {loading ? (
          <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-zinc-500">
            Loading invitations...
          </p>
        ) : invitations.length === 0 ? (
          <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-zinc-500">
            No invitations yet.
          </p>
        ) : (
          invitations.map((invitation) => (
            <button
              key={invitation.id}
              onClick={() => onSelect(invitation.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedId === invitation.id
                  ? "border-white/20 bg-white/10"
                  : "border-white/10 bg-zinc-950/40 hover:bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {invitation.pickupTime || "Untitled invitation"}
                  </p>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    Created {formatDate(invitation.createdAt)}
                  </p>
                </div>
                <StatusBadge tone={invitation.isActive ? "green" : "zinc"}>
                  {invitation.isActive ? "Active" : "Hidden"}
                </StatusBadge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge tone={invitation.response?.submittedAt ? "blue" : "amber"}>
                  {invitation.response?.submittedAt ? "Responded" : "Awaiting"}
                </StatusBadge>
                <StatusBadge tone={invitation.hasPin ? "zinc" : "red"}>
                  {invitation.hasPin ? "PIN set" : "No PIN"}
                </StatusBadge>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
