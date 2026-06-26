interface InvitationSummaryCardProps {
  total: number;
  active: number;
  responded: number;
}

export function InvitationSummaryCard({
  total,
  active,
  responded,
}: InvitationSummaryCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 shadow-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Invitation status</p>
          <p className="mt-1 text-xs text-zinc-500">
            A compact snapshot of the Date Designer workspace.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[360px]">
          <SummaryValue label="Total" value={total} />
          <SummaryValue label="Active" value={active} />
          <SummaryValue label="Responded" value={responded} />
        </div>
      </div>
    </section>
  );
}

function SummaryValue({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/50 px-3 py-2">
      <p className="text-lg font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
    </div>
  );
}
