import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaBookOpen, FaMosque, FaStar, FaHeart, FaChevronDown, FaChevronUp, FaGlobe, FaPray } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const navItems = [
  { icon: FaUsers,    label: 'গ্রুপসমূহ',      path: '/groups' },
  { icon: FaBookOpen, label: 'কুরআন ও হাদিস',  path: '/quran' },
  { icon: FaMosque,   label: 'প্রোফাইল',        path: '/profile' },
  { icon: FaPray,     label: 'নামাজের সময়',    path: null },
  { icon: FaStar,     label: 'ইভেন্টসমূহ',      path: '/events' },
  { icon: FaHeart,    label: 'সদকা ও দান',      path: null },
  { icon: FaGlobe,    label: 'উম্মাহ ওয়ার্ল্ড', path: null },
];

const groups = [
  { name: 'বাংলাদেশ ইসলামিক ফোরাম', img: 'https://picsum.photos/seed/isg1/40/40', members: '৪৫K সদস্য' },
  { name: 'Quran Learners BD',      img: 'https://picsum.photos/seed/isg2/40/40', members: '২৮K সদস্য' },
  { name: 'Hadith Daily',           img: 'https://picsum.photos/seed/isg3/40/40', members: '৬২K সদস্য' },
  { name: 'Islamic Sisters Network',img: 'https://picsum.photos/seed/isg4/40/40', members: '১৯K সদস্য' },
];

export default function LeftSidebar() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const visible = showMore ? navItems : navItems.slice(0, 5);

  return (
    <aside className="hidden lg:block fixed left-0 top-[56px] h-[calc(100vh-56px)] w-[280px] overflow-y-auto sidebar-bg border-r border-green-100">
      <div className="p-3">

        {/* Profile */}
        {currentUser && (
          <button onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-2 py-3 mb-2 w-full text-left hover:bg-green-50 rounded-xl transition-colors">
            <div className="relative">
              <img src={currentUser.avatar} alt="me" className="w-12 h-12 rounded-full object-cover border-2 border-green-500" />
              <span className="absolute -bottom-1 -right-1 text-sm">☪️</span>
            </div>
            <div>
              <p className="font-bold text-[15px] text-green-900">{currentUser.name}</p>
              <p className="text-[12px] text-green-600">{currentUser.title || 'Muslim'}</p>
            </div>
          </button>
        )}

        {/* Greeting */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3 mb-3 text-center">
          <p className="text-green-700 font-bold text-[16px] arabic">السَّلَامُ عَلَيْكُمْ</p>
          <p className="text-green-600 text-[12px] mt-1">আস-সালামু আলাইকুম ওয়া রাহমাতুল্লাহ</p>
        </div>

        {/* Nav */}
        {visible.map(({ icon: Icon, label, path }) => {
          const active = path && location.pathname === path;
          return (
            <button key={label}
              onClick={() => { if (path) navigate(path); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors text-left ${
                active ? 'bg-green-100 text-green-700' : 'hover:bg-green-50'
              }`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-green-600' : 'bg-green-100'}`}>
                <Icon className={`text-[16px] ${active ? 'text-white' : 'text-green-700'}`} />
              </div>
              <span className="font-medium text-[14px]">{label}</span>
            </button>
          );
        })}

        <button onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-green-50 transition-colors mb-2">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            {showMore ? <FaChevronUp className="text-green-700 text-sm" /> : <FaChevronDown className="text-green-700 text-sm" />}
          </div>
          <span className="font-medium text-[14px] text-gray-700">{showMore ? 'কম দেখুন' : 'আরো দেখুন'}</span>
        </button>

        <hr className="border-green-100 my-3" />

        {/* Groups */}
        <p className="px-2 py-1 text-[15px] font-bold text-green-800 mb-2">ইসলামিক গ্রুপ</p>
        {groups.map((g) => (
          <button key={g.name} onClick={() => navigate('/groups')}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-green-50 transition-colors text-left mb-1">
            <img src={g.img} alt={g.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-green-200" />
            <div>
              <p className="font-medium text-[13px] text-green-900 leading-tight">{g.name}</p>
              <p className="text-[11px] text-green-600">{g.members}</p>
            </div>
          </button>
        ))}

        <hr className="border-green-100 my-3" />
        <div className="px-2 flex flex-wrap gap-1">
          {['গোপনীয়তা', 'শর্তাবলি', 'আমাদের সম্পর্কে'].map((item) => (
            <span key={item} className="text-[11px] text-green-600 cursor-pointer hover:underline">{item} ·</span>
          ))}
          <span className="text-[11px] text-green-600">UmmahBook © 2025</span>
        </div>
      </div>
    </aside>
  );
}
