import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBookOpen, FaMosque, FaStar } from 'react-icons/fa';

const tabs = [
  { icon: FaHome,     en: 'Home',    bn: 'হোম',      path: '/' },
  { icon: FaUsers,    en: 'Groups',  bn: 'গ্রুপ',    path: '/groups' },
  { icon: FaBookOpen, en: 'Quran',   bn: 'কুরআন',   path: '/quran' },
  { icon: FaMosque,   en: 'Profile', bn: 'প্রোফাইল', path: '/profile' },
  { icon: FaStar,     en: 'Events',  bn: 'ইভেন্ট',   path: '/events' },
];

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-green-200 flex items-center justify-around py-1.5 shadow-lg">
      {tabs.map(({ icon: Icon, en, bn, path }) => {
        const active = location.pathname === path;
        return (
          <button key={en} onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors ${active ? 'text-green-700' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${active ? 'bg-green-100' : ''}`}>
              <Icon className="text-[18px]" />
            </div>
            <span className={`text-[9px] font-bold ${active ? 'text-green-700' : 'text-gray-500'}`}>{en}</span>
            <span className={`text-[8px] leading-none ${active ? 'text-green-500' : 'text-gray-400'}`}>{bn}</span>
          </button>
        );
      })}
    </nav>
  );
}
