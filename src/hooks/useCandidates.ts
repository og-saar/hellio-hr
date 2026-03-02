import { useState, useEffect } from 'react';
import type { Candidate } from '../types/candidate';
import { getCandidates, getCandidateById, getCandidatesByIds } from '../services/candidateService';

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidates().then(data => {
      setCandidates(data);
      setLoading(false);
    });
  }, []);

  return { candidates, loading };
}

export function useCandidate(id: string | undefined) {
  const [candidate, setCandidate] = useState<Candidate | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    getCandidateById(id).then(data => {
      setCandidate(data);
      setLoading(false);
    });
  }, [id]);

  return { candidate, loading };
}

export function useCandidatesByIds(ids: string[]) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setCandidates([]); setLoading(false); return; }
    getCandidatesByIds(ids).then(data => {
      setCandidates(data);
      setLoading(false);
    });
  }, [ids.join(',')]);

  return { candidates, loading };
}
