/**
 * api.ts — typed client for the Date Designer Azure Functions backend.
 *
 * All functions throw on network error; callers handle UI error states.
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

// ---------------------------------------------------------------------------
// Domain types (mirror backend models)
// ---------------------------------------------------------------------------

export interface OptionItem {
  id: string;
  label: string;
  imageUrl: string;
}

export type StepKey = "film" | "table" | "glass" | "activity";

export interface Step {
  key: StepKey;
  title: string;
  subtitle: string;
  options: OptionItem[];
}

export interface InvitationResponse {
  filmId: string | null;
  tableId: string | null;
  glassId: string | null;
  activityId: string | null;
  submittedAt: string | null;
}

export interface Invitation {
  id: string;
  letterBody: string;
  pickupTime: string;
  steps: Step[];
  response: InvitationResponse | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  hasPin: boolean;
}

export interface SubmitResponsePayload {
  pin: string;
  filmId?: string;
  tableId?: string;
  glassId?: string;
  activityId?: string;
}

export type InvitationInput = Omit<
  Invitation,
  "id" | "createdAt" | "updatedAt" | "response" | "hasPin"
> & {
  pin?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  options: RequestInit = {},
  adminKey?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (adminKey) {
    headers["X-Admin-Key"] = adminKey;
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Public API (May's side)
// ---------------------------------------------------------------------------

/** Fetch the active invitation for the /may page. */
export async function getInvitation(id: string): Promise<Invitation> {
  return request<Invitation>(`/invitations/${id}`);
}

/** Verify May's 4-digit PIN. */
export async function verifyPin(
  invitationId: string,
  pin: string,
): Promise<{ valid: boolean; invitation?: Invitation }> {
  return request<{ valid: boolean; invitation?: Invitation }>("/auth/verify-pin", {
    method: "POST",
    body: JSON.stringify({ invitationId, pin }),
  });
}

/** May submits her choices. */
export async function submitResponse(
  invitationId: string,
  payload: SubmitResponsePayload,
): Promise<{ message: string; response: InvitationResponse }> {
  return request(`/invitations/${invitationId}/response`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Admin API
// ---------------------------------------------------------------------------

export async function listInvitations(adminKey: string): Promise<Invitation[]> {
  return request<Invitation[]>("/invitations", {}, adminKey);
}

export async function createInvitation(
  payload: InvitationInput,
  adminKey: string,
): Promise<Invitation> {
  return request<Invitation>(
    "/invitations",
    { method: "POST", body: JSON.stringify(payload) },
    adminKey,
  );
}

export async function updateInvitation(
  id: string,
  payload: Partial<InvitationInput>,
  adminKey: string,
): Promise<Invitation> {
  return request<Invitation>(
    `/invitations/${id}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    adminKey,
  );
}

export async function deleteInvitation(id: string, adminKey: string): Promise<void> {
  return request(`/invitations/${id}`, { method: "DELETE" }, adminKey);
}

export async function getInvitationResponse(
  id: string,
  adminKey: string,
): Promise<InvitationResponse | null> {
  return request<InvitationResponse | null>(
    `/invitations/${id}/response`,
    {},
    adminKey,
  );
}

export async function deleteInvitationResponse(
  id: string,
  adminKey: string,
): Promise<void> {
  return request(`/invitations/${id}/response`, { method: "DELETE" }, adminKey);
}

export async function updateAdminPassword(
  password: string,
  adminKey: string,
): Promise<{ message: string }> {
  return request<{ message: string }>(
    "/admin/password",
    { method: "POST", body: JSON.stringify({ password }) },
    adminKey,
  );
}
