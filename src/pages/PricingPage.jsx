import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star } from 'lucide-react';
import { paymentService } from '../services/payment.service';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        const res = await paymentService.getPackages();
        const apiPacks = res?.data?.packages;
        setPackages(Array.isArray(apiPacks) ? apiPacks : []);
      } catch (err) {
        console.warn('Failed to fetch credit packs:', err?.message || err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    loadFromBackend();
  }, []);

  const handlePurchase = async (packageId) => {
    if (packages.length === 0) {
      alert('Credit packages are not available right now. Please try again later.');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setPurchasing(packageId);
    try {
      const response = await paymentService.createCheckout(packageId);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to create checkout:', error);
      alert('Failed to start checkout. Please try again.');
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 px-4 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Top up credits
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Pay-as-you-go credit packs. No subscriptions needed.
          </p>
        </div>

        {/* Credit Packages */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading packs..." />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            No credit packages are available right now. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const basePrice = packages[0]?.price || packages[0]?.priceFormatted?.replace('$','');
              let savingsText = '';
              if (pkg.id !== packages[0]?.id && basePrice && pkg.price) {
                const base = Number(basePrice);
                const thisPricePerCredit = pkg.price / (pkg.credits || 1);
                const basePricePerCredit = base / (packages[0]?.credits || 1);
                const pct = Math.max(0, Math.round((basePricePerCredit - thisPricePerCredit) / basePricePerCredit * 100));
                savingsText = pct > 0 ? `${pct}% cheaper than ${packages[0]?.name}` : '';
              }

              const isPopular = pkg.id === 2 || pkg.badge;

              return (
              <div key={pkg.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur opacity-40 group-hover:opacity-80 transition duration-300"></div>
                <div className="relative bg-slate-900/90 rounded-3xl p-8 border border-purple-500/30 flex flex-col h-full backdrop-blur-xl shadow-lg shadow-purple-900/40">
                  {isPopular && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Star size={14} className="inline" />
                        Popular
                      </span>
                    </div>
                  )}

                <div className="mb-4">
                  <h3 className="text-3xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-gray-400 mt-1 text-sm">
                    {pkg.blurb || 'Credit pack'}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="text-5xl font-black text-white">{(pkg.credits || 0).toLocaleString()}</div>
                  <div className="text-gray-400">credits</div>
                  <div className="mt-3 text-3xl font-bold text-pink-200">
                    {pkg.priceFormatted || pkg.price || ''}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-300 flex-grow">
                  {savingsText && (
                    <div className="flex items-start gap-2 text-base text-green-300 font-semibold">
                      <Check size={18} className="text-green-400 mt-0.5" />
                      <span>{savingsText}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 mt-0.5" />
                    <span>Use on any relay or first-panel creation</span>
                  </div>
                    <div className="flex items-start gap-2">
                      <Check size={18} className="text-green-400 mt-0.5" />
                      <span>Never expires</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check size={18} className="text-green-400 mt-0.5" />
                      <span>No subscription required</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchasing === pkg.id}
                    className={`mt-6 w-full py-3 rounded-xl font-bold transition-all text-md bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white hover:scale-105 disabled:opacity-60 shadow-lg`}
                  >
                    {purchasing === pkg.id ? 'Processing...' : 'Buy now'}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPage;
