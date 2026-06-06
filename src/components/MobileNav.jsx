import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBookOpen, FaMosque, FaStar } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const tabs = [
  { icon: FaHome, label: 'Home', path: '/' },
  { icon: FaUsers, label: 'Groups', path: '/groups' },
  { icon: FaBookOpen, label: 'Quran', path: '/quran' },
  { icon: FaMosque, label: 'Profile', path: '/profile' },
  { icon: FaStar, label: 'Events', path: '/events' },
];

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useApp();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-green-200 flex items-center justify-around py-2 shadow-lg">
      {tabs.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path;
        return (
          <button key={label} onClick={() => navigate(path)}
            className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${active ? 'text-green-700' : 'text-[#65676b]'}`}>
            <div className={`relative w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${active ? 'bg-green-100' : ''}`}>
              <Icon className="text-[20px]" />
            </div>
            <span className={`text-[10px] font-semibold ${active ? 'text-green-700' : 'text-[#65676b]'}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
