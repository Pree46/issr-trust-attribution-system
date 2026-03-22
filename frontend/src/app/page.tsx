'use client';

import { useState } from 'react';
import { SessionData, ConditionStats } from '@/types';
import { startSession as apiStartSession, endSession, fetchStats } from '@/lib/api';

import ConsentView from '@/components/ConsentView';
import WelcomeView from '@/components/WelcomeView';
import TaskCard from '@/components/TaskCard';
import TrustScaleView from '@/components/TrustScaleView';
import StatsView from '@/components/StatsView';

type Screen = 'consent' | 'welcome' | 'tasks' | 'trust_scale' | 'stats';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('consent');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, ConditionStats> | null>(null);

  const handleStartSession = async () => {
    setLoading(true);
    try {
      const data = await apiStartSession();
      setSessionData(data);
      setCurrentBlock(0);
      setCurrentTaskIndex(0);
      setScreen('tasks');
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = () => {
    if (!sessionData) return;
    const block = sessionData.blocks[currentBlock];

    if (currentTaskIndex < block.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      setScreen('trust_scale');
    }
  };

  const handleTrustSubmit = async (answers: Record<string, number>) => {
    if (!sessionData) return;
    const block = sessionData.blocks[currentBlock];

    try {
      await endSession({
        participant_id: sessionData.participant_id,
        session_id: sessionData.session_id,
        condition: block.condition,
        trust_q1: answers['trust_q1'] ?? 4,
        trust_q2: answers['trust_q2'] ?? 4,
        trust_q3: answers['trust_q3'] ?? 4,
      });
    } catch (e) {
      console.error('Error ending block:', e);
    }

    if (currentBlock < sessionData.blocks.length - 1) {
      setCurrentBlock(currentBlock + 1);
      setCurrentTaskIndex(0);
      setScreen('tasks');
    } else {
      try {
        const statsData = await fetchStats();
        setStats(statsData);
      } catch (e) {
        console.error('Error fetching stats:', e);
      }
      setScreen('stats');
    }
  };

  switch (screen) {
    case 'consent':
      return <ConsentView onAccept={() => setScreen('welcome')} />;

    case 'welcome':
      return <WelcomeView onStart={handleStartSession} loading={loading} />;

    case 'tasks': {
      if (!sessionData) return null;
      const block = sessionData.blocks[currentBlock];
      const task = block.tasks[currentTaskIndex];
      return (
        <TaskCard
          key={`${block.condition}-${task.task_id}`}
          task={task}
          condition={block.condition}
          conditionConfig={block.condition_config}
          participantId={sessionData.participant_id}
          sessionId={sessionData.session_id}
          taskIndex={currentTaskIndex}
          totalTasks={block.tasks.length}
          onComplete={handleTaskComplete}
        />
      );
    }

    case 'trust_scale': {
      if (!sessionData) return null;
      const block = sessionData.blocks[currentBlock];
      return (
        <TrustScaleView
          questions={sessionData.trust_scale}
          agentName={block.condition_config.agent_name}
          onSubmit={handleTrustSubmit}
        />
      );
    }

    case 'stats':
      if (stats) return <StatsView stats={stats} />;
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">No statistics available yet.</p>
        </div>
      );
  }
}
