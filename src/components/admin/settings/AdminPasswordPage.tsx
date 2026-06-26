import { useState, type FormEvent } from "react";
import { updateAdminPassword } from "../../../api";
import { Button } from "../common/Button";
import { Field } from "../common/Field";
import { AdminPageHeader } from "../layout/AdminPageHeader";

interface AdminPasswordPageProps {
  adminKey: string;
  onOpenNavigation: () => void;
  onPasswordChanged: (newPassword: string) => void;
}

export function AdminPasswordPage({
  adminKey,
  onOpenNavigation,
  onPasswordChanged,
}: AdminPasswordPageProps) {
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
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="Admin password"
        eyebrow="Settings"
        description="Update the password used to unlock this admin console."
        onOpenNavigation={onOpenNavigation}
      />

      <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 shadow-2xl sm:p-6">
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

          <Button
            className="mt-5 w-full sm:w-auto"
            variant="primary"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Change password"}
          </Button>
        </form>
      </section>
    </div>
  );
}
