import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../hooks/useCandidates';
import { CandidateCard } from '../components/candidates/CandidateCard';
import type { Candidate } from '../types/candidate';

const statuses: Array<Candidate['status'] | 'all'> = ['all', 'new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

export function CandidatesPage() {
  const { candidates, loading } = useCandidates();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Candidate['status'] | 'all'>('all');
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let result = candidates;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.professionalTitle.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    return result;
  }, [candidates, search, statusFilter]);

  function toggleCompare(id: string) {
    setCompareIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 2) {
        next.add(id);
      }
      return next;
    });
  }

  function goToCompare() {
    const ids = [...compareIds];
    if (ids.length === 2) {
      navigate(`/compare?a=${ids[0]}&b=${ids[1]}`);
    }
  }

  if (loading) {
    return <div className="p-8 text-navy-500 text-sm">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-100 tracking-tight">Candidates</h2>
          <p className="text-sm text-navy-400 mt-1">{candidates.length} candidates in pipeline</p>
        </div>
        {compareIds.size === 2 && (
          <button
            onClick={goToCompare}
            className="px-4 py-2 bg-amber-500 text-navy-950 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors shadow-sm"
          >
            Compare Selected ({compareIds.size})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, title, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-sm text-navy-200 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1 bg-navy-800/50 rounded-lg p-0.5">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold capitalize transition-all duration-150 ${
                statusFilter === s
                  ? 'bg-navy-700 text-navy-100 shadow-sm'
                  : 'text-navy-500 hover:text-navy-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-navy-500">No candidates match your search</p>
          </div>
        ) : (
          filtered.map((c, i) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              index={i}
              onCompareToggle={toggleCompare}
              isCompareSelected={compareIds.has(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
