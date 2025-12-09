import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-slate-950 border-t border-purple-500/20 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🐾</div>
          <p className="text-gray-400 mb-2">© 2026 MeowVerse Ltd. All rights reserved.</p>
          <p className="text-gray-600 text-sm mb-3">Celebrate the magic of every meow</p>

          {/* Legal Links - Essential + EU Compliance */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
            <Link to="/legal/privacy" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/legal/terms" className="hover:text-purple-400 transition-colors">
              Terms of Use
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/legal/notice" className="hover:text-purple-400 transition-colors">
              Legal Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;