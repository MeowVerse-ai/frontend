import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/auth.service';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Mail, Lock, User, Sparkles, Key, Gift } from 'lucide-react';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [loading, setLoading] = useState(false);
  const hasGoogleClient = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const { register, setUser } = useAuth();
  const navigate = useNavigate();

  // Auto-fill referral code from URL parameter
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setReferralCode(refParam);
    }
  }, [searchParams]);

  const GoogleButton = ({ disabled }) => {
    const googleRegister = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        if (!invitationCode.trim()) {
          setError('Please enter your beta access code first');
          return;
        }
        setError('');
        setLoading(true);
        try {
          const result = await authService.googleOAuth(
            tokenResponse.access_token,
            invitationCode,
            referralCode.trim() || undefined
          );
          localStorage.setItem('accessToken', result.data.accessToken);
          localStorage.setItem('refreshToken', result.data.refreshToken);
          setUser(result.data.user);
          navigate('/dashboard');
        } catch (err) {
          setError(err.response?.data?.error || 'Google registration failed');
        } finally {
          setLoading(false);
        }
      },
      onError: () => {
        setError('Google registration failed');
      },
    });

    return (
      <button
        type="button"
        onClick={googleRegister}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setUsernameError('');

    // Validation
    if (!invitationCode.trim()) {
      setError('Beta access code is required');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the Terms of Service and Privacy Policy to register');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, username, password, invitationCode, referralCode.trim() || undefined, {
        acceptedTerms,
        marketingConsent
      });
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.error || 'Registration failed';
      setError(message);

      // Field-level hints for 409 conflicts
      if (err?.response?.status === 409) {
        const msg = message.toLowerCase();
        if (msg.includes('email')) {
          setEmailError('This email is already registered');
        }
        if (msg.includes('username')) {
          setUsernameError('This username is taken');
        }
      }

      // If username is taken, show suggestions
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-5xl font-black gradient-text">MeowVerse</span>
          </Link>
          <p className="text-gray-400 mt-2">Join the Beta! Access code required ✨</p>
        </div>

        {/* Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-slate-900 rounded-3xl p-8 border border-purple-500/30">
            <h2 className="text-3xl font-bold text-white mb-6">Create Account</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Beta Access Code"
                placeholder="Enter your invitation code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                icon={Key}
                required
              />

              <Input
                type="text"
                label="Referral Code (Optional)"
                placeholder="Enter referral code to get 50 bonus credits"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                icon={Gift}
              />

              <Input
                type="email"
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />
              {emailError && <p className="text-sm text-red-400 -mt-2">{emailError}</p>}

              <Input
                type="text"
                label="Username"
                placeholder="coolcat123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={User}
                required
                minLength={3}
                maxLength={50}
              />
              {usernameError && <p className="text-sm text-red-400 -mt-2">{usernameError}</p>}

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
                minLength={8}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={Lock}
                required
              />

              {/* Legal Consent Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-slate-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900"
                    required
                  />
                  <span className="text-sm text-gray-300 group-hover:text-gray-200">
                    I agree to the{' '}
                    <Link
                      to="/legal/terms"
                      target="_blank"
                      className="text-purple-400 hover:text-purple-300 underline font-medium"
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      to="/legal/privacy"
                      target="_blank"
                      className="text-purple-400 hover:text-purple-300 underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                    {' '}<span className="text-red-400">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-slate-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300">
                    I want to receive updates and promotions via email
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                loading={loading}
                disabled={!acceptedTerms}
              >
                <Sparkles className="inline-block mr-2" size={20} />
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            {hasGoogleClient ? (
              <GoogleButton disabled={loading || !invitationCode.trim()} />
            ) : (
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white/70 rounded-full font-bold opacity-60 cursor-not-allowed"
                title="Google OAuth not configured"
              >
                Google unavailable
              </button>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
