import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.post(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage('Email verified successfully! You can continue creating.');
        // Refresh user data in case they are logged in
        refreshUser?.();
      } catch (err) {
        const reason = err?.response?.data?.error || 'Verification failed or token expired.';
        setStatus('error');
        setMessage(reason);
      }
    };
    verify();
  }, [token, refreshUser]);

  const statusStyles = {
    pending: 'text-yellow-300',
    success: 'text-green-300',
    error: 'text-red-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-slate-900/70 border border-purple-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="text-6xl mb-4">🐱</div>
        <h1 className="text-3xl font-bold text-white mb-2">Email Verification</h1>
        <p className={`${statusStyles[status]} mb-6`}>{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:from-pink-500 hover:to-purple-500 transition"
          >
            Back to Home
          </button>
          <Link
            to="/dashboard"
            className="w-full px-4 py-3 rounded-xl border border-purple-500/40 text-purple-100 hover:bg-purple-500/10 transition block"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
