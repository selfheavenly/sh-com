import { useState, type FormEvent } from "react";
import { Button } from "../common/Button";

interface AdminUnlockProps {
  onUnlock: (key: string) => void;
  error: string | null;
}

export function AdminUnlock({ onUnlock, error }: AdminUnlockProps) {
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
