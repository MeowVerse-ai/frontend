import { useState, useEffect } from 'react';
import { Gift, Copy, Check, Share2, Users, TrendingUp, Award } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { creditsService } from '../services/credits.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ShareReferralModal from '../components/modals/ShareReferralModal';

const ReferralsPage = () => {
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    loadReferralStats();
  }, []);

  const loadReferralStats = async () => {
    try {
      const response = await creditsService.getReferralStats();
      setReferralStats(response.data);
    } catch (error) {
      console.error('Failed to load referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!referralStats?.referralCode) return;

    const referralLink = `${window.location.origin}/register?ref=${referralStats.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Loading referral stats..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <div className="pt-28 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 mb-6">
              <Gift className="text-white" size={40} />
            </div>
            <h1 className="text-5xl font-black gradient-text mb-4">
              Invite Friends & Earn Credits
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Share the magic of MeowVerse and both earn 50 bonus credits!
            </p>
          </div>

          {/* Main Referral Card */}
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/20 via-purple-600/50 to-blue-600/50 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-pink-600/20 to-purple-600/50 rounded-3xl p-6 md:p-8">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Unique Referral Code</h2>

                {/* Referral Code Display */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
                  <p className="text-white/80 text-sm mb-3 text-center">Share this code or link:</p>
                  <div className="relative bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
                    <p className="text-white font-mono font-bold text-2xl text-center tracking-wider">
                      {referralStats?.referralCode}
                    </p>
                    <button
                      onClick={handleCopyCode}
                      className="absolute top-2 right-2 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title={copied ? "Copied!" : "Copy link"}
                    >
                      {copied ? (
                        <Check size={20} className="text-white" />
                      ) : (
                        <Copy size={20} className="text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 text-center">
                    <TrendingUp className="mx-auto mb-2 text-white" size={24} />
                    <p className="text-white/80 text-sm mb-1">Credits Earned</p>
                    <p className="text-white text-3xl font-bold">{referralStats?.creditsEarned || 0}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 text-center">
                    <Users className="mx-auto mb-2 text-white" size={24} />
                    <p className="text-white/80 text-sm mb-1">Successful Referrals</p>
                    <p className="text-white text-3xl font-bold">{referralStats?.successfulReferrals || 0}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 text-center">
                    <Award className="mx-auto mb-2 text-white" size={24} />
                    <p className="text-white/80 text-sm mb-1">Pending Rewards</p>
                    <p className="text-white text-3xl font-bold">{referralStats?.pendingReferrals || 0}</p>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:scale-105"
                >
                  <Share2 size={24} />
                  <span className="text-lg">Share with Friends</span>
                </button>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                step: '1',
                title: 'Share Your Code',
                description: 'Send your referral code or link to friends.',
                icon: Share2,
                color: 'from-pink-500 to-rose-500'
              },
              {
                step: '2',
                title: 'Friend Signs Up',
                description: 'They register and get 50 bonus credits.',
                icon: Users,
                color: 'from-purple-500 to-violet-500'
              },
              {
                step: '3',
                title: 'Both Earn Credits',
                description: 'You earn 50 credits after their first creation.',
                icon: Award,
                color: 'from-blue-500 to-cyan-500'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-xl`}>
                      {item.step}
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color}`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Invite Friends?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Earn unlimited credits',
                  'Share amazing AI art with friends',
                  'Build a creative community',
                  'Get rewarded for sharing',
                  'Track referrals in real-time',
                  'Credits never expire'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                        <Check className="text-white" size={16} />
                      </div>
                    </div>
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareReferralModal
          referralCode={referralStats?.referralCode}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default ReferralsPage;
