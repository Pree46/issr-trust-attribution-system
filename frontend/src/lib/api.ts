import { SessionData, ConditionStats } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function startSession(): Promise<SessionData> {
  const res = await fetch(`${BACKEND_URL}/session/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to start session');
  return res.json();
}

export async function logEvent(payload: {
  participant_id: string;
  session_id: string;
  condition: string;
  task_id: string;
  decision: 'accept' | 'override';
  latency_ms: number;
  confidence_rating: number | null;
  task_domain?: string;
  task_stakes?: string;
  block_position?: number;
}): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/event/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to log event');
}

export async function endSession(payload: {
  participant_id: string;
  session_id: string;
  condition: string;
  trust_q1: number;
  trust_q2: number;
  trust_q3: number;
}): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/session/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to end session');
}

export async function fetchStats(): Promise<Record<string, ConditionStats>> {
  const res = await fetch(`${BACKEND_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
