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

function PrivateRoute({ children }) {
  const { currentUser } = useApp();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg, #f0f4f0)' }}>
      <Navbar />
      <div className="pt-[56px] flex min-h-screen">
        <LeftSidebar />
        <main className="flex-1 flex justify-center py-4 lg:ml-[280px] xl:mr-[280px] mb-16 lg:mb-0">
          <div className="w-full max-w-[590px] px-3">
            {children}
          </div>
        </main>
        <RightSidebar />
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
        <Route path="/events" element={<PrivateRoute><Layout><EventsPage /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
