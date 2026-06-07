import { useState, useRef } from 'react';
import { FaBookOpen, FaImage, FaTimes, FaPray, FaVideo, FaPlay } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const t = (lang, bn, en) => lang === 'en' ? en : bn;

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

async function captureVideoThumbnail(src) {
  return new Promise(resolve => {
    const v = document.createElement('video');
    v.src = src; v.muted = true; v.preload = 'metadata';
    v.onloadeddata = () => { v.currentTime = 0.5; };
    v.onseeked = () => {
      const c = document.createElement('canvas');
      c.width = 400; c.height = 400;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 400, 400);
      const s = Math.min(400 / v.videoWidth, 400 / v.videoHeight);
      ctx.drawImage(v, (400 - v.videoWidth * s) / 2, (400 - v.videoHeight * s) / 2, v.videoWidth * s, v.videoHeight * s);
      resolve(c.toDataURL('image/jpeg', 0.6));
    };
    v.onerror = () => resolve(null);
    v.load();
  });
}

export default function CreatePost() {
  const { currentUser, addPost, lang } = useApp();
  const [modal,      setModal]      = useState(false);
  const [text,       setText]       = useState('');
  const [arabic,     setArabic]     = useState('');
  const [type,       setType]       = useState('reminder');
  const [privacy,    setPrivacy]    = useState('public');
  const [image,      setImage]      = useState(null);   // base64 jpeg
  const [video,      setVideo]      = useState(null);   // blob URL
  const [videoThumb, setVideoThumb] = useState(null);   // base64 jpeg thumbnail
  const [imgLoading, setImgLoading] = useState(false);
  const [vidLoading, setVidLoading] = useState(false);

  const fileRef  = useRef(null);
  const videoRef = useRef(null);

  const handlePost = () => {
    if (!text.trim()) return;
    addPost({ content: text, arabic: arabic.trim() || null, type, privacy, image, video });
    closeModal();
  };

  const closeModal = () => {
    setModal(false);
    setText(''); setArabic(''); setType('reminder'); setPrivacy('public');
    setImage(null); setVideo(null); setVideoThumb(null);
  };

  const handleImageFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImgLoading(true);
    resizeImage(f, 1200, 0.82, (data) => {
      setImage(data);
      setImgLoading(false);
    });
    e.target.value = '';
  };

  const handleVideoFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVidLoading(true);
    const blobUrl = URL.createObjectURL(f);
    const thumb = await captureVideoThumbnail(blobUrl);
    setVideo(blobUrl);
    setVideoThumb(thumb);
    setVidLoading(false);
    e.target.value = '';
  };

  const clearMedia = () => {
    if (video) URL.revokeObjectURL(video);
    setImage(null); setVideo(null); setVideoThumb(null);
  };

  if (!currentUser) return null;

  const hasMedia = image || video;
  const isLoading = imgLoading || vidLoading;

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
            {t(lang, "আপনার মনে কী আছে? ✨", "What's on your mind? ✨")}
          </button>
        </div>
        <hr className="border-green-100 dark:border-[#1a4a20] mb-2" />
        <div className="flex items-center justify-around">
          {[
            { icon: FaBookOpen, en: 'Quran', bn: 'কুরআন',  color: 'text-green-600' },
            { icon: FaImage,    en: 'Photo', bn: 'ছবি',    color: 'text-amber-500' },
            { icon: FaVideo,    en: 'Video', bn: 'ভিডিও',  color: 'text-blue-500'  },
            { icon: FaPray,     en: 'Dua',   bn: "দু'আ",   color: 'text-green-600' },
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
          <div className="w-full max-w-[500px] bg-white dark:bg-[#0f2313] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col fade-in border border-green-100 dark:border-[#1a4a20]"
            style={{ maxHeight: '92vh' }}>

            {/* Header */}
            <div className="relative flex items-center justify-center px-4 py-4 flex-shrink-0 rounded-t-3xl sm:rounded-t-3xl"
              style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
              <div className="text-center">
                <h2 className="text-[17px] font-black text-white tracking-wide">
                  {t(lang, 'ইসলামিক কন্টেন্ট শেয়ার করুন', 'Share Islamic Content')}
                </h2>
                <p className="text-green-300 text-[12px] mt-0.5 arabic">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
              </div>
              <button onClick={closeModal}
                className="absolute right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors active:scale-90">
                <FaTimes className="text-white text-sm" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-4 space-y-4">

              {/* Author + privacy */}
              <div className="flex items-center gap-3 bg-green-50 dark:bg-[#142d18] rounded-2xl px-3 py-2.5 border border-green-100 dark:border-[#1a4a20]">
                <img src={currentUser.avatar} alt="me" className="w-11 h-11 rounded-full object-cover border-2 border-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[15px] text-green-900 dark:text-[#e8f5e9] truncate">{currentUser.name}</p>
                  <button onClick={() => setPrivacy(p => p === 'public' ? 'friends' : p === 'friends' ? 'only_me' : 'public')}
                    className="flex items-center gap-1 bg-white dark:bg-[#0f2313] border border-green-300 dark:border-[#1a4a20] rounded-lg px-2.5 py-0.5 text-[12px] font-bold text-green-700 dark:text-[#6abf69] mt-0.5 active:scale-95 transition-transform">
                    {privacy === 'public' ? `🌍 ${t(lang,'পাবলিক','Public')}` : privacy === 'friends' ? `👥 ${t(lang,'বন্ধুরা','Friends')}` : `🔒 ${t(lang,'শুধু আমি','Only Me')}`}
                    <span className="text-[10px] opacity-60 ml-1">▼</span>
                  </button>
                </div>
              </div>

              {/* Post type chips */}
              <div>
                <p className="text-[11px] font-bold text-green-600 dark:text-[#4a7a50] mb-2 uppercase tracking-wider">
                  {t(lang, 'পোস্টের ধরন', 'Post Type')}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {POST_TYPES.map(tp => (
                    <button key={tp.key} onClick={() => setType(tp.key)}
                      className={`px-3 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 ${
                        type === tp.key
                          ? 'bg-green-700 text-white shadow-md'
                          : 'bg-green-50 dark:bg-[#142d18] text-green-700 dark:text-[#6abf69] border border-green-200 dark:border-[#1a4a20] hover:bg-green-100 dark:hover:bg-[#1a4a20]'
                      }`}>
                      {tp.emoji} {t(lang, tp.bn, tp.en)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arabic text */}
              <div>
                <p className="text-[11px] font-bold text-green-600 dark:text-[#4a7a50] mb-1.5 uppercase tracking-wider">
                  {t(lang, 'আরবি টেক্সট (ঐচ্ছিক)', 'Arabic Text (Optional)')}
                </p>
                <input value={arabic} onChange={e => setArabic(e.target.value)}
                  placeholder="عربي نص — Arabic text"
                  className="w-full bg-green-50 dark:bg-[#142d18] border-2 border-green-100 dark:border-[#1a4a20] rounded-xl px-4 py-2.5 arabic text-right text-green-800 dark:text-[#e8f5e9] placeholder-green-300 dark:placeholder-[#2d5a35] outline-none focus:border-green-400 transition-colors"
                  style={{ fontSize: '16px' }} />
              </div>

              {/* Content textarea */}
              <div>
                <p className="text-[11px] font-bold text-green-600 dark:text-[#4a7a50] mb-1.5 uppercase tracking-wider">
                  {t(lang, 'আপনার কথা', 'Your Message')}
                </p>
                <textarea value={text} onChange={e => setText(e.target.value)}
                  placeholder={t(lang,
                    'আল্লাহর কথা শেয়ার করুন — কুরআন আয়াত, হাদিস বা ইসলামিক রিমাইন্ডার... 🤲',
                    'Share the words of Allah — Quran ayat, hadith or Islamic reminder... 🤲'
                  )}
                  className="w-full outline-none resize-none placeholder-green-300 dark:placeholder-[#2d5a35] min-h-[110px] leading-relaxed text-gray-800 dark:text-[#e8f5e9] bg-green-50 dark:bg-[#142d18] border-2 border-green-100 dark:border-[#1a4a20] rounded-xl px-4 py-3 focus:border-green-400 transition-colors"
                  style={{ fontSize: '16px' }} rows={4} />
              </div>

              {/* Media preview */}
              {(hasMedia || isLoading) && (
                <div className="relative rounded-2xl overflow-hidden border-2 border-green-200 dark:border-[#1a4a20] shadow-md">
                  {isLoading ? (
                    <div className="h-[140px] bg-green-50 dark:bg-[#142d18] flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-green-600 dark:text-green-400 text-[13px] font-medium">
                        {vidLoading ? t(lang,'ভিডিও প্রস্তুত হচ্ছে...','Preparing video...') : t(lang,'ছবি প্রস্তুত হচ্ছে...','Preparing image...')}
                      </span>
                    </div>
                  ) : video ? (
                    <>
                      <video src={video} controls className="w-full max-h-[280px] bg-black" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <FaPlay className="text-[8px]" />
                        {t(lang,'ভিডিও যুক্ত হয়েছে','Video added')}
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={image} alt="preview" className="w-full max-h-[280px] object-cover" />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ✓ {t(lang,'ছবি যুক্ত হয়েছে','Image added')}
                      </div>
                    </>
                  )}
                  {!isLoading && (
                    <button onClick={clearMedia}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 flex items-center justify-center text-white transition-colors active:scale-90">
                      <FaTimes className="text-[13px]" />
                    </button>
                  )}
                </div>
              )}

              {/* Media buttons (when no media) */}
              {!hasMedia && !isLoading && (
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => fileRef.current.click()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors text-[13px] font-semibold active:scale-95">
                    <FaImage className="text-[18px]" />
                    {t(lang,'ছবি যোগ করুন','Add Photo')}
                  </button>
                  <button onClick={() => videoRef.current.click()}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors text-[13px] font-semibold active:scale-95">
                    <FaVideo className="text-[18px]" />
                    {t(lang,'ভিডিও যোগ করুন','Add Video')}
                  </button>
                </div>
              )}

              <input ref={fileRef}  type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
              <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFile} />
            </div>

            {/* Submit button */}
            <div className="px-4 py-3 border-t border-green-100 dark:border-[#1a4a20] flex-shrink-0 bg-white dark:bg-[#0f2313]">
              <button onClick={handlePost} disabled={!text.trim() || isLoading}
                className="w-full py-3.5 rounded-xl font-black text-[15px] text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3a)',
                  boxShadow: text.trim() && !isLoading ? '0 4px 20px rgba(26,92,42,0.4)' : 'none' }}>
                {t(lang,'শেয়ার করুন — ইনশাআল্লাহ 🕌','Share — InshAllah 🕌')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
