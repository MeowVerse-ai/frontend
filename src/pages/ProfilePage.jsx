import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Mail, Edit3, Calendar, Coins, CheckCircle, X } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const MAX_BIO_LENGTH = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (username.trim().length > 50) {
      setError('Username must be less than 50 characters');
      return;
    }

    if (bio.length > MAX_BIO_LENGTH) {
      setError(`Bio must be less than ${MAX_BIO_LENGTH} characters`);
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        username: username.trim(),
        bio: bio.trim(),
      };

      const response = await userService.updateProfile(updateData);

      // Update user in context
      setUser(response.data);

      setSuccess('Profile updated successfully!');

      // Refresh user data
      setTimeout(() => {
        refreshUser();
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(user?.username || '');
    setBio(user?.bio || '');
    setError('');
    setSuccess('');
  };

  const hasChanges =
    username !== (user?.username || '') ||
    bio !== (user?.bio || '');

  const avatarInitial =
    (username || user?.username || '?').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold gradient-text mb-2 pb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-xl opacity-75"></div>
              <div className="relative bg-slate-900 rounded-3xl p-6 border border-purple-500/30">
                <h2 className="text-xl font-bold text-white mb-4">Account Info</h2>

                {/* Read-only fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-white truncate" title={user?.email}>{user?.email}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <Coins className="w-4 h-4" />
                      Credits Balance
                    </label>
                    <p className="text-white font-semibold">{user?.credits || 0} credits</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </label>
                    <p className="text-white">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      }) : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      {user?.is_verified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      User Verified
                    </label>
                    <p className={user?.is_verified ? 'text-green-400' : 'text-red-400'}>
                      {user?.is_verified ? 'Yes' : 'No'}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-xl opacity-75"></div>
              <div className="relative bg-slate-900 rounded-3xl p-8 border border-purple-500/30">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Edit Profile
                </h2>

                {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar (read-only for MVP) */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center border border-white/10">
                        <span className="text-3xl font-bold text-white">{avatarInitial}</span>
                      </div>
                      <div className="flex-1 text-sm text-gray-400">
                        Avatars are locked for MVP.
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <Input
                    type="text"
                    label="Username"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    icon={User}
                    required
                    minLength={3}
                    maxLength={50}
                  />

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center justify-between">
                      <span>Bio</span>
                      <span className={`text-xs ${bio.length > MAX_BIO_LENGTH ? 'text-red-400' : 'text-gray-500'}`}>
                        {bio.length}/{MAX_BIO_LENGTH}
                      </span>
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={MAX_BIO_LENGTH}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="flex-1"
                      loading={loading}
                      disabled={!hasChanges}
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleCancel}
                      disabled={loading || !hasChanges}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
    </div>
  );
};

export default ProfilePage;
