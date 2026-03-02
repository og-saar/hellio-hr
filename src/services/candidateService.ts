import type { Candidate } from '../types/candidate';
import candidatesData from '../data/candidates.json';

const candidates: Candidate[] = structuredClone(candidatesData) as Candidate[];

export async function getCandidates(): Promise<Candidate[]> {
  return candidates;
}

export async function getCandidateById(id: string): Promise<Candidate | undefined> {
  return candidates.find(c => c.id === id);
}

export async function searchCandidates(query: string): Promise<Candidate[]> {
  const q = query.toLowerCase();
  return candidates.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.professionalTitle.toLowerCase().includes(q) ||
    c.skills.some(s => s.toLowerCase().includes(q)) ||
    c.location?.toLowerCase().includes(q)
  );
}

export async function getCandidatesByIds(ids: string[]): Promise<Candidate[]> {
  return candidates.filter(c => ids.includes(c.id));
}

export async function addPositionToCandidate(candidateId: string, positionId: string): Promise<Candidate | undefined> {
  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate && !candidate.positionIds.includes(positionId)) {
    candidate.positionIds.push(positionId);
  }
  return candidate;
}

export async function removePositionFromCandidate(candidateId: string, positionId: string): Promise<Candidate | undefined> {
  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate) {
    candidate.positionIds = candidate.positionIds.filter(id => id !== positionId);
  }
  return candidate;
}
