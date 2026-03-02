import { Link } from 'react-router-dom';
import { usePositions } from '../hooks/usePositions';
import { PositionStatusBadge } from '../components/positions/PositionStatusBadge';
import { WorkArrangementBadge } from '../components/positions/WorkArrangementBadge';

export function PositionsPage() {
  const { positions, loading } = usePositions();

  if (loading) return <div className="p-8 text-navy-500 text-sm">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto page-enter">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-100 tracking-tight">Open Positions</h2>
        <p className="text-sm text-navy-400 mt-1">{positions.length} active positions</p>
      </div>

      <div className="space-y-3">
        {positions.map((pos, i) => (
          <Link
            key={pos.id}
            to={`/positions/${pos.id}`}
            className="stagger-item block bg-navy-900 rounded-xl border border-navy-700/60 p-5 hover:border-navy-600 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-navy-100">{pos.title}</h3>
                  <PositionStatusBadge status={pos.status} />
                  <WorkArrangementBadge arrangement={pos.workArrangement} />
                </div>
                <p className="text-xs text-navy-400 font-medium">{pos.company}</p>
                <p className="text-xs text-navy-300 mt-2 line-clamp-2">{pos.summary}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {pos.techStack.slice(0, 6).map(tech => (
                    <span key={tech} className="px-2 py-0.5 bg-navy-800 text-navy-300 rounded text-[11px] font-medium border border-navy-700">
                      {tech}
                    </span>
                  ))}
                  {pos.techStack.length > 6 && (
                    <span className="px-2 py-0.5 text-navy-500 text-[11px] font-medium">
                      +{pos.techStack.length - 6}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-4">
                {pos.salaryRange && (
                  <p className="text-xs font-semibold text-navy-100">{pos.salaryRange}</p>
                )}
                <p className="text-[11px] text-navy-500 mt-1">{pos.candidateIds.length} candidate{pos.candidateIds.length !== 1 ? 's' : ''}</p>
                {pos.timeline && (
                  <p className="text-[11px] text-navy-500">{pos.timeline}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
