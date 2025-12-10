import { Link } from 'react-router-dom';
import { PawPrint, Sparkles, Clock3 } from 'lucide-react';

const MeowGuidePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-900 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-3 leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              MeowGuide
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            The quickest way to co-create: simple rules, fair turns, clear costs.
          </p>
        </div>

        <div className="grid gap-4 text-white">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-lg shadow-purple-500/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/60 to-purple-600/70 flex items-center justify-center">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Start or join</h3>
              <p className="text-gray-200/90 text-sm">
                Each user can create the first panel of a relay, and anyone can continue other users’ relays.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-lg shadow-purple-500/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/60 to-orange-600/70 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Costs</h3>
              <p className="text-gray-200/90 text-sm">
                Every generation costs 5 credits. Make sure you have enough balance before you click the wand.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-lg shadow-purple-500/10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/60 to-purple-600/70 flex items-center justify-center">
              <Clock3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Fair turns</h3>
              <p className="text-gray-200/90 text-sm">
                If you want to continue your own relay, you must wait 6 hours after your last panel. Others can join immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 border border-purple-500/20 rounded-2xl p-4">
          <div className="text-white font-semibold text-lg">Ready to create your next panel?</div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow hover:scale-105 transition-transform"
            >
              Go to MeowMents
            </Link>
            <Link
              to="/stars"
              className="px-4 py-2 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              View MeowStars
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeowGuidePage;
