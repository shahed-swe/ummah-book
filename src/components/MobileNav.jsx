import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBookOpen, FaPray, FaUser } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, currentUser, darkMode, pendingRequestsCount, unreadCount } = useApp();

  const tabs = [
    { icon: FaHome,  en: 'Home',    bn: 'হোম',    path: '/' },
    { icon: FaUsers, en: 'Friends', bn: 'বন্ধু',  path: '/groups',       badge: pendingRequestsCount },
    { icon: FaBookOpen, en: 'Quran', bn: 'কুরআন', path: '/quran',        center: true },
    { icon: FaPray,  en: 'Prayer',  bn: 'নামাজ',  path: '/prayer-times', badge: 0 },
    { icon: FaUser,  en: 'Profile', bn: 'প্রোফাইল', path: '/profile',    avatar: true },
  ];

  const bg   = darkMode ? 'rgba(10,26,13,0.97)' : 'rgba(255,255,255,0.97)';
  const bdr  = darkMode ? '1px solid rgba(26,74,32,0.6)' : '1px solid rgba(34,197,94,0.2)';

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: bg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: bdr,
        boxShadow: '0 -2px 20px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>

      {tabs.map(({ icon: Icon, en, bn, path, badge, center, avatar }) => {
        const active = location.pathname === path;
        const label  = lang === 'en' ? en : bn;
        const iconSz = center ? 'text-[22px]' : 'text-[20px]';
        const iconColor = active
          ? '#16a34a'
          : darkMode ? '#4a7a50' : '#9ca3af';
        const labelColor = active
          ? (darkMode ? '#4ade80' : '#16a34a')
          : (darkMode ? '#4a7a50' : '#9ca3af');

        return (
          <button
            key={en}
            onClick={() => path && navigate(path)}
            className="relative flex flex-col items-center justify-center flex-1 transition-all active:scale-95"
            style={{
              WebkitTapHighlightColor: 'transparent',
              minHeight: '54px',
              paddingTop: '6px',
              paddingBottom: '6px',
            }}>

            {/* Active top indicator */}
            {active && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                style={{ width: center ? '36px' : '28px', height: '3px', background: '#16a34a' }}
              />
            )}

            {/* Icon wrapper */}
            <div
              className="relative flex items-center justify-center rounded-2xl transition-all"
              style={{
                width: center ? '48px' : '40px',
                height: center ? '36px' : '32px',
                background: active
                  ? (darkMode ? 'rgba(22,163,74,0.15)' : 'rgba(22,163,74,0.1)')
                  : 'transparent',
              }}>

              {avatar && currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="me"
                  className="rounded-full object-cover"
                  style={{
                    width: active ? '28px' : '26px',
                    height: active ? '28px' : '26px',
                    border: active ? '2.5px solid #16a34a' : '2px solid #9ca3af',
                  }}
                />
              ) : (
                <Icon style={{ fontSize: center ? '22px' : '20px', color: iconColor }} />
              )}

              {/* Badge */}
              {badge > 0 && (
                <span
                  className="absolute flex items-center justify-center font-bold"
                  style={{
                    top: '-4px', right: '-4px',
                    minWidth: '16px', height: '16px',
                    fontSize: '9px', lineHeight: 1,
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '99px',
                    padding: '0 3px',
                    border: `2px solid ${darkMode ? '#0a1a0d' : 'white'}`,
                  }}>
                  {badge > 9 ? '9+' : badge}
                </span>
              )}

              {/* Notification badge on Profile tab */}
              {avatar && unreadCount > 0 && !badge && (
                <span
                  className="absolute flex items-center justify-center font-bold"
                  style={{
                    top: '-4px', right: '-4px',
                    minWidth: '16px', height: '16px',
                    fontSize: '9px', lineHeight: 1,
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '99px',
                    padding: '0 3px',
                    border: `2px solid ${darkMode ? '#0a1a0d' : 'white'}`,
                  }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className="font-semibold leading-none mt-0.5"
              style={{ fontSize: '10px', color: labelColor }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
