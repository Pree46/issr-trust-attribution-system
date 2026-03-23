'use client';

interface ConsentViewProps {
  onAccept: () => void;
}

export default function ConsentView({ onAccept }: ConsentViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-xl w-full animate-fade-in">
        {/* Institutional header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="https://humanai.foundation/images/humanai.jpg"
              alt="HumanAI Foundation"
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
            />
            <img
              src="https://humanai.foundation/images/GSoC/GSoC-icon-192.png"
              alt="Google Summer of Code"
              style={{ width: 48, height: 48, objectFit: 'contain' }}
            />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Informed Consent</h1>
          <p className="text-xs text-gray-400 mt-1">
            HumanAI Foundation · University of Alabama ISSR · Google Summer of Code
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #d1d5db, transparent)', marginBottom: 20 }} />

        <div className="text-sm text-gray-600 space-y-4 mb-6">
          <p>
            You are invited to participate in a research study conducted by the{' '}
            <strong>HumanAI Foundation</strong> in collaboration with the{' '}
            <strong>University of Alabama Institute for Social Science Research (ISSR)</strong>,
            as part of a <strong>Google Summer of Code</strong> project.
          </p>
          <p>
            This experiment investigates how people interact with AI-assisted
            decision systems and how interface design influences trust and reliance behavior.
          </p>

          <div style={{
            background: '#f8f9fb',
            borderRadius: 10,
            padding: '14px 16px',
            border: '1px solid #e5e7eb'
          }}>
            <p className="font-semibold text-gray-800 mb-2" style={{ fontSize: 13 }}>
              📋 What to expect
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-500" style={{ fontSize: 13 }}>
              <li>You will review AI recommendations across <strong>6 decision scenarios</strong></li>
              <li>You will interact with <strong>two different AI agents</strong></li>
              <li>For each recommendation, you decide to accept or override it</li>
              <li>After each agent, you will answer a brief trust questionnaire</li>
              <li>Estimated time: <strong>5–8 minutes</strong></li>
            </ul>
          </div>

          <div style={{
            background: '#f8f9fb',
            borderRadius: 10,
            padding: '14px 16px',
            border: '1px solid #e5e7eb'
          }}>
            <p className="font-semibold text-gray-800 mb-2" style={{ fontSize: 13 }}>
              🔒 Data collection & privacy
            </p>
            <p className="text-gray-500" style={{ fontSize: 13 }}>
              We log your decisions, response times, and questionnaire responses.
              <strong> No personally identifiable information is collected.</strong>{' '}
              All data is stored locally and used solely for research purposes.
              Participation is voluntary and you may stop at any time.
            </p>
          </div>
        </div>

        <button onClick={onAccept} className="btn-primary w-full" style={{ fontSize: 15, padding: '14px 0' }}>
          I agree to participate
        </button>

        <p className="text-xs text-gray-400 text-center mt-3" style={{ lineHeight: 1.5 }}>
          By clicking above, you confirm you have read and understood this information
          and consent to participate in this study.
        </p>
      </div>
    </div>
  );
}
