'use client';

import { useEffect, useRef, useState } from 'react';
import { Task, Condition } from '@/types';
import { logEvent } from '@/lib/api';

interface TaskCardProps {
  task: Task;
  condition: string;
  conditionConfig: Condition;
  participantId: string;
  sessionId: string;
  taskIndex: number;
  totalTasks: number;
  task_domain: string;
  task_stakes: string;
  onComplete: (decision: 'accept' | 'override', latency_ms: number) => void;
}

function SystemAvatar() {
  return (
    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    </div>
  );
}

function HumanAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
      {initials}
    </div>
  );
}

export default function TaskCard({
  task, condition, conditionConfig, participantId, sessionId,
  taskIndex, totalTasks, onComplete,
}: TaskCardProps) {
  const stimulusTime = useRef<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confidence, setConfidence] = useState(5);

  const config = conditionConfig;
  const isNeutral = config.color_scheme === 'neutral';

  useEffect(() => {
    stimulusTime.current = performance.now();
  }, [task.task_id]);

  async function handleDecision(decision: 'accept' | 'override') {
    const latency_ms = Math.round(
      performance.now() - (stimulusTime.current ?? performance.now())
    );
    setSubmitting(true);
    try {
      await logEvent({
        participant_id: participantId,
        session_id: sessionId,
        condition,
        task_id: task.task_id,
        decision,
        latency_ms,
        confidence_rating: confidence,
        task_domain: task.domain,
        task_stakes: task.stakes,
        block_position: task.block_position,
      });
      onComplete(decision, latency_ms);
    } catch (error) {
      console.error('Error logging event:', error);
      alert('Failed to log event');
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct = ((taskIndex + 1) / totalTasks) * 100;
  const progressColor = isNeutral ? 'var(--cond-a-primary)' : 'var(--cond-b-primary)';

  if (isNeutral) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full animate-fade-in" key={task.task_id}>
          <div className="card" style={{ background: 'var(--cond-a-bg)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <SystemAvatar />
                <div>
                  <h2 className="font-bold text-gray-900">{config.agent_name}</h2>
                  <p className="text-xs text-gray-400">Decision support module v2.1</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-400">Task {taskIndex + 1} / {totalTasks}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%`, background: progressColor }} />
            </div>
          </div>

          <div className="card mt-4">
            <div className="border-l-3 border-gray-300 pl-4 mb-5">
              <p className="text-gray-700 leading-relaxed">{task.scenario}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 mb-4" style={{ background: 'var(--cond-a-light)' }}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">System Recommendation</p>
              <p className="text-gray-900 font-medium">{task.recommendation}</p>
            </div>
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full border border-gray-300 text-gray-600 bg-white mb-4">
              Confidence: {config.confidence_display}
            </span>
            <div className="mb-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">
                Your confidence in your decision: <span className="font-bold text-gray-700">{confidence}/10</span>
              </label>
              <input type="range" min="1" max="10" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="w-full accent-gray-500" />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => handleDecision('accept')} disabled={submitting} className="btn-accept-neutral">{config.button_accept}</button>
            <button onClick={() => handleDecision('override')} disabled={submitting} className="btn-override-neutral">{config.button_override}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-fade-in" key={task.task_id}>
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <HumanAvatar name={config.agent_name} />
              <div>
                <h2 className="font-bold text-gray-900">{config.agent_name}</h2>
                <p className="text-xs text-green-600">● Active now · AI assistant</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-400">Task {taskIndex + 1} / {totalTasks}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%`, background: progressColor }} />
          </div>
        </div>

        <div className="card mt-4">
          <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--cond-b-bg)', border: '1px solid var(--cond-b-border)' }}>
            <p className="text-gray-700">{config.greeting}</p>
          </div>
          <p className="text-sm text-gray-500 mb-2">{task.scenario}</p>
          <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--cond-b-bg)', border: '1px solid var(--cond-b-border)' }}>
            <p className="text-gray-700 italic mb-2">&ldquo;{config.recommendation_prefix} {task.recommendation}&rdquo;</p>
          </div>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--cond-b-primary)' }}>{config.confidence_display}</p>
          <div className="mb-2">
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Your confidence in your decision: <span className="font-bold text-gray-700">{confidence}/10</span>
            </label>
            <input type="range" min="1" max="10" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} className="w-full accent-blue-600" />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={() => handleDecision('accept')} disabled={submitting} className="btn-accept-warm">{config.button_accept}</button>
          <button onClick={() => handleDecision('override')} disabled={submitting} className="btn-override-warm">{config.button_override}</button>
        </div>
      </div>
    </div>
  );
}
