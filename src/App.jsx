import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import RelayPage from './pages/RelayPage';
import MeowStarsPage from './pages/MeowStarsPage';
import PostDetailPage from './pages/PostDetailPage';
import PricingPage from './pages/PricingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ProfilePage from './pages/ProfilePage';
import ReferralsPage from './pages/ReferralsPage';
import PrivacySettingsPage from './pages/PrivacySettingsPage';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import AcceptableUsePolicy from './pages/legal/AcceptableUsePolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import DMCAPolicy from './pages/legal/DMCAPolicy';
import LegalNotice from './pages/legal/LegalNotice';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ConsentBanner from './components/legal/ConsentBanner';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-4xl animate-bounce">🐱</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-4xl animate-bounce">🐱</div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

// Layout wrapper for pages that need Navbar + Footer
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const GoogleProviderWrapper = ({ children }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return children;
  }
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};

function App() {
  return (
    <GoogleProviderWrapper>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ConsentBanner />
          <Routes>
          {/* Home Page - Public */}
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />

          {/* Content Detail Page - Public */}
          <Route path="/post/:postId" element={
            <Layout>
              <PostDetailPage />
            </Layout>
          } />

          {/* About Page - Public */}
          <Route path="/about" element={
            <Layout>
              <AboutPage />
            </Layout>
          } />

          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          {/* Register Page - Public */}
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />

          {/* Dashboard Page - Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Ranking Page - Public */}
          <Route path="/stars" element={
            <Layout>
              <MeowStarsPage />
            </Layout>
          } />

          {/* Studio Page - Public */}
          <Route path="/studio" element={
            <Layout>
              <RelayPage />
            </Layout>
          } />

          {/* Referrals Page - Protected */}
          <Route path="/referrals" element={
            <ProtectedRoute>
              <ReferralsPage />
            </ProtectedRoute>
          } />

          {/* Pricing Page - Protected */}
          <Route path="/credits" element={
            <ProtectedRoute>
              <Layout>
                <PricingPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Profile Page - Protected */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Privacy Settings - Protected */}
          <Route path="/settings/privacy" element={
            <ProtectedRoute>
              <Layout>
                <PrivacySettingsPage />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Payment Success - Protected */}
          <Route path="/payment/success" element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          } />

          {/* Legal Pages - Public */}
          <Route path="/legal/privacy" element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          } />

          <Route path="/legal/terms" element={
            <Layout>
              <TermsOfService />
            </Layout>
          } />

          <Route path="/legal/cookies" element={
            <Layout>
              <CookiePolicy />
            </Layout>
          } />

          <Route path="/legal/aup" element={
            <Layout>
              <AcceptableUsePolicy />
            </Layout>
          } />

          <Route path="/legal/refund" element={
            <Layout>
              <RefundPolicy />
            </Layout>
          } />

          <Route path="/legal/dmca" element={
            <Layout>
              <DMCAPolicy />
            </Layout>
          } />

          <Route path="/legal/notice" element={
            <Layout>
              <LegalNotice />
            </Layout>
          } />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </GoogleProviderWrapper>
  );
}

export default App;
