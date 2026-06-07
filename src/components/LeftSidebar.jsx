import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaBookOpen, FaMosque, FaStar, FaHeart, FaChevronDown, FaChevronUp, FaGlobe, FaPray, FaCog } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { islamicGroups } from '../data/initialData';

const navItems = [
  { icon: FaUsers,    en: 'Groups',       bn: 'গ্রুপসমূহ',      path: '/groups' },
  { icon: FaBookOpen, en: 'Quran',        bn: 'কুরআন ও হাদিস',  path: '/quran' },
  { icon: FaMosque,   en: 'Profile',      bn: 'প্রোফাইল',        path: '/profile' },
  { icon: FaPray,     en: 'Prayer Times', bn: 'নামাজের সময়',    path: '/prayer-times' },
  { icon: FaStar,     en: 'Events',       bn: 'ইভেন্টসমূহ',      path: '/events' },
  { icon: FaHeart,    en: 'Sadaqah',      bn: 'সদকা ও দান',      path: '/sadaqah' },
  { icon: FaGlobe,    en: 'Ummah World',  bn: 'উম্মাহ ওয়ার্ল্ড', path: '/ummah-world' },
  { icon: FaCog,      en: 'Settings',     bn: 'সেটিংস',           path: '/settings' },
];


export default function LeftSidebar() {
  const { currentUser, lang } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const visible = showMore ? navItems : navItems.slice(0, 5);

  const allGroups = (() => {
    try { return JSON.parse(localStorage.getItem('ub_groups') || 'null') || islamicGroups; }
    catch { return islamicGroups; }
  })();
  const joinedGroups = allGroups.filter(g => g.joined).slice(0, 4);

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
        {visible.map(({ icon: Icon, en, bn, path }) => {
          const active = path && location.pathname === path;
          return (
            <button key={en}
              onClick={() => { if (path) navigate(path); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-colors text-left ${
                active ? 'bg-green-100 text-green-700' : 'hover:bg-green-50'
              }`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${active ? 'bg-green-600' : 'bg-green-100'}`}>
                <Icon className={`text-[16px] ${active ? 'text-white' : 'text-green-700'}`} />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-[13px] text-green-900">{lang === 'en' ? en : bn}</p>
              </div>
            </button>
          );
        })}

        <button onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-green-50 transition-colors mb-2">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            {showMore ? <FaChevronUp className="text-green-700 text-sm" /> : <FaChevronDown className="text-green-700 text-sm" />}
          </div>
          <div className="leading-tight">
            <p className="font-bold text-[13px] text-green-900">
              {showMore
                ? (lang === 'en' ? 'Show Less' : 'কম দেখুন')
                : (lang === 'en' ? 'Show More' : 'আরো দেখুন')}
            </p>
          </div>
        </button>

        <hr className="border-green-100 my-3" />

        {/* Groups */}
        <div className="mb-2 px-2">
          <p className="text-[14px] font-bold text-green-800">{lang === 'en' ? 'Islamic Groups' : 'ইসলামিক গ্রুপ'}</p>
        </div>
        {joinedGroups.length === 0 ? (
          <button onClick={() => navigate('/groups')}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-green-50 transition-colors text-left mb-1">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-[16px]">👥</span>
            </div>
            <p className="text-[13px] text-green-600 italic">কোনো গ্রুপে যোগ দেননি → গ্রুপ দেখুন</p>
          </button>
        ) : joinedGroups.map((g) => (
          <button key={g.id} onClick={() => navigate('/groups')}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-green-50 transition-colors text-left mb-1">
            <img src={g.img} alt={g.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-green-200" />
            <div>
              <p className="font-medium text-[13px] text-green-900 leading-tight">{g.name}</p>
              <p className="text-[11px] text-green-600">{(g.members / 1000).toFixed(1)}k সদস্য</p>
            </div>
          </button>
        ))}

        <hr className="border-green-100 my-3" />
        <div className="px-2 flex flex-wrap gap-1">
          {['Privacy · গোপনীয়তা', 'Terms · শর্তাবলি', 'About · সম্পর্কে'].map((item) => (
            <span key={item} className="text-[11px] text-green-600 cursor-pointer hover:underline">{item} ·</span>
          ))}
          <span className="text-[11px] text-green-600">UmmahBook © 2025</span>
        </div>
      </div>
    </aside>
  );
}
