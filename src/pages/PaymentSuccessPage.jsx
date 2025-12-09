import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/payment.service';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    const finalize = async () => {
      if (sessionId) {
        try {
          setStatusMsg('Finalizing your purchase...');
          await paymentService.finalizeSession(sessionId);
          await refreshUser();
          setStatusMsg('Credits updated!');
        } catch (err) {
          console.error('Finalize payment failed', err);
          setStatusMsg('Payment recorded. If credits do not appear, please contact support.');
          await refreshUser();
        }
      } else {
        // Fallback: just refresh
        refreshUser();
      }
    };

    finalize();

    // Countdown redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl blur-xl opacity-75"></div>
          <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl p-12 border border-green-500/30 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-400" size={48} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-4">
              Payment Successful!
            </h1>

            {/* Message */}
            <p className="text-gray-300 mb-8">
              Your credits have been added to your account.
            </p>
            {statusMsg && <p className="text-sm text-gray-400 mb-4">{statusMsg}</p>}

            {/* Redirect Info */}
            <p className="text-sm text-gray-400 mb-6">
              Redirecting to dashboard in {countdown} seconds...
            </p>

            {/* Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Go to Dashboard Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
