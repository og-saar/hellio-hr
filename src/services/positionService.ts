import type { Position } from '../types/position';
import positionsData from '../data/positions.json';

const positions: Position[] = structuredClone(positionsData) as Position[];

export async function getPositions(): Promise<Position[]> {
  return positions;
}

export async function getPositionById(id: string): Promise<Position | undefined> {
  return positions.find(p => p.id === id);
}

export async function getPositionsByIds(ids: string[]): Promise<Position[]> {
  return positions.filter(p => ids.includes(p.id));
}

export async function addCandidateToPosition(positionId: string, candidateId: string): Promise<Position | undefined> {
  const position = positions.find(p => p.id === positionId);
  if (position && !position.candidateIds.includes(candidateId)) {
    position.candidateIds.push(candidateId);
  }
  return position;
}

export async function removeCandidateFromPosition(positionId: string, candidateId: string): Promise<Position | undefined> {
  const position = positions.find(p => p.id === positionId);
  if (position) {
    position.candidateIds = position.candidateIds.filter(id => id !== candidateId);
  }
  return position;
}
