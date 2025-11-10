import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import { uploadService } from '../services/upload.service';
import { subscriptionService } from '../services/subscription.service';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Mail, Edit3, Calendar, Coins, CheckCircle, Camera, Crown, X } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_BIO_LENGTH = 500;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setUploadingAvatar(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const result = await uploadService.uploadFile(file);
      setAvatarUrl(result.url);
      setSuccess('Avatar uploaded! Click Save Changes to update your profile.');
    } catch (err) {
      setError(err.message || 'Failed to upload avatar');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

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

      // Only include avatar_url if it changed
      if (avatarUrl !== user?.avatar_url) {
        updateData.avatar_url = avatarUrl;
      }

      const response = await userService.updateProfile(updateData);

      // Update user in context
      setUser(response.data);

      setSuccess('Profile updated successfully!');
      setAvatarPreview(null);

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
    setAvatarUrl(user?.avatar_url || '');
    setAvatarPreview(null);
    setError('');
    setSuccess('');
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    setError('');
    try {
      await subscriptionService.cancel();
      setSuccess('Subscription cancelled. You will keep access until the end of your billing period.');
      setShowCancelModal(false);
      // Refresh user data
      setTimeout(() => {
        refreshUser();
      }, 500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel subscription');
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  const hasChanges =
    username !== (user?.username || '') ||
    bio !== (user?.bio || '') ||
    avatarUrl !== (user?.avatar_url || '');

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

                  {user?.is_verified && (
                    <div>
                      <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Account Status
                      </label>
                      <p className="text-green-400">Verified</p>
                    </div>
                  )}

                  {/* Subscription Tier */}
                  <div>
                    <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4" />
                      Subscription Tier
                    </label>
                    <div className="flex items-center gap-2">
                      {user?.subscription_tier === 'creator' ? (
                        <>
                          <span className="text-white font-semibold">Creator Tier</span>
                          <Crown className="w-4 h-4 text-yellow-500" />
                        </>
                      ) : (
                        <span className="text-white">Free Tier</span>
                      )}
                    </div>
                  </div>

                  {/* Next Billing Date (if Creator) */}
                  {user?.subscription_tier === 'creator' && user?.subscription_expires_at && (
                    <div>
                      <label className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4" />
                        Next Billing Date
                      </label>
                      <p className="text-white">
                        {new Date(user.subscription_expires_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  )}
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
                  {/* Avatar Upload */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                          {avatarPreview || avatarUrl ? (
                            <img
                              src={avatarPreview || avatarUrl}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-white" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingAvatar}
                          className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition-colors disabled:opacity-50"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-1">
                          Upload a new avatar
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG or GIF. Max size 5MB.
                        </p>
                        {uploadingAvatar && (
                          <p className="text-sm text-purple-400 mt-1">Uploading...</p>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
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
                      disabled={!hasChanges || uploadingAvatar}
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
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-md w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 rounded-3xl blur-xl opacity-75"></div>
            <div className="relative bg-slate-900 rounded-3xl p-8 border border-red-500/30">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Cancel Subscription?</h2>
              <p className="text-gray-400 mb-4">
                Are you sure you want to cancel your Creator tier subscription?
              </p>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  <strong>Note:</strong> You'll keep your Creator benefits until{' '}
                  {user?.subscription_expires_at &&
                    new Date(user.subscription_expires_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleCancelSubscription}
                  variant="danger"
                  size="md"
                  className="flex-1"
                  loading={cancelling}
                  disabled={cancelling}
                >
                  Yes, Cancel Subscription
                </Button>
                <Button
                  onClick={() => setShowCancelModal(false)}
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  disabled={cancelling}
                >
                  Keep Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
