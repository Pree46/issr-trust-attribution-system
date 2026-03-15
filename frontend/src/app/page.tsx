'use client';

import { useState, useEffect } from 'react';

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

export default function Home() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const BACKEND_URL = 'http://localhost:8000';

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
      setSessionStarted(true);
      setCurrentTaskIndex(0);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: 'accept' | 'override') => {
    if (!sessionData || !startTime) return;

    const latency = Date.now() - startTime;
    const task = sessionData.tasks[currentTaskIndex];

    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/event/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: sessionData.participant_id,
          session_id: sessionData.session_id,
          condition: sessionData.condition,
          task_id: task.task_id,
          decision,
          latency_ms: latency,
          confidence_rating: 5,
        }),
      });

      if (currentTaskIndex < sessionData.tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
        setStartTime(Date.now());
      } else {
        // All tasks done, fetch stats
        const statsResponse = await fetch(`${BACKEND_URL}/stats`);
        const statsData = await statsResponse.json();
        setStats(statsData);
        setShowStats(true);
      }
    } catch (error) {
      console.error('Error logging event:', error);
      alert('Failed to log event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStarted && !startTime) {
      setStartTime(Date.now());
    }
  }, [sessionStarted, startTime]);

  if (showStats && stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Experiment Complete!</h1>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Statistics</h2>
          <pre className="bg-white border border-gray-300 rounded p-4 mb-6 overflow-auto text-sm text-gray-700">
            {JSON.stringify(stats, null, 2)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">AI Trust Attribution Study</h1>
          <p className="text-gray-700 mb-6">Welcome! This study explores how people interact with AI systems.</p>
          <button
            onClick={startSession}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Starting...' : 'Start Session'}
          </button>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  const task = sessionData.tasks[currentTaskIndex];
  const config = sessionData.condition_config;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Session Info */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Session: {sessionData.session_id.substring(0, 8)}
          </h2>
          <p className="text-gray-700 mb-1">Condition: {config.label}</p>
          <p className="text-gray-700">
            Task {currentTaskIndex + 1} of {sessionData.tasks.length}
          </p>
        </div>

        {/* Task Card */}
        <div className="card bg-white rounded-lg border border-gray-300 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {config.agent_name}: {config.greeting}
          </h3>

          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Scenario:</strong> {task.scenario}
            </p>
          </div>

          <div className="bg-gray-100 rounded p-4 mb-4">
            <p className="text-gray-700 mb-2">
              <strong>{config.recommendation_prefix}</strong>
            </p>
            <p className="text-xl font-bold text-gray-900">
              {task.recommendation}
            </p>
          </div>

          <p className="text-gray-700">
            <strong>AI Confidence:</strong> {config.confidence_display}
          </p>
        </div>

        {/* Decision Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleDecision('accept')}
            disabled={loading}
            className="btn-accept"
          >
            {config.button_accept}
          </button>
          <button
            onClick={() => handleDecision('override')}
            disabled={loading}
            className="btn-override"
          >
            {config.button_override}
          </button>
        </div>
      </div>
    </div>
  );
}
