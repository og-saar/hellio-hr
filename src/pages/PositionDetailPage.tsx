import { useParams, Link } from 'react-router-dom';
import { usePosition } from '../hooks/usePositions';
import { useCandidatesByIds } from '../hooks/useCandidates';
import { PositionStatusBadge } from '../components/positions/PositionStatusBadge';
import { WorkArrangementBadge } from '../components/positions/WorkArrangementBadge';
import { StatusBadge } from '../components/candidates/StatusBadge';

export function PositionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { position, loading } = usePosition(id);
  const { candidates } = useCandidatesByIds(position?.candidateIds ?? []);

  if (loading) return <div className="p-8 text-navy-500 text-sm">Loading...</div>;
  if (!position) return <div className="p-8 text-navy-500 text-sm">Position not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto page-enter">
      {/* Back */}
      <Link to="/positions" className="inline-flex items-center gap-1.5 text-xs text-navy-500 hover:text-navy-300 font-medium mb-6 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to positions
      </Link>

      {/* Header */}
      <div className="bg-navy-900 rounded-xl border border-navy-700/60 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-navy-100 tracking-tight">{position.title}</h1>
              <PositionStatusBadge status={position.status} />
              <WorkArrangementBadge arrangement={position.workArrangement} />
            </div>
            <p className="text-sm text-navy-400 font-medium">{position.company}</p>
            <p className="text-sm text-navy-300 mt-3 leading-relaxed">{position.summary}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-navy-800 text-xs text-navy-400">
              {position.salaryRange && (
                <span className="font-semibold text-navy-100">{position.salaryRange}</span>
              )}
              <span>Posted {position.postedDate}</span>
              {position.timeline && <span>Timeline: {position.timeline}</span>}
              {position.contactName && (
                <span>Contact: {position.contactName}{position.contactEmail ? ` (${position.contactEmail})` : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main */}
        <div className="col-span-2 space-y-6">
          {/* Requirements */}
          <SectionCard title="Must Have">
            <ul className="space-y-2">
              {position.mustHave.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-navy-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </SectionCard>

          {position.niceToHave.length > 0 && (
            <SectionCard title="Nice to Have">
              <ul className="space-y-2">
                {position.niceToHave.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-navy-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          <SectionCard title="Responsibilities">
            <ul className="space-y-2">
              {position.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-navy-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-600 mt-1.5 flex-shrink-0" />
                  {resp}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <SectionCard title="Tech Stack">
            <div className="flex flex-wrap gap-1.5">
              {position.techStack.map(tech => (
                <span key={tech} className="px-2.5 py-1 bg-navy-800 text-navy-300 rounded-lg text-[11px] font-medium border border-navy-700">
                  {tech}
                </span>
              ))}
            </div>
          </SectionCard>

          {/* Linked Candidates */}
          <SectionCard title={`Candidates (${candidates.length})`}>
            {candidates.length === 0 ? (
              <p className="text-xs text-navy-500">No candidates linked yet</p>
            ) : (
              candidates.map(c => {
                const initials = c.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <Link
                    key={c.id}
                    to={`/candidates/${c.id}`}
                    className="flex items-center gap-3 p-3 bg-navy-800 rounded-lg hover:bg-navy-700 transition-colors mb-2 last:mb-0"
                  >
                    <div className="w-8 h-8 rounded-md bg-navy-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-400 font-bold text-[10px]">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy-100 truncate">{c.name}</p>
                      <p className="text-[11px] text-navy-400">{c.professionalTitle}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </Link>
                );
              })
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-navy-900 rounded-xl border border-navy-700/60 p-5">
      <h3 className="text-[10px] font-semibold text-navy-500 uppercase tracking-widest mb-4">{title}</h3>
      {children}
    </div>
  );
}
