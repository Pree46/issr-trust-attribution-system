'use client';

import { useState } from 'react';
import { TrustQuestion } from '@/types';

interface TrustScaleViewProps {
  questions: TrustQuestion[];
  agentName: string;
  onSubmit: (answers: Record<string, number>) => void;
}

const LABELS = ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Agree', 'Strongly Agree'];

export default function TrustScaleView({ questions, agentName, onSubmit }: TrustScaleViewProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const allAnswered = questions.every(q => answers[q.q_id] !== undefined);

  function handleSelect(qId: string, value: number) {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full animate-fade-in">
        <div className="text-center mb-6">
          <span className="text-3xl mb-2 block">📋</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Trust Assessment</h1>
          <p className="text-sm text-gray-500">
            Reflecting on your experience with <strong>{agentName}</strong>, rate each statement.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={q.q_id} className="card">
              <p className="font-medium text-gray-800 mb-3">
                {qi + 1}. {q.text}
              </p>
              <div className="flex items-center justify-between gap-1">
                {LABELS.map((label, i) => {
                  const value = i + 1;
                  const selected = answers[q.q_id] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => handleSelect(q.q_id, value)}
                      className="flex flex-col items-center gap-1 flex-1 cursor-pointer group"
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                          selected
                            ? 'bg-blue-600 border-blue-600 text-white scale-110'
                            : 'border-gray-300 text-gray-400 group-hover:border-blue-400 group-hover:text-blue-500'
                        }`}
                      >
                        {value}
                      </div>
                      <span className="text-[9px] text-gray-400 text-center leading-tight hidden sm:block">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => onSubmit(answers)} disabled={!allAnswered} className="btn-primary">
            {allAnswered ? 'Submit Responses' : `Answer all ${questions.length} questions to continue`}
          </button>
        </div>
      </div>
    </div>
  );
}
