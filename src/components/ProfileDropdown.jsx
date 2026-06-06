import { useNavigate } from 'react-router-dom';
import { FaCog, FaMoon, FaQuestionCircle, FaSignOutAlt, FaUserEdit, FaShieldAlt } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function ProfileDropdown({ onClose }) {
  const { currentUser, logout, darkMode, setDarkMode } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const goProfile = () => { navigate('/profile'); onClose(); };

  if (!currentUser) return null;

  return (
    <div className="absolute right-0 top-12 w-[320px] bg-white rounded-2xl shadow-2xl border border-green-100 z-50 overflow-hidden fade-in">
      {/* Profile card */}
      <div className="p-3">
        <button onClick={goProfile} className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 cursor-pointer transition-colors border border-green-100 w-full text-left">
          <img src={currentUser.avatar} alt="me" className="w-16 h-16 rounded-full object-cover border-2 border-green-400" />
          <div>
            <p className="font-bold text-[16px] text-[#1a1a1a]">{currentUser.name}</p>
            <p className="text-green-600 text-[13px]">{currentUser.title || 'Muslim · Bangladesh'}</p>
            <p className="text-[12px] text-green-500 mt-0.5 arabic">السَّلَامُ عَلَيْكُمْ</p>
          </div>
        </button>
        <button onClick={goProfile} className="w-full mt-2 py-2 rounded-xl border border-green-200 text-green-700 font-semibold text-[14px] hover:bg-green-50 transition-colors">
          প্রোফাইল দেখুন
        </button>
      </div>

      <hr className="border-green-100" />

      <div className="p-2">
        <button onClick={goProfile} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 transition-colors text-left">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <FaUserEdit className="text-green-700 text-[16px]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#1a1a1a]">প্রোফাইল সম্পাদনা</p>
            <p className="text-[11px] text-[#65676b]">আপনার প্রোফাইল আপডেট করুন</p>
          </div>
        </button>

        <button onClick={() => { setDarkMode(!darkMode); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 transition-colors text-left">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <FaMoon className="text-green-700 text-[16px]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#1a1a1a]">Dark Mode</p>
            <p className="text-[11px] text-[#65676b]">{darkMode ? '✅ চালু আছে' : '⬜ বন্ধ আছে'}</p>
          </div>
        </button>

        {[
          { Icon: FaCog, label: 'Settings & Privacy', sub: 'Account settings' },
          { Icon: FaShieldAlt, label: 'Help & Support', sub: 'Help center' },
          { Icon: FaQuestionCircle, label: 'Feedback দিন', sub: 'আমাদের উন্নত করুন' },
        ].map(({ Icon, label, sub }) => (
          <button key={label} onClick={onClose} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Icon className="text-green-700 text-[16px]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#1a1a1a]">{label}</p>
              <p className="text-[11px] text-[#65676b]">{sub}</p>
            </div>
          </button>
        ))}
      </div>

      <hr className="border-green-100" />

      <div className="p-2">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <FaSignOutAlt className="text-red-600 text-[16px]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-red-600">লগ আউট</p>
            <p className="text-[11px] text-[#65676b]">জাযাকাল্লাহু খায়রান</p>
          </div>
        </button>
      </div>

      <p className="text-center text-[11px] text-green-400 pb-3">UmmahBook · © 2025</p>
    </div>
  );
}
