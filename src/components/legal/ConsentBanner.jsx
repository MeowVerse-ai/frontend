import { useState } from 'react';
import { Link } from 'react-router-dom';

const CONSENT_VERSION = '1.0';
const CONSENT_STORAGE_KEY = 'meowverse_legal_consent';

const ConsentBanner = () => {
  // Initialize state synchronously to prevent flash on mobile
  const [isVisible, setIsVisible] = useState(() => {
    try {
      const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!storedConsent) return true;

      const { version, accepted } = JSON.parse(storedConsent);
      return version !== CONSENT_VERSION || !accepted;
    } catch (error) {
      return true;
    }
  });

  const handleAccept = () => {
    const consent = {
      version: CONSENT_VERSION,
      accepted: true,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleReject = () => {
    const consent = {
      version: CONSENT_VERSION,
      accepted: false,
      essentialOnly: true,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-auto animate-slide-up"
      style={{
        padding: '0.5rem',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        position: 'fixed',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        bottom: 0
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Frosted glass container */}
        <div className="backdrop-blur-lg bg-white/80 dark:bg-slate-900/90 border border-purple-200/50 dark:border-purple-500/30 rounded-2xl shadow-2xl p-2 md:p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Text content */}
            <div className="flex-1 text-xs md:text-base text-center">
              <p className="text-gray-700 dark:text-gray-200">
                By using our website, you accept our{' '}
                <Link
                  to="/legal/terms"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline font-medium"
                >
                  Terms of Service
                </Link>
                ,{' '}
                <Link
                  to="/legal/privacy"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline font-medium"
                >
                  Privacy Policy
                </Link>
                , and{' '}
                <Link
                  to="/legal/cookies"
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline font-medium"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleReject}
                className="flex-1 md:flex-initial px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              >
                Reject All
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-initial px-2 py-1 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
