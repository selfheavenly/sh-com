import { Button } from "./Button";

interface ConfirmDialogProps {
  title: string;
  body: string;
  actionLabel: string;
  confirming: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  title,
  body,
  actionLabel,
  confirming,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
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
