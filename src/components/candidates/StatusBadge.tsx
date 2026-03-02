import type { Candidate } from '../../types/candidate';

const statusConfig: Record<Candidate['status'], { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-sky-500/15 text-sky-400' },
  screening: { label: 'Screening', className: 'bg-amber-500/15 text-amber-400' },
  interview: { label: 'Interview', className: 'bg-violet-500/15 text-violet-400' },
  offer: { label: 'Offer', className: 'bg-emerald-500/15 text-emerald-400' },
  hired: { label: 'Hired', className: 'bg-emerald-500/15 text-emerald-400' },
  rejected: { label: 'Rejected', className: 'bg-rose-500/15 text-rose-400' },
};

export function StatusBadge({ status }: { status: Candidate['status'] }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-navy-700 text-navy-400' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
