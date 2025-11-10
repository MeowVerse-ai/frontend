import { useState } from 'react';
import { X, Copy, Check, Mail, Twitter, MessageCircle, Instagram } from 'lucide-react';

const ShareReferralModal = ({ referralCode, onClose }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const shareMessage = `Join me on MeowVerse and create amazing AI-generated cat content! Use my referral code ${referralCode} to get 50 bonus credits when you sign up! ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent(`Join me on MeowVerse! 🐱✨\n\nCreate amazing AI-generated cat content and get 50 bonus credits with code: ${referralCode}\n\n`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleShareInstagram = () => {
    // Instagram doesn't support direct URL sharing like Facebook
    // Copy the link and open Instagram so users can paste it in their story/post
    navigator.clipboard.writeText(referralLink);
    window.open('https://www.instagram.com/', '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Join me on MeowVerse!');
    const body = encodeURIComponent(shareMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
            <div className="flex-1 bg-slate-800/50 rounded-xl px-4 py-3 border border-purple-500/30">
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
              onClick={handleShareTwitter}
              className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-blue-400/50"
            >
              <Twitter size={24} className="text-blue-400" />
              <span className="text-white font-medium">Twitter</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-green-400/50"
            >
              <MessageCircle size={24} className="text-green-400" />
              <span className="text-white font-medium">WhatsApp</span>
            </button>

            <button
              onClick={handleShareInstagram}
              className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-pink-500/50"
            >
              <Instagram size={24} className="text-pink-500" />
              <span className="text-white font-medium">Instagram</span>
            </button>

            <button
              onClick={handleShareEmail}
              className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors border border-purple-500/30 hover:border-purple-400/50"
            >
              <Mail size={24} className="text-purple-400" />
              <span className="text-white font-medium">Email</span>
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
