import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBookOpen, FaMosque, FaStar } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const tabs = [
  { icon: FaHome,     en: 'Home',    bn: 'হোম',       path: '/' },
  { icon: FaUsers,    en: 'Groups',  bn: 'গ্রুপ',     path: '/groups' },
  { icon: FaBookOpen, en: 'Quran',   bn: 'কুরআন',    path: '/quran' },
  { icon: FaMosque,   en: 'Profile', bn: 'প্রোফাইল',  path: '/profile' },
  { icon: FaStar,     en: 'Events',  bn: 'ইভেন্ট',    path: '/events' },
];

export default function MobileNav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { lang }  = useApp();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(34,197,94,0.15)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 6px)',
        paddingTop: '4px',
      }}>
      {tabs.map(({ icon: Icon, en, bn, path }) => {
        const active = location.pathname === path;
        const label  = lang === 'en' ? en : bn;

        return (
          <button
            key={en}
            onClick={() => navigate(path)}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all active:scale-90"
            style={{ WebkitTapHighlightColor: 'transparent' }}>

            {/* Active indicator bar */}
            {active && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full bg-green-600"
                style={{ top: 0 }}
              />
            )}

            {/* Icon container */}
            <div className={`relative w-10 h-9 flex items-center justify-center rounded-xl transition-all ${
              active ? 'bg-green-100' : ''
            }`}>
              <Icon
                className={`transition-all ${
                  active
                    ? 'text-green-700 text-[21px]'
                    : 'text-gray-400 text-[19px]'
                }`}
              />
            </div>

            {/* Label */}
            <span
              className={`text-[10px] font-bold leading-none transition-colors ${
                active ? 'text-green-700' : 'text-gray-400'
              }`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
