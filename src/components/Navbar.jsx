import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBell, FaHome, FaUsers, FaBookOpen, FaMosque, FaStar, FaUserFriends, FaTimes } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';
import FriendRequestsPanel from './FriendRequestsPanel';
import SearchPanel from './SearchPanel';

const navLinks = [
  { icon: FaHome,     en: 'Home',    bn: 'হোম',      path: '/' },
  { icon: FaUsers,    en: 'Groups',  bn: 'গ্রুপ',    path: '/groups' },
  { icon: FaBookOpen, en: 'Quran',   bn: 'কুরআন',   path: '/quran' },
  { icon: FaMosque,   en: 'Profile', bn: 'প্রোফাইল', path: '/profile' },
  { icon: FaStar,     en: 'Events',  bn: 'ইভেন্ট',   path: '/events' },
];

export default function Navbar() {
  const { currentUser, unreadCount, pendingRequestsCount, lang } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotif,     setShowNotif]     = useState(false);
  const [showFriendReq, setShowFriendReq] = useState(false);
  const [showProfile,   setShowProfile]   = useState(false);
  const [search,        setSearch]        = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const searchRef    = useRef(null);
  const notifRef     = useRef(null);
  const friendReqRef = useRef(null);
  const profileRef   = useRef(null);

  const showSearch = search.trim().length > 0;

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current    && !searchRef.current.contains(e.target))    setSearch('');
      if (notifRef.current     && !notifRef.current.contains(e.target))     setShowNotif(false);
      if (friendReqRef.current && !friendReqRef.current.contains(e.target)) setShowFriendReq(false);
      if (profileRef.current   && !profileRef.current.contains(e.target))   setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const closeAll = () => {
    setShowNotif(false); setShowFriendReq(false); setShowProfile(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center shadow-md"
      style={{ background: 'linear-gradient(135deg, #1a5c2a 0%, #2d7a3a 100%)' }}>
      <div className="flex items-center justify-between w-full px-3 gap-2">

        {/* Left — Logo + Search */}
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[26px]">☪️</span>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-[18px] leading-none tracking-wide">UmmahBook</span>
              <p className="text-green-200 text-[10px] leading-none arabic">بِسْمِ اللَّهِ</p>
            </div>
          </button>

          {/* Desktop search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center bg-[#ffffff20] hover:bg-[#ffffff2e] focus-within:bg-white/25 rounded-full px-3 py-1.5 gap-2 w-[220px] transition-colors">
              <FaSearch className="text-green-100 text-sm flex-shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={closeAll}
                type="text"
                placeholder="Search people / মানুষ খুঁজুন..."
                className="bg-transparent outline-none text-sm w-full placeholder-green-200 text-white" />
              {search && (
                <button onClick={() => setSearch('')} className="flex-shrink-0">
                  <FaTimes className="text-green-200 text-xs hover:text-white" />
                </button>
              )}
            </div>
            {showSearch && (
              <SearchPanel query={search} onClose={() => setSearch('')} />
            )}
          </div>
        </div>

        {/* Center — Nav links (desktop) */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          {navLinks.map(({ icon: Icon, en, bn, path }) => {
            const active = location.pathname === path;
            return (
              <button key={en} onClick={() => navigate(path)} title={`${en} / ${bn}`}
                className={`relative flex flex-col items-center justify-center h-[48px] w-[80px] rounded-lg transition-all text-green-100 hover:bg-white/10 ${
                  active ? 'bg-white/15 border-b-[3px] border-white text-white' : ''
                }`}>
                <Icon className="text-[17px]" />
                <span className="text-[9px] mt-0.5 font-bold">{lang === 'en' ? en : bn}</span>
              </button>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Mobile search button */}
          <button
            onClick={() => setShowMobileSearch(s => !s)}
            className="md:hidden w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
            <FaSearch className="text-white text-[14px]" />
          </button>

          {/* Friend Requests */}
          <div className="relative" ref={friendReqRef}>
            <button
              onClick={() => { setShowFriendReq(!showFriendReq); setShowNotif(false); setShowProfile(false); }}
              title="Friend Requests · বন্ধু অনুরোধ"
              className="relative w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
              <FaUserFriends className="text-white text-[15px]" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center border-2 border-green-700">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
            {showFriendReq && <FriendRequestsPanel onClose={() => setShowFriendReq(false)} />}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setShowNotif(!showNotif); setShowFriendReq(false); setShowProfile(false); }}
              className="relative w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
              <FaBell className="text-white text-[15px]" />
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
              <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); setShowFriendReq(false); }}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-full pl-1 pr-2 py-1 cursor-pointer transition-colors">
                <img src={currentUser.avatar} alt="profile" className="w-7 h-7 rounded-full object-cover border-2 border-green-400" />
                <span className="text-white text-[12px] font-medium hidden lg:block">{currentUser.name.split(' ')[0]}</span>
              </button>
              {showProfile && <ProfileDropdown onClose={() => setShowProfile(false)} />}
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar — slides down */}
      {showMobileSearch && (
        <div className="md:hidden absolute top-[56px] left-0 right-0 bg-green-800 px-3 py-2 shadow-lg z-40">
          <div className="relative" ref={searchRef}>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-white/20 rounded-full px-3 py-2 gap-2">
                <FaSearch className="text-green-200 text-sm flex-shrink-0" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  placeholder="মানুষ খুঁজুন..."
                  className="bg-transparent outline-none text-sm w-full placeholder-green-300 text-white" />
                {search && (
                  <button onClick={() => setSearch('')}>
                    <FaTimes className="text-green-200 text-xs" />
                  </button>
                )}
              </div>
              <button
                onClick={() => { setSearch(''); setShowMobileSearch(false); }}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FaTimes className="text-white text-sm" />
              </button>
            </div>
            {showSearch && (
              <SearchPanel query={search} onClose={() => { setSearch(''); setShowMobileSearch(false); }} />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
