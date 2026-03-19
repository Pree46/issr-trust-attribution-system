'use client';

import { useState } from 'react';
import { SessionData, ConditionStats } from '@/types';
import { startSession as apiStartSession, endSession, fetchStats } from '@/lib/api';

import WelcomeView from '@/components/WelcomeView';
import TaskCard from '@/components/TaskCard';
import StatsView from '@/components/StatsView';

export default function Home() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, ConditionStats> | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleStartSession = async () => {
    setLoading(true);
    try {
      const data = await apiStartSession();
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
        await endSession({
          participant_id: sessionData.participant_id,
          session_id: sessionData.session_id,
          condition: sessionData.condition,
          trust_q1: 3,
          trust_q2: 3,
          trust_q3: 3,
        });
      } catch (e) {
        console.error('Error ending session:', e);
      }

      try {
        const statsData = await fetchStats();
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
    return <WelcomeView onStart={handleStartSession} loading={loading} />;
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
