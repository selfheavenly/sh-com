import { useCallback, useEffect, useMemo, useState } from "react";
import type { Invitation, InvitationInput } from "../api";
import {
  createInvitation,
  deleteInvitation,
  deleteInvitationResponse,
  listInvitations,
  updateInvitation,
} from "../api";
import { ConfirmDialog } from "../components/admin/common/ConfirmDialog";
import { DateDesignerPage } from "../components/admin/invitations/DateDesignerPage";
import { duplicateSteps } from "../components/admin/invitations/invitationDefaults";
import { AdminShell } from "../components/admin/layout/AdminShell";
import { AdminUnlock } from "../components/admin/layout/AdminUnlock";
import { AdminPasswordPage } from "../components/admin/settings/AdminPasswordPage";
import type {
  AdminSection,
  ConfirmConfig,
  InvitationView,
} from "../components/admin/types";

const ADMIN_KEY_STORAGE = "dateDesignerAdminKey";

export function AdminPage() {
  const [adminKey, setAdminKey] = useState(
    () => sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "",
  );
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>(() =>
    sectionFromPath(window.location.pathname),
  );
  const [invitationView, setInvitationView] =
    useState<InvitationView>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmConfig | null>(null);
  const [confirming, setConfirming] = useState(false);

  const loadInvitations = useCallback(
    async (key = adminKey) => {
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
    },
    [adminKey],
  );

  useEffect(() => {
    function handlePopState() {
      setActiveSection(sectionFromPath(window.location.pathname));
      setInvitationView("overview");
      setSidebarOpen(false);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  function navigateToSection(section: AdminSection) {
    const nextPath = pathForSection(section);
    if (window.location.pathname.replace(/\/+$/, "") !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setActiveSection(section);
    setInvitationView("overview");
    setSidebarOpen(false);
  }

  function handleUnlock(key: string) {
    sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
    setAdminKey(key);
  }

  function handleLock() {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey("");
    setInvitations([]);
    setSelectedId(null);
    setActiveSection("date-designer");
    setInvitationView("overview");
    setSidebarOpen(false);
    window.history.pushState({}, "", "/admin");
  }

  async function handleCreate(payload: InvitationInput) {
    const invitation = await createInvitation(payload, adminKey);
    await loadInvitations(adminKey);
    setSelectedId(invitation.id);
    setInvitationView("overview");
  }

  async function handleUpdate(invitation: Invitation, payload: InvitationInput) {
    await updateInvitation(invitation.id, payload, adminKey);
    await loadInvitations(adminKey);
    setInvitationView("overview");
  }

  function handleDelete(invitation: Invitation) {
    setConfirmState({
      title: "Delete invitation?",
      body: "This removes the invitation and its May link completely.",
      actionLabel: "Delete invitation",
      onConfirm: async () => {
        await deleteInvitation(invitation.id, adminKey);
        await loadInvitations(adminKey);
        setInvitationView("overview");
      },
    });
  }

  function handleClearResponse(invitation: Invitation) {
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
    setInvitationView("overview");
  }

  function handlePasswordChanged(newPassword: string) {
    sessionStorage.setItem(ADMIN_KEY_STORAGE, newPassword);
    setAdminKey(newPassword);
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

  return (
    <AdminShell
      activeSection={activeSection}
      sidebarCollapsed={sidebarCollapsed}
      sidebarOpen={sidebarOpen}
      onNavigate={navigateToSection}
      onLock={handleLock}
      onCloseSidebar={() => setSidebarOpen(false)}
      onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
    >
      {activeSection === "password" ? (
        <AdminPasswordPage
          adminKey={adminKey}
          onOpenNavigation={() => setSidebarOpen(true)}
          onPasswordChanged={handlePasswordChanged}
        />
      ) : (
        <DateDesignerPage
          invitations={invitations}
          loading={loading}
          selectedId={selectedId}
          selectedInvitation={selectedInvitation}
          view={invitationView}
          error={error}
          onOpenNavigation={() => setSidebarOpen(true)}
          onNewInvitation={() => {
            setSelectedId(null);
            setInvitationView("create");
          }}
          onSelectInvitation={(id) => {
            setSelectedId(id);
            setInvitationView("overview");
          }}
          onCancelForm={() => setInvitationView("overview")}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onEdit={() => setInvitationView("edit")}
          onDuplicate={handleDuplicate}
          onClearResponse={handleClearResponse}
          onDelete={handleDelete}
        />
      )}

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
    </AdminShell>
  );
}

function sectionFromPath(pathname: string): AdminSection {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/admin/settings/password") return "password";
  return "date-designer";
}

function pathForSection(section: AdminSection) {
  if (section === "password") return "/admin/settings/password";
  return "/admin/date-designer";
}
