export type AdminSection = "date-designer" | "password";
export type InvitationView = "overview" | "create" | "edit";

export interface ConfirmConfig {
  title: string;
  body: string;
  actionLabel: string;
  onConfirm: () => Promise<void>;
}
