import type { Invitation, InvitationInput } from "../../../api";
import type { InvitationView } from "../types";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { AdminPageHeader } from "../layout/AdminPageHeader";
import { InvitationForm } from "./InvitationForm";
import { InvitationList } from "./InvitationList";
import { InvitationOverview } from "./InvitationOverview";
import { InvitationSummaryCard } from "./InvitationSummaryCard";

interface DateDesignerPageProps {
  invitations: Invitation[];
  loading: boolean;
  selectedId: string | null;
  selectedInvitation: Invitation | null;
  view: InvitationView;
  error: string | null;
  onOpenNavigation: () => void;
  onNewInvitation: () => void;
  onSelectInvitation: (id: string) => void;
  onCancelForm: () => void;
  onCreate: (payload: InvitationInput) => Promise<void>;
  onUpdate: (invitation: Invitation, payload: InvitationInput) => Promise<void>;
  onEdit: () => void;
  onDuplicate: (invitation: Invitation) => void;
  onClearResponse: (invitation: Invitation) => void;
  onDelete: (invitation: Invitation) => void;
}

export function DateDesignerPage({
  invitations,
  loading,
  selectedId,
  selectedInvitation,
  view,
  error,
  onOpenNavigation,
  onNewInvitation,
  onSelectInvitation,
  onCancelForm,
  onCreate,
  onUpdate,
  onEdit,
  onDuplicate,
  onClearResponse,
  onDelete,
}: DateDesignerPageProps) {
  const activeCount = invitations.filter((invitation) => invitation.isActive).length;
  const responseCount = invitations.filter((invitation) => invitation.response?.submittedAt).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Invitations"
        eyebrow="Date Designer"
        onOpenNavigation={onOpenNavigation}
        action={
          <Button
            variant="primary"
            className="w-full sm:w-auto"
            onClick={onNewInvitation}
          >
            New invitation
          </Button>
        }
      />

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <InvitationSummaryCard
        total={invitations.length}
        active={activeCount}
        responded={responseCount}
      />

      <section className="grid min-h-[620px] grid-cols-1 gap-4 xl:grid-cols-[360px_1fr]">
        <InvitationList
          invitations={invitations}
          loading={loading}
          selectedId={selectedId}
          onSelect={onSelectInvitation}
        />

        <div className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/70 shadow-2xl">
          {view === "create" ? (
            <InvitationForm key="create" initial={null} onSave={onCreate} onCancel={onCancelForm} />
          ) : view === "edit" && selectedInvitation ? (
            <InvitationForm
              key={selectedInvitation.id}
              initial={selectedInvitation}
              onSave={(payload) => onUpdate(selectedInvitation, payload)}
              onCancel={onCancelForm}
            />
          ) : selectedInvitation ? (
            <InvitationOverview
              invitation={selectedInvitation}
              invitationUrl={`${window.location.origin}/may?id=${selectedInvitation.id}`}
              onEdit={onEdit}
              onDuplicate={() => onDuplicate(selectedInvitation)}
              onClearResponse={() => onClearResponse(selectedInvitation)}
              onDelete={() => onDelete(selectedInvitation)}
            />
          ) : (
            <EmptyState
              title="No invitation selected"
              body="Create or select an invitation to see its status, response, and editing options."
              action={
                <Button variant="primary" onClick={onNewInvitation}>
                  New invitation
                </Button>
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
