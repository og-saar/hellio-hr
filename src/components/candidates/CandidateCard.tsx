import { Link } from 'react-router-dom';
import type { Candidate } from '../../types/candidate';
import { StatusBadge } from './StatusBadge';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  onCompareToggle?: (id: string) => void;
  isCompareSelected?: boolean;
}

export function CandidateCard({ candidate, index, onCompareToggle, isCompareSelected }: CandidateCardProps) {
  const initials = candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div
      className="stagger-item group relative bg-navy-900 rounded-xl border border-navy-700/60 p-5 hover:border-navy-600 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0">
          <span className="text-amber-400 font-bold text-sm">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Link to={`/candidates/${candidate.id}`} className="text-sm font-semibold text-navy-100 hover:text-amber-400 transition-colors truncate">
              {candidate.name}
            </Link>
            <StatusBadge status={candidate.status} />
          </div>
          <p className="text-xs text-navy-400 font-medium">{candidate.professionalTitle}</p>
          {candidate.location && (
            <p className="text-[11px] text-navy-500 mt-1">{candidate.location}</p>
          )}

          {/* Skills preview */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {candidate.skills.slice(0, 4).map(skill => (
              <span key={skill} className="px-2 py-0.5 bg-navy-800 text-navy-300 rounded text-[11px] font-medium border border-navy-700">
                {skill}
              </span>
            ))}
            {candidate.skills.length > 4 && (
              <span className="px-2 py-0.5 text-navy-500 text-[11px] font-medium">
                +{candidate.skills.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2">
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(candidate.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-150 ${
                isCompareSelected
                  ? 'bg-amber-500 text-navy-950'
                  : 'bg-navy-800 text-navy-400 hover:bg-navy-700 hover:text-navy-200'
              }`}
            >
              {isCompareSelected ? 'Selected' : 'Compare'}
            </button>
          )}
          <Link
            to={`/candidates/${candidate.id}`}
            className="text-[11px] text-navy-500 hover:text-navy-200 font-medium transition-colors"
          >
            View profile &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
