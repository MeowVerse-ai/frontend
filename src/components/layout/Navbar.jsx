import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Zap, WandSparkles, PawPrint, User, LogOut, Image, Menu, X, Info, Settings, Gift, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleMeowMentsClick = () => {
    setMobileMenuOpen(false);
    if (window.location.pathname === '/') {
      const section = document.getElementById('meowments-section');
      section?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: 'meowments' } });
    }
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-purple-500/30 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="cursor-pointer hover:scale-105 transition-transform">
            <span className="text-3xl font-montserrat font-regular tracking-tight gradient-text">
              MeowVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleMeowMentsClick}
              className="px-4 py-1.5 rounded-full font-bold transition-all bg-gradient-to-r from-teal-500/80 to-violet-500/90 text-white shadow-lg hover:scale-105"
            >
              <PawPrint className="inline-block mr-2" size={18} />
              MeowMents
            </button>
            <Link
              to="/stars"
              className="px-4 py-1.5 rounded-full font-bold transition-all bg-gradient-to-r from-yellow-600/80 to-orange-600/90 text-white shadow-lg hover:scale-105"
            >
              <Sparkles className="inline-block mr-2" size={18} />
              MeowStars
            </Link>
            <Link
              to="/guide"
              className="px-4 py-1.5 rounded-full font-bold bg-gradient-to-r from-indigo-500/80 to-purple-500/90 text-white shadow-lg hover:scale-105 transition-all"
            >
              <BookOpen className="inline-block mr-2" size={18} />
              MeowGuide
            </Link>

            {/* User Dropdown or Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
                >
                  <User size={18} />
                  <span>{user.username}</span>
                  <span className="px-2 py-0.5 bg-purple-600 rounded-full text-xs">
                    {user.credits} ⚡
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-purple-500/30 overflow-hidden">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 hover:bg-slate-700 transition-colors flex items-center space-x-2"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User size={18} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/referrals"
                      className="block px-4 py-3 hover:bg-slate-700 transition-colors flex items-center space-x-2"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Gift size={18} />
                      <span>Referrals</span>
                    </Link>
                    <Link
                      to="/credits"
                      className="block px-4 py-3 hover:bg-slate-700 transition-colors flex items-center space-x-2"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Zap size={18} />
                      <span>Credits</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-slate-700 transition-colors flex items-center space-x-2"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings size={18} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center space-x-2 text-red-400"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full font-bold border border-purple-600 text-white hover:bg-purple-600 hover:text-white transition-all shadow-sm"
              >
                🐈 Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-purple-400 transition-colors"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-purple-500/20 pt-4">
            {user ? (
              <>
                {/* User Info */}
                <div className="px-4 py-3 bg-slate-800/50 rounded-lg mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User size={18} />
                      <span className="font-semibold">{user.username}</span>
                    </div>
                    <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-bold">
                      {user.credits} ⚡
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleMeowMentsClick}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-teal-500/20 to-violet-500/20 hover:from-teal-500/30 hover:to-violet-500/30 transition-colors flex items-center space-x-3"
                >
                  <PawPrint size={20} />
                  <span className="font-semibold">MeowMents</span>
                </button>
                <Link
                  to="/stars"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/30 hover:to-orange-600/30 transition-colors flex items-center space-x-3"
                >
                  <Sparkles size={20} />
                  <span className="font-semibold">MeowStars</span>
                </Link>
                <Link
                  to="/guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 transition-colors flex items-center space-x-3"
                >
                  <BookOpen size={20} />
                  <span className="font-semibold">MeowGuide</span>
                </Link>
                <div className="border-t border-purple-500/20 my-2"></div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center space-x-3"
                >
                  <User size={20} />
                  <span className="font-semibold">Dashboard</span>
                </Link>
                <Link
                  to="/referrals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center space-x-3"
                >
                  <Gift size={20} />
                  <span className="font-semibold">Referrals</span>
                </Link>
                <Link
                  to="/credits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center space-x-3"
                >
                  <Zap size={20} />
                  <span className="font-semibold">Credits</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center space-x-3"
                >
                  <Settings size={20} />
                  <span className="font-semibold">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center space-x-3 text-red-400"
                >
                  <LogOut size={20} />
                  <span className="font-semibold">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleMeowMentsClick}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-teal-500/20 to-violet-500/20 hover:from-teal-500/30 hover:to-violet-500/30 transition-colors flex items-center space-x-3"
                >
                  <PawPrint size={20} />
                  <span className="font-semibold">MeowMents</span>
                </button>
                <Link
                  to="/studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-pink-600/20 to-purple-600/20 hover:from-pink-600/30 hover:to-purple-600/30 transition-colors flex items-center space-x-3"
                >
                  <WandSparkles size={20} />
                  <span className="font-semibold">MeowStudio</span>
                </Link>
                <Link
                  to="/stars"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/30 hover:to-orange-600/30 transition-colors flex items-center space-x-3"
                >
                  <Sparkles size={20} />
                  <span className="font-semibold">MeowStars</span>
                </Link>
                <Link
                  to="/guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 mx-2 text-center rounded-full font-bold border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20"
                >
                  MeowGuide
                </Link>
                
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 mx-2 text-center rounded-full font-bold border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
