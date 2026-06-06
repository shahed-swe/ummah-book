import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBookOpen, FaMosque, FaStar } from 'react-icons/fa';

const tabs = [
  { icon: FaHome,     label: 'হোম',    path: '/' },
  { icon: FaUsers,    label: 'গ্রুপ',   path: '/groups' },
  { icon: FaBookOpen, label: 'কুরআন',  path: '/quran' },
  { icon: FaMosque,   label: 'প্রোফাইল', path: '/profile' },
  { icon: FaStar,     label: 'ইভেন্ট', path: '/events' },
];

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-green-200 flex items-center justify-around py-2 shadow-lg">
      {tabs.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path;
        return (
          <button key={label} onClick={() => navigate(path)}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${active ? 'text-green-700' : 'text-gray-500'}`}>
            <div className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${active ? 'bg-green-100' : ''}`}>
              <Icon className="text-[20px]" />
            </div>
            <span className={`text-[10px] font-semibold ${active ? 'text-green-700' : 'text-gray-500'}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
