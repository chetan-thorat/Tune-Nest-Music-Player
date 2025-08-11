import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { GlobalStyle } from './components/GlobalStyle';

// Layouts
import AppLayout from './components/AppLayout';
import GuestLayout from './components/GuestLayout';

// Auth & Premium
import LoginPage from './components/Auth/LoginPage';
import LoginSuccessPage from './components/Auth/LoginSuccessPage';
import SignUpPage from './components/Auth/SignUpPage';
import PremiumPage from './components/PremiumPage';

// Core Pages
import PlaylistViewWrapper from './pages/PlaylistViewWrapper';
import PlaylistView from './components/PlaylistView';
import BrowseAlbums from './components/BrowseAlbums';
import PlaylistDetailView from './components/PlaylistDetailView';

// Payment Flow
import DummyPaymentPage from './pages/DummyPaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

// Informational Pages
import AboutPage from './pages/AboutPage';
import JobPage from './pages/JobPage';
import RecordPage from './pages/RecordPage';
import ArtistPage from './pages/ArtistPage';
import DevelopersPage from './pages/DevelopersPage';
import AdvertisingPage from './pages/AdvertisingPage';
import VendorPage from './pages/VendorPage';
import InvestorPage from './pages/InvestorPage';
import SupportPage from './pages/SupportPage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import SafetyAndPrivacyPage from './pages/SafetyAndPrivacyPage';
import LegalPage from './pages/LegalPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingPage';

export default function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <Router>
        <Routes>
          {/* ✅ Default Landing → GuestLayout */}
          <Route path="/" element={<GuestLayout />} />
          <Route path="/guest" element={<GuestLayout />} /> {/* ✅ Optional separate guest route */}

          {/* ✅ Auth Flow */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login-success" element={<LoginSuccessPage />} />
          <Route path="/premium" element={<PremiumPage />} />

          {/* ✅ Payment Flow */}
          <Route path="/payment" element={<DummyPaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

          {/* ✅ Main App Pages (after login) */}
          <Route path="/home" element={<AppLayout />}>
            <Route path="track/:id" element={<PlaylistViewWrapper />} />
            <Route path="album/:id" element={<PlaylistView />} />
            <Route path="browse-album" element={<BrowseAlbums />} />
            <Route path="playlist/:id" element={<PlaylistView />} />
            <Route path="playlist-detail/:id" element={<PlaylistDetailView />} />
          </Route>

          {/* ✅ Informational Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/job" element={<JobPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/artist" element={<ArtistPage />} />
          <Route path="/developer" element={<DevelopersPage />} />
          <Route path="/advertising" element={<AdvertisingPage />} />
          <Route path="/investors" element={<InvestorPage />} />
          <Route path="/vendors" element={<VendorPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
          <Route path="/safety-privacy" element={<SafetyAndPrivacyPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* ✅ Legacy direct playlist routes can be redirected in the future */}

          {/* ✅ Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}