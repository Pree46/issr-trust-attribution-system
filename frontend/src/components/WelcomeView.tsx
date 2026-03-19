'use client';

interface WelcomeViewProps {
  onStart: () => void;
  loading: boolean;
}

export default function WelcomeView({ onStart, loading }: WelcomeViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center animate-fade-in">
        <span className="text-5xl mb-4 block">🧠</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          AI Trust Attribution Study
        </h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Welcome! You&apos;ll review AI recommendations across a few scenarios
          and decide whether to accept or override them.
        </p>
        <button
          onClick={onStart}
          disabled={loading}
          className="btn-primary w-full"
        >
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
