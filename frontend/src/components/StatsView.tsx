'use client';

import { ConditionStats } from '@/types';

interface StatsViewProps {
  stats: Record<string, ConditionStats>;
}

export default function StatsView({ stats }: StatsViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-fade-in">
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">🎉</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Experiment Complete!
          </h1>
          <p className="text-gray-500">
            Here&apos;s a summary of the responses so far.
          </p>
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
                  <div className="text-2xl font-bold text-gray-900">
                    {s.total}
                  </div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="stat-card text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: 'var(--accent-green)' }}
                  >
                    {(s.reliance_rate * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Reliance</div>
                </div>
                <div className="stat-card text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: 'var(--accent-blue)' }}
                  >
                    {s.accept_count}
                  </div>
                  <div className="text-xs text-gray-500">Accepted</div>
                </div>
                <div className="stat-card text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: 'var(--accent-red)' }}
                  >
                    {s.override_count}
                  </div>
                  <div className="text-xs text-gray-500">Overridden</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500 text-center">
                Avg. latency:{' '}
                <span className="font-semibold text-gray-700">
                  {s.mean_latency_ms} ms
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
}
