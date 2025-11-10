import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Star, Crown, X } from 'lucide-react';
import { paymentService } from '../services/payment.service';
import { subscriptionService } from '../services/subscription.service';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching credit packages...');
      const response = await paymentService.getPackages();
      console.log('📦 API Response:', response);
      console.log('📦 Packages data:', response.data);
      console.log('📦 Packages array:', response.data.packages);

      if (response.data && response.data.packages) {
        setPackages(response.data.packages);
        console.log(`✅ Loaded ${response.data.packages.length} credit packages`);
      } else {
        console.warn('⚠️ No packages found in response');
        setPackages([]);
      }
    } catch (error) {
      console.error('❌ Failed to load packages:', error);
      console.error('Error details:', error.response || error.message);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPurchasing(packageId);
    try {
      const response = await paymentService.createCheckout(packageId);
      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to create checkout:', error);
      alert('Failed to start checkout. Please try again.');
      setPurchasing(null);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSubscribing(true);
    try {
      const response = await subscriptionService.subscribe('creator');
      if (response.data?.data?.client_secret) {
        // Redirect to Stripe payment page with client secret
        const clientSecret = response.data.data.client_secret;
        // For now, we'll show a success message - full Stripe integration would redirect to payment
        alert('Subscription created! Please complete payment setup.');
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to create subscription:', error);
      alert(error.response?.data?.error || 'Failed to create subscription. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  // No longer needed - icons come from backend via pkg.icon

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading pricing..." />
      </div>
    );
  }

  const userTier = user?.subscription_tier || 'free';
  const isCreator = userTier === 'creator';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Subscribe for daily credits or purchase credit packages
          </p>
        </div>

        {/* Subscription Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Subscription Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {/* Free Tier */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-400 rounded-3xl blur opacity-30"></div>
              <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-500/20 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2">Free Tier</h3>
                <div className="mb-4">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span>50 credits on registration</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span>All 9 AI models</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>0 daily credits</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Downloads have watermark</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>No private gallery</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>No generation history</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>No high-quality options</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>No commercial rights</span>
                  </div>
                </div>

                <button
                  disabled={!isCreator}
                  className="w-full py-3 rounded-xl font-bold transition-all text-md bg-gray-600 text-gray-300 cursor-not-allowed"
                >
                  {isCreator ? 'Downgrade to Free' : 'Current Plan'}
                </button>
              </div>
            </div>

            {/* Creator Tier */}
            <div className="relative group">
              {/* Recommended Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse whitespace-nowrap">
                  ⭐ RECOMMENDED
                </span>
              </div>

              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/50 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2">Creator Tier 👑</h3>
                <div className="mb-4">
                  <span className="text-4xl font-black text-white">$9.99</span>
                  <span className="text-gray-400">/month</span>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>20 daily credits</strong> (expires daily)</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span>All 9 AI models</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>No watermark</strong> downloads 👑</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Private gallery</strong> 👑</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Full generation history</strong> 👑</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>High-quality options</strong> 👑</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Commercial use rights</strong> 👑</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm text-gray-300">
                    <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Priority queue</strong> 👑</span>
                  </div>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={isCreator || subscribing}
                  className={`w-full py-3 rounded-xl font-bold transition-all text-md ${
                    isCreator
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white hover:scale-105'
                  } disabled:opacity-50 shadow-lg`}
                >
                  {subscribing ? 'Processing...' : isCreator ? 'Current Plan' : '🐾 Upgrade to Creator'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Credit Packages Section */}
        <div>
          <h2 className="text-3xl font-bold text-center text-white mb-4">Credit Packages</h2>
          <div className="text-center mb-16">
          </div>
        </div>

        {/* Loading State for Packages */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner size="md" text="Loading credit packages..." />
          </div>
        )}

        {/* Empty State */}
        {!loading && packages.length === 0 && (
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">No Credit Packages Available</h3>
              <p className="text-gray-400">
                Credit packages couldn't be loaded. Please refresh the page or contact support.
              </p>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        {!loading && packages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative group ${pkg.popular ? 'lg:scale-105' : ''}`}
            >
              {/* Savings Badge on top right */}
              {pkg.savingsPercent > 0 && (
                <div className="absolute -top-3 -right-3 z-20">
                  <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Save {pkg.savingsPercent}%
                  </div>
                </div>
              )}

              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse whitespace-nowrap">
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}

              {/* Card Glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                pkg.popular
                  ? 'from-yellow-600 to-orange-600'
                  : 'from-pink-600 to-purple-600'
              } rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>

              {/* Card Content */}
              <div className={`relative bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border ${
                pkg.popular
                  ? 'border-yellow-500/50'
                  : 'border-purple-500/20'
              } group-hover:border-purple-500/50 transition-all h-full flex flex-col`}>
                
                {/* Icon */}
                <div className="text-6xl mb-4 text-center">
                  {pkg.icon}
                </div>

                {/* Package Name */}
                <h3 className="text-2xl font-bold text-white mb-2 text-center">
                  {pkg.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 text-center mb-4">
                  {pkg.description}
                </p>

                {/* Price */}
                <div className="mb-4 text-center">
                  <span className="text-5xl font-black text-white">
                    ${pkg.price}
                  </span>
                </div>

                {/* Credits */}
                <div className="mb-6 text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {pkg.credits.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">credits</div>
                </div>

                {/* Savings Highlight or Start Creating - Inside card */}
                {pkg.savingsPercent > 0 ? (
                  <div className="mb-6 text-center">
                    <div className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm border border-green-500/30">
                      💰 Save {pkg.savingsPercent}% vs Kitten
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 text-center">
                    <div className="inline-block px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg font-semibold text-sm border border-purple-500/30">
                      ✨ Start Creating
                    </div>
                  </div>
                )}

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={purchasing === pkg.id}
                  className={`w-full py-3 rounded-xl font-bold transition-all text-md ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg`}
                >
                  {purchasing === pkg.id ? 'Processing...' : '🐾 Meow Now!'}
                </button>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* Refund Disclaimer */}
        <div className="text-center mt-12 mb-8">
          <p className="text-xs text-gray-600">
            * Credits are non-refundable
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;