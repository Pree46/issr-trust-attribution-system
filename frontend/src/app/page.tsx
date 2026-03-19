'use client';

import { useState, useEffect, useRef } from 'react';

interface Condition {
  label: string;
  agent_name: string;
  tone: string;
  confidence_framing: string;
  greeting: string;
  recommendation_prefix: string;
  confidence_display: string;
  button_accept: string;
  button_override: string;
}

interface Task {
  task_id: string;
  scenario: string;
  recommendation: string;
  ai_accuracy_rate: number;
}

interface SessionData {
  participant_id: string;
  session_id: string;
  condition: string;
  condition_config: Condition;
  tasks: Task[];
}

interface ConditionStats {
  agent_name: string;
  total: number;
  accept_count: number;
  override_count: number;
  reliance_rate: number;
  mean_latency_ms: number;
}

const BACKEND_URL = 'http://localhost:8000';

/* ─── Stats Screen ─── */
function StatsView({ stats }: { stats: Record<string, ConditionStats> }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-fade-in">
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">🎉</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Experiment Complete!</h1>
          <p className="text-gray-500">Here&apos;s a summary of the responses so far.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {Object.entries(stats).map(([key, s]) => (
            <div key={key} className="card animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{key === 'A' ? '🤖' : '🧑'}</span>
                <h3 className="font-bold text-gray-900">{s.agent_name}</h3>
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  Condition {key}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="stat-card text-center">
                  <div className="text-2xl font-bold text-gray-900">{s.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="stat-card text-center">
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent-green)' }}>
                    {(s.reliance_rate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Reliance</div>
                </div>
                <div className="stat-card text-center">
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent-blue)' }}>
                    {s.accept_count}
                  </div>
                  <div className="text-xs text-gray-500">Accepted</div>
                </div>
                <div className="stat-card text-center">
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent-red)' }}>
                    {s.override_count}
                  </div>
                  <div className="text-xs text-gray-500">Overridden</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500 text-center">
                Avg. latency: <span className="font-semibold text-gray-700">{s.mean_latency_ms} ms</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={() => window.location.reload()} className="btn-primary">
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Welcome Screen ─── */
function WelcomeView({ onStart, loading }: { onStart: () => void; loading: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center animate-fade-in">
        <span className="text-5xl mb-4 block">🧠</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Trust Attribution Study</h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Welcome! You&apos;ll review AI recommendations across a few scenarios
          and decide whether to accept or override them.
        </p>
        <button onClick={onStart} disabled={loading} className="btn-primary w-full">
          {loading ? (
            <span className="animate-pulse-soft">Starting…</span>
          ) : (
            'Start Session'
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Task Card ─── */
function TaskCard({
  task,
  session,
  taskIndex,
  totalTasks,
  onComplete,
}: {
  task: Task;
  session: SessionData;
  taskIndex: number;
  totalTasks: number;
  onComplete: (decision: 'accept' | 'override', latency_ms: number) => void;
}) {
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
      await fetch(`${BACKEND_URL}/event/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: session.participant_id,
          session_id: session.session_id,
          condition: session.condition,
          task_id: task.task_id,
          decision,
          latency_ms,
          confidence_rating: null,
        }),
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
          <p
            className="text-sm font-medium mb-4"
            style={{ color: accentColor }}
          >
            {config.greeting}
          </p>

          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
              Scenario
            </p>
            <p className="text-gray-700 leading-relaxed">{task.scenario}</p>
          </div>

          <div className="rounded-xl p-4 mb-4" style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}20` }}>
            <p className="text-sm text-gray-500 mb-1">{config.recommendation_prefix}</p>
            <p className="text-lg font-semibold text-gray-900">{task.recommendation}</p>
          </div>

          <p className="text-sm text-gray-500">
            <span className="font-medium">AI Confidence:</span>{' '}
            <span className="font-semibold text-gray-700">{config.confidence_display}</span>
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

/* ─── Main Page ─── */
export default function Home() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, ConditionStats> | null>(null);
  const [showStats, setShowStats] = useState(false);

  const startSession = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setSessionData(data);
      setCurrentTaskIndex(0);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async () => {
    if (!sessionData) return;

    if (currentTaskIndex < sessionData.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      // All tasks done — end session and fetch stats
      try {
        await fetch(`${BACKEND_URL}/session/end`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participant_id: sessionData.participant_id,
            session_id: sessionData.session_id,
            condition: sessionData.condition,
            trust_q1: 3,
            trust_q2: 3,
            trust_q3: 3,
          }),
        });
      } catch (e) {
        console.error('Error ending session:', e);
      }

      try {
        const statsResponse = await fetch(`${BACKEND_URL}/stats`);
        const statsData = await statsResponse.json();
        setStats(statsData);
        setShowStats(true);
      } catch (e) {
        console.error('Error fetching stats:', e);
      }
    }
  };

  // Stats screen
  if (showStats && stats) {
    return <StatsView stats={stats} />;
  }

  // Welcome screen
  if (!sessionData) {
    return <WelcomeView onStart={startSession} loading={loading} />;
  }

  // Task screen
  const task = sessionData.tasks[currentTaskIndex];

  return (
    <TaskCard
      key={task.task_id}
      task={task}
      session={sessionData}
      taskIndex={currentTaskIndex}
      totalTasks={sessionData.tasks.length}
      onComplete={handleTaskComplete}
    />
  );
}
