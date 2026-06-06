import { useState } from 'react';
import { FaBookOpen, FaImage, FaTimes, FaPray } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const POST_TYPES = [
  { key: 'quran',    en: 'Quran Ayat',  bn: 'কুরআন আয়াত', emoji: '📖' },
  { key: 'hadith',   en: 'Hadith',      bn: 'হাদিস',        emoji: '📜' },
  { key: 'dua',      en: "Dua",         bn: "দু'আ",         emoji: '🤲' },
  { key: 'reminder', en: 'Reminder',    bn: 'রিমাইন্ডার',  emoji: '🌙' },
];

export default function CreatePost() {
  const { currentUser, addPost } = useApp();
  const [modal, setModal] = useState(false);
  const [text, setText] = useState('');
  const [arabic, setArabic] = useState('');
  const [type, setType] = useState('reminder');
  const [privacy, setPrivacy] = useState('public');

  const handlePost = () => {
    if (!text.trim()) return;
    addPost({ content: text, arabic: arabic.trim() || null, type, privacy });
    setModal(false);
    setText('');
    setArabic('');
    setType('reminder');
  };

  if (!currentUser) return null;

  return (
    <>
      <div className="card p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-green-600 text-[13px] font-medium arabic text-right w-full">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <img src={currentUser.avatar} alt="me" className="w-10 h-10 rounded-full object-cover border-2 border-green-400" />
            <span className="absolute -bottom-1 -right-1 text-xs">☪️</span>
          </div>
          <button onClick={() => setModal(true)}
            className="flex-1 bg-green-50 hover:bg-green-100 border border-green-200 rounded-full px-4 py-2.5 text-left text-green-600 text-[14px] transition-colors">
            What's on your mind? / আপনার মনে কী আছে? ✨
          </button>
        </div>
        <hr className="border-green-100 mb-2" />
        <div className="flex items-center justify-around">
          {[
            { icon: FaBookOpen, en: 'Quran Ayat', bn: 'কুরআন আয়াত', color: 'text-green-600' },
            { icon: FaImage,    en: 'Photo',      bn: 'ছবি',          color: 'text-amber-500' },
            { icon: FaPray,     en: 'Dua',        bn: "দু'আ",         color: 'text-green-600' },
          ].map(({ icon: Icon, en, bn, color }) => (
            <button key={en} onClick={() => setModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors flex-1 justify-center">
              <Icon className={`${color} text-lg`} />
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-green-700 font-bold text-[12px]">{en}</p>
                <p className="text-green-500 text-[10px]">{bn}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3">
          <div className="card w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden fade-in">
            <div className="relative flex items-center justify-center p-4 border-b border-green-100" style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3a)' }}>
              <div className="text-center">
                <h2 className="text-[16px] font-bold text-white">Share Islamic Content</h2>
                <p className="text-green-300 text-[12px]">ইসলামিক কন্টেন্ট শেয়ার করুন</p>
              </div>
              <button onClick={() => setModal(false)}
                className="absolute right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <FaTimes className="text-white text-sm" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <img src={currentUser.avatar} alt="me" className="w-10 h-10 rounded-full object-cover border-2 border-green-400" />
                <div>
                  <p className="font-bold text-[15px] text-green-900">{currentUser.name}</p>
                  <button onClick={() => setPrivacy(p => p === 'public' ? 'friends' : 'public')}
                    className="flex items-center gap-1 bg-green-100 border border-green-300 rounded-md px-2 py-0.5 text-[12px] font-semibold text-green-700 mt-0.5">
                    {privacy === 'public' ? '🌍 Public · পাবলিক' : '👥 Friends · বন্ধুরা'}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-3 flex-wrap">
                {POST_TYPES.map(t => (
                  <button key={t.key} onClick={() => setType(t.key)}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all leading-tight ${
                      type === t.key ? 'bg-green-700 text-white' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    }`}>
                    <span>{t.emoji} {t.en}</span>
                    <span className="block text-[10px] opacity-80">{t.bn}</span>
                  </button>
                ))}
              </div>

              <div className="mb-2">
                <input value={arabic} onChange={e => setArabic(e.target.value)}
                  placeholder="عربي نص — Arabic text (optional · ঐচ্ছিক)"
                  className="input-base arabic text-right text-[16px]" />
              </div>

              <textarea autoFocus value={text} onChange={e => setText(e.target.value)}
                placeholder="Share the words of Allah, a Quran verse or hadith... / আল্লাহর কথা শেয়ার করুন, কুরআন আয়াত বা হাদিস লিখুন... 🤲"
                className="w-full outline-none resize-none text-[15px] placeholder-green-400 min-h-[100px] leading-relaxed text-gray-800" rows={4} />
            </div>

            <div className="px-4 pb-4">
              <button onClick={handlePost} disabled={!text.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                Share · শেয়ার করুন — ইনশাআল্লাহ 🕌
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
