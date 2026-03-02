import { useState, useEffect } from 'react';
import type { Position } from '../types/position';
import { getPositions, getPositionById, getPositionsByIds } from '../services/positionService';

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPositions().then(data => {
      setPositions(data);
      setLoading(false);
    });
  }, []);

  return { positions, loading };
}

export function usePosition(id: string | undefined) {
  const [position, setPosition] = useState<Position | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    getPositionById(id).then(data => {
      setPosition(data);
      setLoading(false);
    });
  }, [id]);

  return { position, loading };
}

export function usePositionsByIds(ids: string[]) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setPositions([]); setLoading(false); return; }
    getPositionsByIds(ids).then(data => {
      setPositions(data);
      setLoading(false);
    });
  }, [ids.join(',')]);

  return { positions, loading };
}
