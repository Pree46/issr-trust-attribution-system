'use client';

interface ConsentViewProps {
  onAccept: () => void;
}

export default function ConsentView({ onAccept }: ConsentViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-lg w-full animate-fade-in">
        <div className="text-center mb-5">
          <span className="text-3xl mb-2 block">📝</span>
          <h1 className="text-xl font-bold text-gray-900">Informed Consent</h1>
        </div>

        <div className="text-sm text-gray-600 space-y-3 mb-6">
          <p>
            You are invited to participate in a research study examining how people
            interact with AI-assisted decision systems.
          </p>

          <div>
            <p className="font-semibold text-gray-800 mb-1">What to expect</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>You will review AI recommendations across several scenarios</li>
              <li>You will interact with <strong>two different AI agents</strong></li>
              <li>For each recommendation, you decide to accept or override it</li>
              <li>After each agent, you will answer a brief trust questionnaire</li>
              <li>Estimated time: 5–8 minutes</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-800 mb-1">Data collection</p>
            <p className="text-gray-500">
              We log your decisions, response times, and questionnaire responses.
              No personally identifiable information is collected. Participation is
              voluntary and you may stop at any time.
            </p>
          </div>
        </div>

        <button onClick={onAccept} className="btn-primary w-full">
          I agree to participate
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          By clicking above, you confirm you have read and understood this information.
        </p>
      </div>
    </div>
  );
}
