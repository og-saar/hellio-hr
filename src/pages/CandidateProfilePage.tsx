import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCandidate } from '../hooks/useCandidates';
import { usePositions, usePositionsByIds } from '../hooks/usePositions';
import { StatusBadge } from '../components/candidates/StatusBadge';
import { addPositionToCandidate, removePositionFromCandidate } from '../services/candidateService';
import { addCandidateToPosition, removeCandidateFromPosition } from '../services/positionService';

export function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { candidate, loading } = useCandidate(id);
  const { positions: allPositions } = usePositions();
  const [linkedIds, setLinkedIds] = useState<string[] | null>(null);

  // Use linkedIds local state once a mutation happens, otherwise fall back to candidate data
  const positionIds = linkedIds ?? candidate?.positionIds ?? [];
  const { positions: linkedPositions } = usePositionsByIds(positionIds);
  const availablePositions = allPositions.filter(p => !positionIds.includes(p.id));

  const handleAdd = useCallback(async (positionId: string) => {
    if (!id) return;
    await addPositionToCandidate(id, positionId);
    await addCandidateToPosition(positionId, id);
    setLinkedIds(prev => [...(prev ?? candidate?.positionIds ?? []), positionId]);
  }, [id, candidate?.positionIds]);

  const handleRemove = useCallback(async (positionId: string) => {
    if (!id) return;
    await removePositionFromCandidate(id, positionId);
    await removeCandidateFromPosition(positionId, id);
    setLinkedIds(prev => (prev ?? candidate?.positionIds ?? []).filter(pid => pid !== positionId));
  }, [id, candidate?.positionIds]);

  if (loading) return <div className="p-8 text-navy-500 text-sm">Loading...</div>;
  if (!candidate) return <div className="p-8 text-navy-500 text-sm">Candidate not found</div>;

  const initials = candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="p-8 max-w-4xl mx-auto page-enter">
      {/* Back */}
      <Link to="/candidates" className="inline-flex items-center gap-1.5 text-xs text-navy-500 hover:text-navy-300 font-medium mb-6 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to candidates
      </Link>

      {/* Profile Header */}
      <div className="bg-navy-900 rounded-xl border border-navy-700/60 p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-xl bg-navy-700 flex items-center justify-center flex-shrink-0">
            <span className="text-amber-400 font-bold text-xl">{initials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-navy-100 tracking-tight">{candidate.name}</h1>
              <StatusBadge status={candidate.status} />
            </div>
            <p className="text-sm text-navy-400 font-medium">{candidate.professionalTitle}</p>
            <p className="text-sm text-navy-300 mt-3 leading-relaxed">{candidate.summary}</p>

            {/* Contact row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-navy-800">
              <ContactItem icon="email" value={candidate.email} />
              {candidate.phone && <ContactItem icon="phone" value={candidate.phone} />}
              {candidate.location && <ContactItem icon="location" value={candidate.location} />}
              {candidate.linkedinUrl && (
                <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 hover:text-amber-300 font-medium">
                  LinkedIn
                </a>
              )}
              {candidate.githubUrl && (
                <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-400 hover:text-amber-300 font-medium">
                  GitHub
                </a>
              )}
              <a
                href={candidate.cvFile}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-navy-950 rounded-lg text-xs font-medium hover:bg-amber-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          <SectionCard title="Work Experience">
            {candidate.workExperience.map((exp, i) => (
              <div key={i} className={i > 0 ? 'mt-5 pt-5 border-t border-navy-800' : ''}>
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="text-sm font-semibold text-navy-100">{exp.title}</h4>
                  <span className="text-[11px] text-navy-500 font-mono flex-shrink-0">
                    {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ' — Present'}
                  </span>
                </div>
                <p className="text-xs text-navy-400 font-medium mb-2">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                <p className="text-xs text-navy-300 leading-relaxed">{exp.description}</p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="text-xs text-navy-300 pl-3 relative before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:rounded-full before:bg-navy-600">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </SectionCard>

          {/* Education */}
          <SectionCard title="Education">
            {candidate.education.map((edu, i) => (
              <div key={i} className={i > 0 ? 'mt-4 pt-4 border-t border-navy-800' : ''}>
                <h4 className="text-sm font-semibold text-navy-100">{edu.degree}</h4>
                <p className="text-xs text-navy-400 font-medium">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {(edu.startDate || edu.endDate) && (
                  <p className="text-[11px] text-navy-500 font-mono mt-0.5">
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </p>
                )}
              </div>
            ))}
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          <SectionCard title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map(skill => (
                <span key={skill} className="px-2.5 py-1 bg-navy-800 text-navy-300 rounded-lg text-[11px] font-medium border border-navy-700">
                  {skill}
                </span>
              ))}
            </div>
          </SectionCard>

          {/* Certifications */}
          {candidate.certifications && candidate.certifications.length > 0 && (
            <SectionCard title="Certifications">
              {candidate.certifications.map((cert, i) => (
                <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-navy-800' : ''}>
                  <p className="text-xs font-semibold text-navy-100">{cert.name}</p>
                  <p className="text-[11px] text-navy-500">{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
                </div>
              ))}
            </SectionCard>
          )}

          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <SectionCard title="Languages">
              <div className="space-y-1">
                {candidate.languages.map(lang => (
                  <p key={lang} className="text-xs text-navy-300 font-medium">{lang}</p>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Linked Positions — with add/remove */}
          <SectionCard title="Positions">
            {linkedPositions.length > 0 ? (
              <div className="space-y-2 mb-3">
                {linkedPositions.map(pos => (
                  <div key={pos.id} className="flex items-center gap-2 p-3 bg-navy-800 rounded-lg group">
                    <Link to={`/positions/${pos.id}`} className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy-100 hover:text-amber-400 transition-colors">{pos.title}</p>
                      <p className="text-[11px] text-navy-400">{pos.company}</p>
                    </Link>
                    <button
                      onClick={() => handleRemove(pos.id)}
                      className="flex-shrink-0 p-1 rounded text-navy-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove position"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-navy-500 mb-3">No positions linked</p>
            )}

            {/* Add position dropdown */}
            {availablePositions.length > 0 && (
              <div>
                <label className="text-[11px] text-navy-500 font-medium block mb-1.5">Add position</label>
                <select
                  defaultValue=""
                  onChange={e => { if (e.target.value) { handleAdd(e.target.value); e.target.value = ''; } }}
                  className="w-full px-2.5 py-1.5 bg-navy-800 border border-navy-700 rounded-lg text-xs text-navy-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
                >
                  <option value="">Select a position...</option>
                  {availablePositions.map(p => (
                    <option key={p.id} value={p.id}>{p.title} — {p.company}</option>
                  ))}
                </select>
              </div>
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

function ContactItem({ icon, value }: { icon: 'email' | 'phone' | 'location'; value: string }) {
  const icons = {
    email: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />,
    location: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />,
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-navy-400">
      <svg className="w-3.5 h-3.5 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        {icons[icon]}
      </svg>
      {value}
    </span>
  );
}
