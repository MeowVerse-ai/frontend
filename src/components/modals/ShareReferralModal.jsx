import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

const ShareReferralModal = ({ referralCode, onClose }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const shareMessage = `Join me on MeowVerse and create amazing AI-generated cat content! Use my referral code ${referralCode} to get 50 bonus credits when you sign up! ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(referralLink);
    window.open('https://www.instagram.com/', '_blank');
  };

  const handleShareWeChat = () => {
    navigator.clipboard.writeText(shareMessage);
    alert('已复制分享文案，前往微信粘贴给好友。');
  };

  const handleShareXHS = () => {
    navigator.clipboard.writeText(shareMessage);
    alert('已复制分享文案，前往小红书粘贴发布。');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-500/30" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X size={24} className="text-gray-400" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Share with Friends
          </h2>
          <p className="text-gray-400">
            Invite your friends and both earn 50 credits!
          </p>
        </div>

        {/* Referral link */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-2 block">Your Referral Link</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-800/60 rounded-xl px-4 py-3 border border-purple-500/20">
              <p className="text-white text-sm truncate">{referralLink}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-500/50"
            >
              {copied ? (
                <>
                  <Check size={20} className="text-white" />
                  <span className="text-white font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={20} className="text-white" />
                  <span className="text-white font-medium">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-300 mb-3 block">Share via</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-green-400/50 text-white font-medium"
            >
              WhatsApp
            </button>

            <button
              onClick={handleShareInstagram}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-pink-500/50 text-white font-medium"
            >
              Instagram
            </button>

            <button
              onClick={handleShareWeChat}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-green-300/50 text-white font-medium"
            >
              微信
            </button>

            <button
              onClick={handleShareXHS}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-rose-400/50 text-white font-medium"
            >
              小红书
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-purple-500/20">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span className="text-xl">🎁</span>
            How it Works
          </h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">✓</span>
              <span>Friend signs up with your referral code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">✓</span>
              <span>They get <strong className="text-white">50 bonus credits</strong> immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">✓</span>
              <span>You get <strong className="text-white">50 credits</strong> when they create their first Meowment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-400 mt-0.5">✓</span>
              <span>Unlimited referrals - invite as many friends as you want!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShareReferralModal;
