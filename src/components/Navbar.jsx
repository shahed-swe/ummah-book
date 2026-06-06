import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBell, FaHome, FaUsers, FaBookOpen, FaMosque, FaStar } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';

const navLinks = [
  { icon: FaHome, label: 'Home', path: '/' },
  { icon: FaUsers, label: 'Groups', path: '/groups' },
  { icon: FaBookOpen, label: 'Quran', path: '/quran' },
  { icon: FaMosque, label: 'Profile', path: '/profile' },
  { icon: FaStar, label: 'Events', path: '/events' },
];

export default function Navbar() {
  const { currentUser, unreadCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // search is cosmetic for now — future enhancement
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center shadow-md" style={{ background: 'linear-gradient(135deg, #1a5c2a 0%, #2d7a3a 100%)' }}>
      <div className="flex items-center justify-between w-full px-4">

        {/* Left — Logo + Search */}
        <div className="flex items-center gap-3 min-w-[180px]">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <span className="text-[28px]">☪️</span>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-[20px] leading-none tracking-wide">UmmahBook</span>
              <p className="text-green-200 text-[10px] leading-none arabic">بِسْمِ اللَّهِ</p>
            </div>
          </button>
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-[#ffffff20] hover:bg-[#ffffff30] rounded-full px-3 py-1.5 gap-2 ml-2 w-[180px] transition-colors">
            <FaSearch className="text-green-100 text-sm flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full placeholder-green-200 text-white" />
          </form>
        </div>

        {/* Center — Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ icon: Icon, label, path }) => {
            const active = location.pathname === path;
            return (
              <button key={label} onClick={() => navigate(path)} title={label}
                className={`relative flex flex-col items-center justify-center h-[48px] w-[80px] rounded-lg transition-all text-green-100 hover:bg-white/10 ${
                  active ? 'bg-white/15 border-b-[3px] border-yellow-400 text-yellow-300' : ''
                }`}>
                <Icon className="text-[20px]" />
                <span className="text-[10px] mt-0.5">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
              className="relative w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
              <FaBell className="text-white text-[16px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center border-2 border-green-700">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
          </div>

          {/* Profile */}
          {currentUser && (
            <div className="relative" ref={profileRef}>
              <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 rounded-full pl-1 pr-3 py-1 cursor-pointer transition-colors">
                <img src={currentUser.avatar} alt="profile" className="w-8 h-8 rounded-full object-cover border-2 border-green-400" />
                <span className="text-white text-[13px] font-medium hidden lg:block">{currentUser.name.split(' ')[0]}</span>
              </button>
              {showProfile && <ProfileDropdown onClose={() => setShowProfile(false)} />}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
