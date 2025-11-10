import { useState, useEffect } from 'react';
import { Gift, Copy, Share2, Check } from 'lucide-react';
import { creditsService } from '../../services/credits.service';
import ShareReferralModal from '../modals/ShareReferralModal';

const InviteFriendsCard = () => {
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
      console.log('Referral stats response:', response);
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

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </div>
    );
  }

  if (!referralStats) {
    return null;
  }

  return (
    <>
      <div className="group relative">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>

        {/* Card content */}
        <div className="relative bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl p-6 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Gift className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Invite Friends & Earn Credits</h3>
                <p className="text-pink-100 text-sm">Give 50, Get 50 credits!</p>
              </div>
            </div>

            {/* Referral code */}
            <div className="mb-4">
              <label className="text-pink-100 text-xs font-medium mb-2 block">Your Referral Code</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30">
                  <p className="text-white font-mono font-bold text-lg tracking-wider">
                    {referralStats.referralCode}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-colors border border-white/30 flex items-center gap-2"
                  title="Copy referral link"
                >
                  {copied ? (
                    <>
                      <Check size={20} className="text-white" />
                      <span className="text-white font-medium text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} className="text-white" />
                      <span className="text-white font-medium text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className="text-pink-100 text-xs mb-1">Credits Earned</p>
                <p className="text-white text-2xl font-bold">{referralStats.creditsEarned || 0}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <p className="text-pink-100 text-xs mb-1">Successful Referrals</p>
                <p className="text-white text-2xl font-bold">{referralStats.successfulReferrals || 0}</p>
              </div>
            </div>

            {/* Share button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full bg-white hover:bg-gray-100 text-purple-600 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Share2 size={20} />
              <span>Share with Friends</span>
            </button>

            {/* How it works */}
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-white text-xs leading-relaxed">
                <strong>How it works:</strong> Share your code with friends. They get 50 credits on signup, and you get 50 credits when they create their first Meowment!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareReferralModal
          referralCode={referralStats.referralCode}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};

export default InviteFriendsCard;
