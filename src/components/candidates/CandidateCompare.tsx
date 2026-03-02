import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Candidate } from '../../types/candidate';
import { useCandidates } from '../../hooks/useCandidates';
import { usePositionsByIds } from '../../hooks/usePositions';
import { StatusBadge } from './StatusBadge';

function CompareColumn({ candidate, allPositionIds }: { candidate: Candidate; allPositionIds: string[] }) {
  const { positions } = usePositionsByIds(allPositionIds);
  const linkedPositions = positions.filter(p => candidate.positionIds.includes(p.id));
  const initials = candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="text-center pb-5 border-b border-navy-800 mb-5">
        <div className="w-14 h-14 rounded-xl bg-navy-700 flex items-center justify-center mx-auto mb-3">
          <span className="text-amber-400 font-bold text-lg">{initials}</span>
        </div>
        <Link to={`/candidates/${candidate.id}`} className="text-base font-bold text-navy-100 hover:text-amber-400 transition-colors">
          {candidate.name}
        </Link>
        <p className="text-xs text-navy-400 font-medium mt-0.5">{candidate.professionalTitle}</p>
        <div className="mt-2"><StatusBadge status={candidate.status} /></div>
      </div>

      {/* Contact */}
      <Section title="Contact">
        <InfoRow label="Email" value={candidate.email} />
        <InfoRow label="Phone" value={candidate.phone} />
        <InfoRow label="Location" value={candidate.location} />
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-1.5">
          {candidate.skills.map(skill => (
            <span key={skill} className="px-2 py-0.5 bg-navy-800 text-navy-300 rounded text-[11px] font-medium border border-navy-700">
              {skill}
            </span>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        {candidate.workExperience.map((exp, i) => (
          <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-navy-800' : ''}>
            <p className="text-xs font-semibold text-navy-100">{exp.title}</p>
            <p className="text-[11px] text-navy-400">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
            <p className="text-[11px] text-navy-500 font-mono">{exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ' — Present'}</p>
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section title="Education">
        {candidate.education.map((edu, i) => (
          <div key={i} className={i > 0 ? 'mt-2' : ''}>
            <p className="text-xs font-semibold text-navy-100">{edu.degree}</p>
            <p className="text-[11px] text-navy-400">{edu.institution}</p>
          </div>
        ))}
      </Section>

      {/* Certifications */}
      {candidate.certifications && candidate.certifications.length > 0 && (
        <Section title="Certifications">
          {candidate.certifications.map((cert, i) => (
            <div key={i} className={i > 0 ? 'mt-2' : ''}>
              <p className="text-xs font-medium text-navy-100">{cert.name}</p>
              <p className="text-[11px] text-navy-500">{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
            </div>
          ))}
        </Section>
      )}

      {/* Languages */}
      {candidate.languages && candidate.languages.length > 0 && (
        <Section title="Languages">
          <div className="flex flex-wrap gap-1.5">
            {candidate.languages.map(lang => (
              <span key={lang} className="px-2 py-0.5 bg-navy-800 text-navy-300 rounded text-[11px] font-medium">
                {lang}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Linked Positions */}
      {linkedPositions.length > 0 && (
        <Section title="Positions">
          {linkedPositions.map(pos => (
            <Link key={pos.id} to={`/positions/${pos.id}`} className="block text-xs text-amber-400 hover:text-amber-300 font-medium">
              {pos.title} — {pos.company}
            </Link>
          ))}
        </Section>
      )}

      {/* CV Download */}
      <div className="mt-5">
        <a
          href={candidate.cvFile}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-navy-950 rounded-lg text-xs font-medium hover:bg-amber-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download CV
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-[10px] font-semibold text-navy-500 uppercase tracking-widest mb-2">{title}</h4>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-[11px] text-navy-500 w-16 flex-shrink-0">{label}</span>
      <span className="text-xs text-navy-300 font-medium">{value}</span>
    </div>
  );
}

export function CandidateCompare() {
  const { candidates, loading } = useCandidates();
  const [searchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<[string?, string?]>([
    searchParams.get('a') ?? undefined,
    searchParams.get('b') ?? undefined,
  ]);

  const selected = candidates.filter(c => selectedIds.includes(c.id));
  const allPositionIds = [...new Set(selected.flatMap(c => c.positionIds))];

  function handleSelect(slot: 0 | 1, id: string) {
    setSelectedIds(prev => {
      const next = [...prev] as [string?, string?];
      next[slot] = id;
      return next;
    });
  }

  if (loading) {
    return <div className="p-8 text-navy-500 text-sm">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto page-enter">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-100 tracking-tight">Compare Candidates</h2>
        <p className="text-sm text-navy-400 mt-1">Select two candidates to view side-by-side comparison</p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {([0, 1] as const).map(slot => (
          <div key={slot}>
            <label className="text-[11px] font-semibold text-navy-500 uppercase tracking-wider block mb-2">
              Candidate {slot + 1}
            </label>
            <select
              value={selectedIds[slot] ?? ''}
              onChange={e => handleSelect(slot, e.target.value)}
              className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-sm text-navy-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
            >
              <option value="">Select a candidate...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id} disabled={selectedIds[slot === 0 ? 1 : 0] === c.id}>
                  {c.name} — {c.professionalTitle}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison */}
      {selected.length === 2 ? (
        <div className="bg-navy-900 rounded-xl border border-navy-700/60 p-6">
          <div className="flex gap-8">
            <CompareColumn candidate={selected[0]} allPositionIds={allPositionIds} />
            <div className="w-px bg-navy-800 flex-shrink-0" />
            <CompareColumn candidate={selected[1]} allPositionIds={allPositionIds} />
          </div>

          {/* Skills diff */}
          <div className="mt-8 pt-6 border-t border-navy-800">
            <h3 className="text-sm font-bold text-navy-100 mb-4">Skills Comparison</h3>
            <SkillsDiff a={selected[0]} b={selected[1]} />
          </div>
        </div>
      ) : (
        <div className="bg-navy-900 rounded-xl border border-navy-700/60 border-dashed p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <p className="text-sm text-navy-500">Select two candidates above to start comparing</p>
        </div>
      )}
    </div>
  );
}

function SkillsDiff({ a, b }: { a: Candidate; b: Candidate }) {
  const aSkills = new Set(a.skills.map(s => s.toLowerCase()));
  const bSkills = new Set(b.skills.map(s => s.toLowerCase()));
  const allSkills = [...new Set([...a.skills, ...b.skills])];

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <p className="text-[11px] font-semibold text-navy-500 uppercase tracking-wider mb-2">Only {a.name.split(' ')[0]}</p>
        <div className="flex flex-wrap gap-1.5">
          {allSkills.filter(s => aSkills.has(s.toLowerCase()) && !bSkills.has(s.toLowerCase())).map(s => (
            <span key={s} className="px-2 py-0.5 bg-sky-500/15 text-sky-400 rounded text-[11px] font-medium">{s}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-navy-500 uppercase tracking-wider mb-2">Shared</p>
        <div className="flex flex-wrap gap-1.5">
          {allSkills.filter(s => aSkills.has(s.toLowerCase()) && bSkills.has(s.toLowerCase())).map(s => (
            <span key={s} className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-[11px] font-medium">{s}</span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-navy-500 uppercase tracking-wider mb-2">Only {b.name.split(' ')[0]}</p>
        <div className="flex flex-wrap gap-1.5">
          {allSkills.filter(s => !aSkills.has(s.toLowerCase()) && bSkills.has(s.toLowerCase())).map(s => (
            <span key={s} className="px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded text-[11px] font-medium">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
