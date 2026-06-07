import { useNavigate } from 'react-router-dom';
import { FaCog, FaMoon, FaQuestionCircle, FaSignOutAlt, FaUserEdit, FaShieldAlt } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function ProfileDropdown({ onClose }) {
  const { currentUser, logout, darkMode, setDarkMode } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); onClose(); navigate('/login'); };
  const goProfile    = () => { navigate('/profile'); onClose(); };

  if (!currentUser) return null;

  const Item = ({ Icon, label, sub, onClick, danger }) => (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${danger ? 'hover:bg-red-50 dark:hover:bg-[#2d1414]' : 'hover:bg-green-50 dark:hover:bg-[#142d18]'}`}>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-100 dark:bg-[#2d1414]' : 'bg-green-100 dark:bg-[#142d18]'}`}>
        <Icon className={`text-[16px] ${danger ? 'text-red-600' : 'text-green-700 dark:text-[#6abf69]'}`} />
      </div>
      <div>
        <p className={`text-[14px] font-semibold ${danger ? 'text-red-600' : 'text-gray-800 dark:text-[#e8f5e9]'}`}>{label}</p>
        <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">{sub}</p>
      </div>
    </button>
  );

  return (
    <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-[60px] sm:top-12 w-auto sm:w-[320px] max-h-[calc(100vh-70px)] overflow-y-auto bg-white dark:bg-[#0f2313] rounded-2xl shadow-2xl border border-green-100 dark:border-[#1a4a20] z-[100] fade-in">

      {/* Profile card */}
      <div className="p-3">
        <button onClick={goProfile}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-[#142d18] cursor-pointer transition-colors border border-green-100 dark:border-[#1a4a20] w-full text-left">
          <img src={currentUser.avatar} alt="me" className="w-16 h-16 rounded-full object-cover border-2 border-green-400" />
          <div>
            <p className="font-bold text-[16px] text-gray-900 dark:text-[#e8f5e9]">{currentUser.name}</p>
            <p className="text-green-600 dark:text-[#6abf69] text-[13px]">{currentUser.title || 'Muslim · Bangladesh'}</p>
            <p className="text-[12px] text-green-500 dark:text-[#4a7a50] mt-0.5 arabic">السَّلَامُ عَلَيْكُمْ</p>
          </div>
        </button>
        <button onClick={goProfile}
          className="w-full mt-2 py-2 rounded-xl border border-green-200 dark:border-[#1a4a20] text-green-700 dark:text-[#6abf69] font-semibold text-[14px] hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors">
          প্রোফাইল দেখুন
        </button>
      </div>

      <hr className="border-green-100 dark:border-[#1a4a20]" />

      <div className="p-2">
        <Item Icon={FaUserEdit} label="প্রোফাইল সম্পাদনা" sub="আপনার প্রোফাইল আপডেট করুন" onClick={goProfile} />

        {/* Dark mode toggle */}
        <button onClick={() => { setDarkMode(!darkMode); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors text-left">
          <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-[#142d18] flex items-center justify-center flex-shrink-0">
            <FaMoon className="text-green-700 dark:text-[#6abf69] text-[16px]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-gray-800 dark:text-[#e8f5e9]">Dark Mode</p>
            <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">{darkMode ? '✅ চালু আছে' : '⬜ বন্ধ আছে'}</p>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${darkMode ? 'bg-green-600' : 'bg-gray-200 dark:bg-[#1a4a20]'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>

        <Item Icon={FaCog}           label="Settings & Privacy" sub="Account settings"
          onClick={() => { navigate('/settings'); onClose(); }} />
        <Item Icon={FaShieldAlt}     label="Help & Support"     sub="Help center"             onClick={onClose} />
        <Item Icon={FaQuestionCircle} label="Feedback দিন"       sub="আমাদের উন্নত করুন"     onClick={onClose} />
      </div>

      <hr className="border-green-100 dark:border-[#1a4a20]" />

      <div className="p-2">
        <Item Icon={FaSignOutAlt} label="লগ আউট" sub="জাযাকাল্লাহু খায়রান" onClick={handleLogout} danger />
      </div>

      <p className="text-center text-[11px] text-green-400 dark:text-[#2d5a35] pb-3">UmmahBook · © 2025</p>
    </div>
  );
}
