import type { Position } from '../../types/position';

const statusConfig: Record<Position['status'], { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-emerald-500/15 text-emerald-400' },
  closed: { label: 'Closed', className: 'bg-navy-700 text-navy-400' },
  'on-hold': { label: 'On Hold', className: 'bg-amber-500/15 text-amber-400' },
};

export function PositionStatusBadge({ status }: { status: Position['status'] }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-navy-700 text-navy-400' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
