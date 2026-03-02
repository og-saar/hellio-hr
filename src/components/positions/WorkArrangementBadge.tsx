import type { Position } from '../../types/position';

const arrangementConfig: Record<Position['workArrangement'], { label: string; className: string }> = {
  remote: { label: 'Remote', className: 'bg-sky-500/15 text-sky-400' },
  hybrid: { label: 'Hybrid', className: 'bg-violet-500/15 text-violet-400' },
  onsite: { label: 'Onsite', className: 'bg-navy-700 text-navy-400' },
};

export function WorkArrangementBadge({ arrangement }: { arrangement: Position['workArrangement'] }) {
  const config = arrangementConfig[arrangement] ?? { label: arrangement, className: 'bg-navy-700 text-navy-400' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
