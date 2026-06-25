import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
} from "react";
import type {
  Invitation,
  InvitationInput,
  OptionItem,
  Step,
  StepKey,
} from "../api";
import {
  createInvitation,
  deleteInvitation,
  deleteInvitationResponse,
  listInvitations,
  updateAdminPassword,
  updateInvitation,
} from "../api";

const STEP_KEYS: StepKey[] = ["film", "table", "glass", "activity"];
const STEP_DEFAULTS: Record<StepKey, { title: string; subtitle: string }> = {
  film: {
    title: "THE FILM",
    subtitle: "Lights out. Candles up. Private cinema.",
  },
  table: {
    title: "THE TABLE",
    subtitle: "Something tasteful and chosen by you.",
  },
  glass: {
    title: "THE GLASS",
    subtitle: "Pick your poison — or keep it innocent.",
  },
  activity: {
    title: "THE ACTIVITY",
    subtitle: "A small ritual for the right kind of date.",
  },
};
const STEP_OPTION_DEFAULTS: Record<StepKey, OptionItem[]> = {
  film: [
    {
      id: "film-blondes",
      label: "Gentlemen prefer blonds",
      imageUrl:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "film-prestige",
      label: "The Prestige",
      imageUrl:
        "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "film-kill-bill",
      label: "Kill Bill",
      imageUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    },
  ],
  table: [
    {
      id: "table-dessert",
      label: "Sweet dessert",
      imageUrl:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "table-popcorn",
      label: "Popcorn",
      imageUrl:
        "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "table-italian",
      label: "Italian",
      imageUrl:
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=600&q=80",
    },
  ],
  glass: [
    {
      id: "glass-mojito",
      label: "Mojito",
      imageUrl:
        "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "glass-gin-tonic",
      label: "Gin Tonic",
      imageUrl:
        "https://images.unsplash.com/photo-1621873495884-845a939892d7?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "glass-zero",
      label: "0%",
      imageUrl:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80",
    },
  ],
  activity: [
    {
      id: "activity-cards",
      label: "Cards",
      imageUrl:
        "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "activity-cooking",
      label: "Cooking together",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "activity-dancing",
      label: "Dancing",
      imageUrl:
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
    },
  ],
};
const DEFAULT_LETTER_BODY =
  "I send this letter as an invite,\nfor Saturday, soft and light.\n\nYou've had long tests, little rest,\nso I planned something gentle —\nbut dressed its best.\n\nA film, a flavour, something to do,\nall quietly chosen, but left up to you.\n\nSo take your pick, my dear May —\nand I'll take care of the rest of the day.";
const DEFAULT_PICKUP_TIME = "1:00 PM, Saturday 27.06.2026";

const ADMIN_KEY_STORAGE = "dateDesignerAdminKey";

type AdminView = "overview" | "create" | "edit" | "settings";
type ConfirmState = {
  title: string;
  body: string;
  actionLabel: string;
  onConfirm: () => Promise<void>;
} | null;

export function AdminPage() {
  const [adminKey, setAdminKey] = useState(
    () => sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "",
  );
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<AdminView>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [confirming, setConfirming] = useState(false);

  const loadInvitations = useCallback(async (key = adminKey) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listInvitations(key);
      setInvitations(data);
      setSelectedId((current) =>
        current && data.some((invitation) => invitation.id === current)
          ? current
          : data[0]?.id ?? null,
      );
    } catch {
      setError("Failed to load invitations. Check your admin key.");
      sessionStorage.removeItem(ADMIN_KEY_STORAGE);
      setAdminKey("");
      setInvitations([]);
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    if (!adminKey) {
      setLoading(false);
      return;
    }
    loadInvitations(adminKey);
  }, [adminKey, loadInvitations]);

  const selectedInvitation = useMemo(
    () => invitations.find((invitation) => invitation.id === selectedId) ?? null,
    [invitations, selectedId],
  );

  function handleUnlock(key: string) {
    sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
    setAdminKey(key);
  }

  function handleLock() {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey("");
    setInvitations([]);
    setSelectedId(null);
    setView("overview");
  }

  async function handleCreate(payload: InvitationInput) {
    const invitation = await createInvitation(payload, adminKey);
    await loadInvitations(adminKey);
    setSelectedId(invitation.id);
    setView("overview");
  }

  async function handleUpdate(invitation: Invitation, payload: InvitationInput) {
    await updateInvitation(invitation.id, payload, adminKey);
    await loadInvitations(adminKey);
    setView("overview");
  }

  async function handleDelete(invitation: Invitation) {
    setConfirmState({
      title: "Delete invitation?",
      body: "This removes the invitation and its May link completely.",
      actionLabel: "Delete invitation",
      onConfirm: async () => {
        await deleteInvitation(invitation.id, adminKey);
        await loadInvitations(adminKey);
        setView("overview");
      },
    });
  }

  async function handleClearResponse(invitation: Invitation) {
    if (!invitation.response?.submittedAt) return;
    setConfirmState({
      title: "Clear May's response?",
      body: "This removes the submitted choices, but keeps the invitation active.",
      actionLabel: "Clear response",
      onConfirm: async () => {
        await deleteInvitationResponse(invitation.id, adminKey);
        await loadInvitations(adminKey);
      },
    });
  }

  async function handleDuplicate(invitation: Invitation) {
    const duplicate = await createInvitation(
      {
        letterBody: invitation.letterBody,
        pickupTime: invitation.pickupTime,
        isActive: true,
        steps: duplicateSteps(invitation.steps),
        pin: "0000",
      },
      adminKey,
    );
    await loadInvitations(adminKey);
    setSelectedId(duplicate.id);
    setView("overview");
  }

  function handlePasswordChanged(newPassword: string) {
    sessionStorage.setItem(ADMIN_KEY_STORAGE, newPassword);
    setAdminKey(newPassword);
  }

  function closeMobileSidebar() {
    setSidebarOpen(false);
  }

  async function runConfirmedAction() {
    if (!confirmState) return;
    setConfirming(true);
    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } finally {
      setConfirming(false);
    }
  }

  if (!adminKey) {
    return <AdminUnlock onUnlock={handleUnlock} error={error} />;
  }

  const activeCount = invitations.filter((invitation) => invitation.isActive).length;
  const responseCount = invitations.filter((invitation) => invitation.response?.submittedAt).length;
  const shellGridClass = sidebarCollapsed
    ? "lg:grid-cols-[88px_1fr]"
    : "lg:grid-cols-[288px_1fr]";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <div className={`min-h-screen lg:grid ${shellGridClass}`}>
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 p-3 transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-900/90 p-4 shadow-2xl">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 font-semibold">
                SH
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-none">Self Heavenly</p>
                  <p className="mt-1 truncate text-xs text-zinc-500">Admin Console</p>
                </div>
              )}
            </div>

            <nav className="mt-8 space-y-6 text-sm">
              <NavGroup title="Mini Apps" collapsed={sidebarCollapsed}>
                <NavItem active collapsed={sidebarCollapsed} shortLabel="DD">
                  Date Designer
                </NavItem>
                <NavItem disabled collapsed={sidebarCollapsed} shortLabel="FM">
                  Future mini app
                </NavItem>
              </NavGroup>
              <NavGroup title="Website" collapsed={sidebarCollapsed}>
                <NavItem disabled collapsed={sidebarCollapsed} shortLabel="HP">
                  Home Page
                </NavItem>
                <NavItem
                  active={view === "settings"}
                  onClick={() => setView("settings")}
                  onAfterClick={closeMobileSidebar}
                  collapsed={sidebarCollapsed}
                  shortLabel="PW"
                >
                  Admin Password
                </NavItem>
              </NavGroup>
            </nav>

            <button
              onClick={handleLock}
              className="mt-auto rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
            >
              {sidebarCollapsed ? "Lock" : "Lock admin"}
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((current) => !current)}
              className="mt-2 hidden rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 lg:block"
              aria-expanded={!sidebarCollapsed}
            >
              {sidebarCollapsed ? "Expand" : "Collapse"}
            </button>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 lg:hidden"
                >
                  Menu
                </button>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                    <span>Mini Apps</span>
                    <span>/</span>
                    <span className="text-zinc-300">Date Designer</span>
                  </div>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    Invitations
                  </h1>
                </div>
              </div>
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                onClick={() => {
                  setView("create");
                  setSelectedId(null);
                  closeMobileSidebar();
                }}
              >
                New invitation
              </Button>
            </header>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MetricCard label="Total invitations" value={invitations.length} />
              <MetricCard label="Active" value={activeCount} />
              <MetricCard label="May responded" value={responseCount} />
            </section>

            <section className="grid min-h-[620px] grid-cols-1 gap-4 xl:grid-cols-[360px_1fr]">
              <InvitationList
                invitations={invitations}
                loading={loading}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setView("overview");
                }}
              />

              <div className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/70 shadow-2xl">
                {view === "create" ? (
                  <InvitationForm
                    key="create"
                    initial={null}
                    onSave={handleCreate}
                    onCancel={() => setView("overview")}
                  />
                ) : view === "settings" ? (
                  <AdminSettings
                    adminKey={adminKey}
                    onPasswordChanged={handlePasswordChanged}
                  />
                ) : view === "edit" && selectedInvitation ? (
                  <InvitationForm
                    key={selectedInvitation.id}
                    initial={selectedInvitation}
                    onSave={(payload) => handleUpdate(selectedInvitation, payload)}
                    onCancel={() => setView("overview")}
                  />
                ) : selectedInvitation ? (
                  <InvitationOverview
                    invitation={selectedInvitation}
                    invitationUrl={`${window.location.origin}/may?id=${selectedInvitation.id}`}
                    onEdit={() => setView("edit")}
                    onDuplicate={() => handleDuplicate(selectedInvitation)}
                    onClearResponse={() => handleClearResponse(selectedInvitation)}
                    onDelete={() => handleDelete(selectedInvitation)}
                  />
                ) : (
                  <EmptyState
                    title="No invitation selected"
                    body="Create or select an invitation to see its status, response, and editing options."
                    action={
                      <Button variant="primary" onClick={() => setView("create")}>
                        New invitation
                      </Button>
                    }
                  />
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
      {confirmState && (
        <ConfirmDialog
          title={confirmState.title}
          body={confirmState.body}
          actionLabel={confirmState.actionLabel}
          confirming={confirming}
          onCancel={() => setConfirmState(null)}
          onConfirm={runConfirmedAction}
        />
      )}
    </div>
  );
}

function AdminUnlock({
  onUnlock,
  error,
}: {
  onUnlock: (key: string) => void;
  error: string | null;
}) {
  const [key, setKey] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const cleaned = key.trim();
    if (cleaned) onUnlock(cleaned);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
      >
        <div className="mb-6">
          <p className="text-sm text-zinc-500">Self Heavenly</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Admin Console</h1>
        </div>
        <label className="block space-y-2">
          <span className="text-sm text-zinc-400">Admin key</span>
          <input
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="admin-input"
            type="password"
            autoFocus
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <Button className="mt-5 w-full" variant="primary" type="submit">
          Unlock
        </Button>
      </form>
    </div>
  );
}

function InvitationList({
  invitations,
  loading,
  selectedId,
  onSelect,
}: {
  invitations: Invitation[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-white">Invitation overview</h2>
          <p className="mt-1 text-xs text-zinc-500">Select one to inspect before editing.</p>
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
              <div className="mt-3 flex items-center gap-2">
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

function InvitationOverview({
  invitation,
  invitationUrl,
  onEdit,
  onDuplicate,
  onClearResponse,
  onDelete,
}: {
  invitation: Invitation;
  invitationUrl: string;
  onEdit: () => void;
  onDuplicate: () => void;
  onClearResponse: () => void;
  onDelete: () => void;
}) {
  const response = invitation.response;
  const canShare = invitation.isActive && invitation.hasPin;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-zinc-500">Selected invitation</p>
          <h2 className="mt-2 break-words text-2xl font-semibold tracking-tight text-white">
            {invitation.pickupTime || "Untitled invitation"}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge tone={invitation.isActive ? "green" : "zinc"}>
              {invitation.isActive ? "Active" : "Hidden"}
            </StatusBadge>
            <StatusBadge tone={response?.submittedAt ? "blue" : "amber"}>
              {response?.submittedAt ? "May responded" : "Missing response"}
            </StatusBadge>
            <StatusBadge tone={invitation.hasPin ? "zinc" : "red"}>
              {invitation.hasPin ? "PIN set" : "Set a PIN before sharing"}
            </StatusBadge>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={onDuplicate}>Duplicate</Button>
          <Button variant="secondary" onClick={onEdit}>Edit</Button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InfoCard label="Steps" value={invitation.steps.length} />
        <InfoCard
          label="Options"
          value={invitation.steps.reduce((sum, step) => sum + step.options.length, 0)}
        />
        <InfoCard label="Updated" value={formatDate(invitation.updatedAt)} />
      </section>

      <section className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
          <h3 className="text-sm font-medium text-white">Letter preview</h3>
          <p className="mt-3 max-h-44 overflow-auto whitespace-pre-line text-sm leading-6 text-zinc-400">
            {invitation.letterBody || "No letter body yet."}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">May response</h3>
            {response?.submittedAt && (
              <Button variant="danger" onClick={onClearResponse}>
                Clear response
              </Button>
            )}
          </div>
          {response?.submittedAt ? (
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-xs text-zinc-500">
                Submitted {formatDate(response.submittedAt)}
              </p>
              <ResponseRow label="Film" value={labelFor(invitation, "film", response.filmId)} />
              <ResponseRow label="Table" value={labelFor(invitation, "table", response.tableId)} />
              <ResponseRow label="Glass" value={labelFor(invitation, "glass", response.glassId)} />
              <ResponseRow label="Activity" value={labelFor(invitation, "activity", response.activityId)} />
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-white/10 p-5 text-sm text-zinc-500">
              May has not submitted a response yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-medium text-red-100">Danger zone</h3>
            <p className="mt-1 text-xs text-red-200/60">
              Delete only when this invitation should be removed completely.
            </p>
          </div>
          <Button className="w-full sm:w-auto" variant="danger" onClick={onDelete}>
            Delete invitation
          </Button>
        </div>
      </section>
    </div>
  );
}

interface InvitationFormProps {
  initial: Invitation | null;
  onSave: (payload: InvitationInput) => Promise<void>;
  onCancel: () => void;
}

function InvitationForm({ initial, onSave, onCancel }: InvitationFormProps) {
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
          ? { ...step, options: step.options.filter((option) => option.id !== optionId) }
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
          <Button className="w-full sm:w-auto" variant="primary" onClick={handleSave} disabled={saving}>
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
                <Button className="w-full lg:w-auto" variant="ghost" onClick={() => removeOption(step.key, option.id)}>
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

function AdminSettings({
  adminKey,
  onPasswordChanged,
}: {
  adminKey: string;
  onPasswordChanged: (newPassword: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const cleaned = password.trim();
    if (cleaned.length < 4) {
      setError("Use at least 4 characters.");
      return;
    }
    if (cleaned !== confirmPassword.trim()) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await updateAdminPassword(cleaned, adminKey);
      onPasswordChanged(cleaned);
      setPassword("");
      setConfirmPassword("");
      setMessage("Admin password updated.");
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not update password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <p className="text-sm text-zinc-500">Website</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Admin password
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
          The default password is root until you set a new one here.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl rounded-xl border border-white/10 bg-zinc-950/50 p-4"
      >
        <div className="space-y-4">
          <Field label="New password">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="admin-input"
              type="password"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm password">
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="admin-input"
              type="password"
              autoComplete="new-password"
            />
          </Field>
        </div>

        {message && <p className="mt-4 text-sm text-emerald-200">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

        <Button className="mt-5 w-full sm:w-auto" variant="primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Change password"}
        </Button>
      </form>
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  actionLabel,
  confirming,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  actionLabel: string;
  confirming: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button className="w-full sm:w-auto" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="danger"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? "Working..." : actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Button({
  children,
  className = "",
  variant = "secondary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants = {
    primary: "bg-white text-zinc-950 hover:bg-zinc-200",
    secondary: "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
    danger: "border border-red-500/25 bg-red-500/10 text-red-100 hover:bg-red-500/20",
    ghost: "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
  };

  return (
    <button
      {...props}
      className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function NavGroup({
  title,
  children,
  collapsed,
}: {
  title: string;
  children: ReactNode;
  collapsed?: boolean;
}) {
  return (
    <div>
      {!collapsed && (
        <p className="px-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          {title}
        </p>
      )}
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function NavItem({
  children,
  active,
  disabled,
  onClick,
  onAfterClick,
  collapsed,
  shortLabel,
}: {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onAfterClick?: () => void;
  collapsed?: boolean;
  shortLabel?: string;
}) {
  const content = collapsed ? shortLabel ?? children : children;
  const className = `w-full rounded-md px-3 py-2 ${
    collapsed ? "text-center" : "text-left"
  } ${
    active
      ? "bg-white/10 text-white"
      : disabled
        ? "text-zinc-600"
        : "text-zinc-400 hover:bg-white/5"
  }`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => {
          onClick();
          onAfterClick?.();
        }}
        className={className}
        title={collapsed && typeof children === "string" ? children : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={className} title={collapsed && typeof children === "string" ? children : undefined}>
      {content}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 shadow-2xl">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}

function StatusBadge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "green" | "blue" | "amber" | "red" | "zinc";
}) {
  const tones = {
    green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    blue: "border-sky-500/25 bg-sky-500/10 text-sky-200",
    amber: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    red: "border-red-500/25 bg-red-500/10 text-red-200",
    zinc: "border-white/10 bg-white/5 text-zinc-300",
  };

  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
      <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm text-zinc-300">
        {label}
        {hint && <span className="text-xs text-zinc-600">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[620px] items-center justify-center p-8 text-center">
      <div className="max-w-sm">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}

function ResponseRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-100">{value}</span>
    </div>
  );
}

function duplicateSteps(steps: Step[]): Step[] {
  return steps.map((step) => ({
    ...step,
    options: step.options.map((option) => ({ ...option })),
  }));
}

function defaultSteps(): Step[] {
  return STEP_KEYS.map((key) => ({
    key,
    ...STEP_DEFAULTS[key],
    options: STEP_OPTION_DEFAULTS[key].map((option) => ({ ...option })),
  }));
}

function labelFor(invitation: Invitation, key: StepKey, optionId: string | null) {
  if (!optionId) return "Not selected";
  const step = invitation.steps.find((item) => item.key === key);
  return step?.options.find((option) => option.id === optionId)?.label ?? optionId;
}

function formatDate(value: string | null | undefined) {
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
