import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import FloatingChat from './components/FloatingChat'
import MobileNav from './components/MobileNav'
import ScrollToTop from './components/ScrollToTop'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import QuranPage from './pages/QuranPage'
import GroupsPage from './pages/GroupsPage'
import EventsPage from './pages/EventsPage'
import SettingsPage from './pages/SettingsPage'
import PrayerTimesPage from './pages/PrayerTimesPage'
import SadaqahPage from './pages/SadaqahPage'
import UmmahWorldPage from './pages/UmmahWorldPage'
import DuaPage from './pages/DuaPage'

function PrivateRoute({ children }) {
  const { currentUser, authLoading } = useApp();
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <p className="text-[48px] mb-3">🕌</p>
        <p className="text-green-700 font-bold text-[18px]">UmmahBook</p>
        <p className="text-gray-500 text-[13px] mt-1">লোড হচ্ছে...</p>
      </div>
    </div>
  );
  return currentUser ? children : <Navigate to="/login" replace />;
}

function Layout({ children, wide = false }) {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--bg, #f0f4f0)' }}>
      <Navbar />
      <div className="pt-[56px] flex min-h-screen">
        <LeftSidebar />
        <main
          className={`flex-1 flex justify-center pt-3 lg:ml-[280px] lg:mb-0 ${wide ? '' : 'xl:mr-[280px]'}`}
          style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}>
          <div className={`w-full px-2 sm:px-3 ${wide ? 'max-w-[920px]' : 'max-w-[600px]'}`}>
            {children}
          </div>
        </main>
        {!wide && <RightSidebar />}
      </div>
      <FloatingChat />
      <ScrollToTop />
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
        <Route path="/profile/:userId" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
        <Route path="/quran" element={<PrivateRoute><Layout><QuranPage /></Layout></PrivateRoute>} />
        <Route path="/groups" element={<PrivateRoute><Layout><GroupsPage /></Layout></PrivateRoute>} />
        <Route path="/events"    element={<PrivateRoute><Layout><EventsPage    /></Layout></PrivateRoute>} />
        <Route path="/settings"      element={<PrivateRoute><Layout wide><SettingsPage    /></Layout></PrivateRoute>} />
        <Route path="/prayer-times"  element={<PrivateRoute><Layout><PrayerTimesPage /></Layout></PrivateRoute>} />
        <Route path="/sadaqah"       element={<PrivateRoute><Layout><SadaqahPage     /></Layout></PrivateRoute>} />
        <Route path="/ummah-world"   element={<PrivateRoute><Layout><UmmahWorldPage  /></Layout></PrivateRoute>} />
        <Route path="/dua"           element={<PrivateRoute><Layout><DuaPage          /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
