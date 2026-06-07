import { useState, useRef } from 'react';
import { FaBookOpen, FaImage, FaTimes, FaPray } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const POST_TYPES = [
  { key: 'quran',    en: 'Quran Ayat',  bn: 'কুরআন আয়াত', emoji: '📖' },
  { key: 'hadith',   en: 'Hadith',      bn: 'হাদিস',        emoji: '📜' },
  { key: 'dua',      en: 'Dua',         bn: "দু'আ",         emoji: '🤲' },
  { key: 'reminder', en: 'Reminder',    bn: 'রিমাইন্ডার',  emoji: '🌙' },
];

function resizeImage(file, maxSize, quality, cb) {
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const scale = Math.min(1, maxSize / img.width, maxSize / img.height);
    const canvas = document.createElement('canvas');
    canvas.width  = Math.round(img.width  * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    cb(canvas.toDataURL('image/jpeg', quality));
  };
  img.src = url;
}

export default function CreatePost() {
  const { currentUser, addPost } = useApp();
  const [modal,   setModal]   = useState(false);
  const [text,    setText]    = useState('');
  const [arabic,  setArabic]  = useState('');
  const [type,    setType]    = useState('reminder');
  const [privacy, setPrivacy] = useState('public');
  const [image,   setImage]   = useState(null);   // base64 jpeg
  const [imgLoading, setImgLoading] = useState(false);

  const fileRef = useRef(null);

  const handlePost = () => {
    if (!text.trim()) return;
    addPost({ content: text, arabic: arabic.trim() || null, type, privacy, image });
    closeModal();
  };

  const closeModal = () => {
    setModal(false);
    setText(''); setArabic(''); setType('reminder'); setPrivacy('public'); setImage(null);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImgLoading(true);
    resizeImage(f, 1200, 0.82, (data) => {
      setImage(data);
      setImgLoading(false);
    });
    e.target.value = '';
  };

  if (!currentUser) return null;

  return (
    <>
      {/* ── Compact trigger card ────────────────────────────────────────────── */}
      <div className="card p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-green-600 dark:text-[#4a7a50] text-[13px] font-medium arabic text-right w-full">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <img src={currentUser.avatar} alt="me" className="w-10 h-10 rounded-full object-cover border-2 border-green-400" />
            <span className="absolute -bottom-1 -right-1 text-xs">☪️</span>
          </div>
          <button onClick={() => setModal(true)}
            className="flex-1 bg-green-50 dark:bg-[#142d18] hover:bg-green-100 dark:hover:bg-[#1a4a20] border border-green-200 dark:border-[#1a4a20] rounded-full px-4 py-2.5 text-left text-green-600 dark:text-[#4a7a50] text-[14px] transition-colors">
            What's on your mind? / আপনার মনে কী আছে? ✨
          </button>
        </div>
        <hr className="border-green-100 dark:border-[#1a4a20] mb-2" />
        <div className="flex items-center justify-around">
          {[
            { icon: FaBookOpen, en: 'Quran Ayat', bn: 'কুরআন আয়াত', color: 'text-green-600' },
            { icon: FaImage,    en: 'Photo',      bn: 'ছবি',          color: 'text-amber-500' },
            { icon: FaPray,     en: 'Dua',        bn: "দু'আ",         color: 'text-green-600' },
          ].map(({ icon: Icon, en, bn, color }) => (
            <button key={en} onClick={() => setModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors flex-1 justify-center">
              <Icon className={`${color} text-lg`} />
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-green-700 dark:text-[#6abf69] font-bold text-[12px]">{en}</p>
                <p className="text-green-500 dark:text-[#4a7a50] text-[10px]">{bn}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Post modal ──────────────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-white dark:bg-[#0f2313] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col fade-in border border-green-100 dark:border-[#1a4a20]"
            style={{ maxHeight: '92vh' }}>

            {/* Header */}
            <div className="relative flex items-center justify-center px-4 py-3 border-b border-green-100 dark:border-[#1a4a20] flex-shrink-0 rounded-t-2xl sm:rounded-t-2xl"
              style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3a)' }}>
              <div className="text-center">
                <h2 className="text-[16px] font-bold text-white">Share Islamic Content</h2>
                <p className="text-green-300 text-[12px]">ইসলামিক কন্টেন্ট শেয়ার করুন</p>
              </div>
              <button onClick={closeModal}
                className="absolute right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <FaTimes className="text-white text-sm" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-4 space-y-3">

              {/* Author + privacy */}
              <div className="flex items-center gap-2">
                <img src={currentUser.avatar} alt="me" className="w-10 h-10 rounded-full object-cover border-2 border-green-400" />
                <div>
                  <p className="font-bold text-[15px] text-green-900 dark:text-[#e8f5e9]">{currentUser.name}</p>
                  <button onClick={() => setPrivacy(p => p === 'public' ? 'friends' : 'public')}
                    className="flex items-center gap-1 bg-green-100 dark:bg-[#142d18] border border-green-300 dark:border-[#1a4a20] rounded-md px-2 py-0.5 text-[12px] font-semibold text-green-700 dark:text-[#6abf69] mt-0.5">
                    {privacy === 'public' ? '🌍 Public · পাবলিক' : '👥 Friends · বন্ধুরা'}
                  </button>
                </div>
              </div>

              {/* Post type chips */}
              <div className="flex gap-2 flex-wrap">
                {POST_TYPES.map(t => (
                  <button key={t.key} onClick={() => setType(t.key)}
                    className={`px-3 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 ${
                      type === t.key
                        ? 'bg-green-700 text-white shadow'
                        : 'bg-green-50 dark:bg-[#142d18] text-green-700 dark:text-[#6abf69] border border-green-200 dark:border-[#1a4a20] hover:bg-green-100 dark:hover:bg-[#1a4a20]'
                    }`}>
                    {t.emoji} {t.en}
                  </button>
                ))}
              </div>

              {/* Arabic text */}
              <input value={arabic} onChange={e => setArabic(e.target.value)}
                placeholder="عربي نص — Arabic text (optional)"
                className="w-full bg-green-50 dark:bg-[#142d18] border border-green-200 dark:border-[#1a4a20] rounded-xl px-4 py-2.5 arabic text-right text-green-800 dark:text-[#e8f5e9] placeholder-green-400 dark:placeholder-[#2d5a35] outline-none focus:border-green-500"
                style={{ fontSize: '16px' }} />

              {/* Content textarea */}
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder="আল্লাহর কথা শেয়ার করুন — কুরআন আয়াত, হাদিস বা ইসলামিক রিমাইন্ডার... 🤲"
                className="w-full outline-none resize-none placeholder-green-400 dark:placeholder-[#2d5a35] min-h-[100px] leading-relaxed text-gray-800 dark:text-[#e8f5e9] bg-transparent"
                style={{ fontSize: '16px' }} rows={4} />

              {/* Image preview */}
              {(image || imgLoading) && (
                <div className="relative rounded-xl overflow-hidden border border-green-200 dark:border-[#1a4a20]">
                  {imgLoading ? (
                    <div className="h-[140px] bg-green-50 dark:bg-[#142d18] flex items-center justify-center">
                      <span className="text-green-500 text-[13px] font-medium">⏳ ছবি প্রস্তুত হচ্ছে...</span>
                    </div>
                  ) : (
                    <>
                      <img src={image} alt="preview" className="w-full max-h-[260px] object-cover" />
                      <button onClick={() => setImage(null)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-[14px] transition-colors">
                        <FaTimes />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ ছবি যুক্ত হয়েছে
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Add image button (when no image selected) */}
              {!image && !imgLoading && (
                <button onClick={() => fileRef.current.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-green-300 dark:border-[#2d5a35] text-green-600 dark:text-[#4a7a50] hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors text-[13px] font-semibold active:scale-95">
                  <FaImage className="text-[18px] text-amber-500" />
                  ছবি যোগ করুন (Photo)
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            {/* Submit button */}
            <div className="px-4 py-3 border-t border-green-100 dark:border-[#1a4a20] flex-shrink-0">
              <button onClick={handlePost} disabled={!text.trim() || imgLoading}
                className="w-full py-3 rounded-xl font-bold text-[15px] text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow"
                style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
                শেয়ার করুন — ইনশাআল্লাহ 🕌
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
