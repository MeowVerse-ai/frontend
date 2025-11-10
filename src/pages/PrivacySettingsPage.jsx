import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Download, Trash2, Mail, Shield, AlertTriangle } from 'lucide-react';

const PrivacySettingsPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExportData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.get('/users/export-data', {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `meowverse-data-${user.username}-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess('Your data has been downloaded successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.delete('/users/delete-account');
      setSuccess('Your account has been deleted. Redirecting...');

      setTimeout(() => {
        logout();
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-purple-400" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Settings</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your data and privacy preferences</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 flex items-center gap-2">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
              {success}
            </div>
          )}

          {/* Your Rights Section */}
          <div className="mb-8 p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-3">Your Privacy Rights</h2>
            <p className="text-gray-300 text-sm mb-4">
              Under GDPR and CCPA, you have the right to:
            </p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Access and download your personal data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Delete your account and personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Opt-out of marketing communications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Request correction of inaccurate data</span>
              </li>
            </ul>
          </div>

          {/* Download Data Section */}
          <div className="mb-8 p-6 bg-slate-700/30 rounded-xl border border-gray-600/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Download className="text-blue-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Download Your Data</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Export all your personal data, including account information, generated content,
                  and activity history in JSON format.
                </p>
                <button
                  onClick={handleExportData}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Preparing Download...' : 'Download My Data'}
                </button>
              </div>
            </div>
          </div>

          {/* Marketing Preferences */}
          <div className="mb-8 p-6 bg-slate-700/30 rounded-xl border border-gray-600/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Mail className="text-purple-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Email Preferences</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Manage your email notification and marketing preferences.
                </p>
                <Link
                  to="/profile"
                  className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
                >
                  Manage Email Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Delete Account</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                  >
                    Delete My Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-300 text-sm font-medium mb-3">
                        ⚠️ Warning: This will permanently delete:
                      </p>
                      <ul className="text-red-400 text-sm space-y-1 mb-4">
                        <li>• Your account and profile</li>
                        <li>• All generated images and videos</li>
                        <li>• Your posts and comments</li>
                        <li>• Unused credits and subscription</li>
                        <li>• All associated data</li>
                      </ul>
                      <p className="text-red-300 text-sm font-medium">
                        Type <span className="font-bold">DELETE</span> to confirm:
                      </p>
                    </div>

                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE"
                      className="w-full px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={loading || deleteConfirmText !== 'DELETE'}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loading ? 'Deleting...' : 'Confirm Deletion'}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                          setError('');
                        }}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legal Documents */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-3">Learn more about how we handle your data:</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/legal/privacy" className="text-purple-400 hover:text-purple-300 underline">
                Privacy Policy
              </Link>
              <Link to="/legal/terms" className="text-purple-400 hover:text-purple-300 underline">
                Terms of Service
              </Link>
              <Link to="/legal/cookies" className="text-purple-400 hover:text-purple-300 underline">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsPage;
