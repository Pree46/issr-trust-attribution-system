'use client';

import { useEffect, useRef, useState } from 'react';
import { Task, SessionData } from '@/types';
import { logEvent } from '@/lib/api';

interface TaskCardProps {
  task: Task;
  session: SessionData;
  taskIndex: number;
  totalTasks: number;
  onComplete: (decision: 'accept' | 'override', latency_ms: number) => void;
}

export default function TaskCard({
  task,
  session,
  taskIndex,
  totalTasks,
  onComplete,
}: TaskCardProps) {
  const stimulusTime = useRef<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const config = session.condition_config;

  // Record when the stimulus (recommendation) becomes visible
  useEffect(() => {
    stimulusTime.current = performance.now();
  }, [task.task_id]);

  const isHumanlike = session.condition === 'B';
  const accentColor = isHumanlike ? 'var(--accent-purple)' : 'var(--accent-blue)';

  async function handleDecision(decision: 'accept' | 'override') {
    const latency_ms = Math.round(
      performance.now() - (stimulusTime.current ?? performance.now())
    );

    setSubmitting(true);
    try {
      await logEvent({
        participant_id: session.participant_id,
        session_id: session.session_id,
        condition: session.condition,
        task_id: task.task_id,
        decision,
        latency_ms,
        confidence_rating: null,
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-fade-in" key={task.task_id}>
        {/* Header + Progress */}
        <div className="card mb-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{isHumanlike ? '🧑' : '🤖'}</span>
              <h2 className="font-bold text-gray-900">{config.agent_name}</h2>
            </div>
            <span className="text-sm font-medium text-gray-400">
              Task {taskIndex + 1} / {totalTasks}
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPct}%`, background: accentColor }}
            />
          </div>
        </div>

        {/* Task Content */}
        <div className="card mt-4">
          <p className="text-sm font-medium mb-4" style={{ color: accentColor }}>
            {config.greeting}
          </p>

          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
              Scenario
            </p>
            <p className="text-gray-700 leading-relaxed">{task.scenario}</p>
          </div>

          <div
            className="rounded-xl p-4 mb-4"
            style={{
              background: `${accentColor}08`,
              border: `1px solid ${accentColor}20`,
            }}
          >
            <p className="text-sm text-gray-500 mb-1">
              {config.recommendation_prefix}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {task.recommendation}
            </p>
          </div>

          <p className="text-sm text-gray-500">
            <span className="font-medium">AI Confidence:</span>{' '}
            <span className="font-semibold text-gray-700">
              {config.confidence_display}
            </span>
          </p>
        </div>

        {/* Decision Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleDecision('accept')}
            disabled={submitting}
            className="btn-accept"
          >
            {config.button_accept}
          </button>
          <button
            onClick={() => handleDecision('override')}
            disabled={submitting}
            className="btn-override"
          >
            {config.button_override}
          </button>
        </div>
      </div>
    </div>
  );
}
