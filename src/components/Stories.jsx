import { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTimes, FaCheck, FaChevronLeft, FaChevronRight,
         FaEllipsisH, FaPaperPlane, FaTrash, FaEye, FaCamera, FaMagic, FaPlay } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

// ─── Language helper (used inside every component via useApp) ────────────────
const t = (lang, bn, en) => lang === 'en' ? en : bn;

// ─── Constants ───────────────────────────────────────────────────────────────
const BG_OPTIONS = [
  { id:'g1',  bg:'linear-gradient(145deg,#1a5c2a,#2d8a3a)' },
  { id:'g2',  bg:'linear-gradient(145deg,#0a3d5c,#0e6090)' },
  { id:'g3',  bg:'linear-gradient(145deg,#3d1a5c,#7a2d9a)' },
  { id:'g4',  bg:'linear-gradient(145deg,#5c2d0a,#c0501a)' },
  { id:'g5',  bg:'linear-gradient(145deg,#0a3d2d,#1a7a5c)' },
  { id:'g6',  bg:'linear-gradient(145deg,#5c5c0a,#9a9a1a)' },
  { id:'g7',  bg:'linear-gradient(145deg,#5c0a1a,#9a1a3a)' },
  { id:'g8',  bg:'linear-gradient(145deg,#1a1a3d,#2d2d7a)' },
  { id:'g9',  bg:'linear-gradient(145deg,#b92b27,#1565c0)' },
  { id:'g10', bg:'linear-gradient(145deg,#11998e,#38ef7d)' },
  { id:'g11', bg:'linear-gradient(145deg,#fc4a1a,#f7b733)' },
  { id:'g12', bg:'linear-gradient(145deg,#1c1c1c,#3d3d3d)' },
];

const PRESETS = [
  { emoji:'📖', arabic:'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',                               bn:'বিসমিল্লাহ',      en:'Bismillah' },
  { emoji:'🤲', arabic:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',                               bn:'আলহামদুলিল্লাহ',  en:'Alhamdulillah' },
  { emoji:'✨', arabic:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',                                     bn:'সুবহানআল্লাহ',    en:'SubhanAllah' },
  { emoji:'💚', arabic:'لَا إِلَهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ',               bn:'কালেমা শাহাদাত',  en:'Kalima Shahadat' },
  { emoji:'🌙', arabic:'إِنَّ مَعَ الْعُسْرِ يُسْرًا',                                       bn:'ইন্না মাআল উসর',  en:'Inna Maaal Usr' },
  { emoji:'🕌', arabic:'اللَّهُ أَكْبَرُ',                                                    bn:'আল্লাহু আকবার',  en:'Allahu Akbar' },
  { emoji:'🌿', arabic:'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',                   bn:'রব্বি ইশরাহ',     en:'Rabbish Rahli' },
  { emoji:'⭐', arabic:'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',                    bn:'লাইলাতুল কদর',   en:'Laylatul Qadr' },
  { emoji:'🙏', arabic:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', bn:'রব্বানা আতিনা',   en:'Rabbana Atina' },
  { emoji:'💫', arabic:'حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ',                               bn:'হাসবিআল্লাহ',    en:'Hasbiyallah' },
  { emoji:'🌹', arabic:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',                                   bn:'দরুদ শরীফ',       en:'Durood Sharif' },
  { emoji:'🕊️', arabic:'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',                      bn:'ইন্না লিল্লাহ',   en:'Inna Lillah' },
];

const PRIVACY_OPTIONS = [
  { id:'public',  icon:'🌍',
    bn:'সবাই',     en:'Everyone',
    descBn:'সবাই আপনার স্টোরি দেখতে পাবে',    descEn:'Everyone can see your story' },
  { id:'friends', icon:'👥',
    bn:'বন্ধুরা',  en:'Friends',
    descBn:'শুধু বন্ধুরা আপনার স্টোরি দেখবে', descEn:'Only friends can see your story' },
  { id:'only_me', icon:'🔒',
    bn:'শুধু আমি', en:'Only Me',
    descBn:'শুধু আপনি নিজে দেখতে পাবেন',     descEn:'Only you can see this story' },
];

const TEXT_COLORS   = ['#ffffff','#fbbf24','#34d399','#f87171','#60a5fa','#c084fc','#fb923c','#f0abfc'];
const FONT_SIZES    = [
  { bn:'ছোট',     en:'Small',  size:'15px' },
  { bn:'মাঝারি', en:'Medium', size:'22px' },
  { bn:'বড়',     en:'Large',  size:'30px' },
  { bn:'বিশাল',  en:'Huge',   size:'40px' },
];
const EMOJI_STICKERS = ['🌙','⭐','✨','💚','🤲','🕌','📖','🌿','🌸','🦋','☀️','🌊','🔥','💫','🎯','❤️','🌹','🕊️','📿','🤍','💎','🌺','🌻','🍃'];
const REACTIONS      = ['❤️','😮','😂','😢','🙏','👍','🔥','💚'];

// ─── Video thumbnail capture ──────────────────────────────────────────────────
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

// ─── Image compression ────────────────────────────────────────────────────────
function compressImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        else if (h > MAX)     { w = Math.round(w * MAX / h); h = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function timeLabel(ts, lang) {
  if (!ts) return t(lang, 'এইমাত্র', 'Just now');
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return t(lang, 'এইমাত্র', 'Just now');
  if (m < 60) return t(lang, `${m}মি আগে`, `${m}m ago`);
  const h = Math.floor(m / 60);
  if (h < 24) return t(lang, `${h}ঘ আগে`, `${h}h ago`);
  return t(lang, `${Math.floor(h/24)}দিন আগে`, `${Math.floor(h/24)}d ago`);
}

// ─── Background Picker ────────────────────────────────────────────────────────
function BgPicker({ selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {BG_OPTIONS.map(opt => (
        <button key={opt.id} onClick={() => onSelect(opt)}
          className="relative w-9 h-9 rounded-full transition-all active:scale-90"
          style={{ background: opt.bg,
            outline: selected.id === opt.id ? '3px solid #16a34a' : '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: selected.id === opt.id ? '0 0 0 2px white' : 'none' }}>
          {selected.id === opt.id && <FaCheck className="text-white text-[8px] absolute inset-0 m-auto drop-shadow" />}
        </button>
      ))}
    </div>
  );
}

// ─── Privacy Row ──────────────────────────────────────────────────────────────
function PrivacyRow({ value, onChange }) {
  const { lang } = useApp();
  return (
    <div>
      <p className="text-[12px] font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
        🔒 {t(lang,'স্টোরি প্রাইভেসি','Story Privacy')}
      </p>
      <div className="flex gap-2">
        {PRIVACY_OPTIONS.map(p => (
          <button key={p.id} onClick={() => onChange(p.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all active:scale-95 text-center ${
              value === p.id
                ? 'border-green-600 bg-green-700 text-white shadow-md'
                : 'border-green-200 dark:border-[#1a4a20] bg-white dark:bg-[#142d18] text-green-800 dark:text-green-400'
            }`}>
            <span className="text-[18px]">{p.icon}</span>
            <span className="text-[11px] font-bold leading-tight">{t(lang, p.bn, p.en)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Story Options Sheet ──────────────────────────────────────────────────────
function StoryOptionsSheet({ story, onClose, onDelete, onPrivacyChange }) {
  const { lang } = useApp();
  const [view, setView] = useState('main');
  const viewerCount  = (story.views    || []).length;
  const reactionList = Object.values(story.reactions || {});
  const currentPv    = PRIVACY_OPTIONS.find(p => p.id === (story.privacy || 'public'));

  const Sheet = ({ children }) => (
    <div className="fixed inset-0 z-[400] bg-black/75 flex items-end justify-center" onClick={onClose}>
      <div className="w-full max-w-[500px] bg-white dark:bg-[#0f2313] rounded-t-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-[#1a4a20] rounded-full mx-auto mt-3 mb-2" />
        {children}
      </div>
    </div>
  );

  if (view === 'confirm_delete') return (
    <Sheet>
      <div className="px-5 py-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <FaTrash className="text-red-500 text-[22px]" />
        </div>
        <p className="font-bold text-[18px] text-gray-800 dark:text-[#e8f5e9] mb-2">
          {t(lang,'স্টোরি মুছবেন?','Delete Story?')}
        </p>
        <p className="text-[13px] text-gray-500 dark:text-[#4a7a50] mb-6 leading-relaxed">
          {t(lang,'এই স্টোরি স্থায়ীভাবে মুছে যাবে এবং ফিরিয়ে আনা যাবে না।',
              'This story will be permanently deleted and cannot be recovered.')}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-[14px] border-2 border-gray-200 dark:border-[#1a4a20] text-gray-700 dark:text-[#e8f5e9] bg-white dark:bg-[#142d18]">
            {t(lang,'বাতিল','Cancel')}
          </button>
          <button onClick={onDelete}
            className="flex-1 py-3 rounded-xl font-bold text-[14px] bg-red-600 text-white shadow-md active:scale-95">
            {t(lang,'হ্যাঁ, মুছুন','Yes, Delete')}
          </button>
        </div>
      </div>
    </Sheet>
  );

  if (view === 'privacy') return (
    <Sheet>
      <div className="px-5 py-4">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setView('main')}
            className="w-8 h-8 rounded-full bg-green-50 dark:bg-[#142d18] flex items-center justify-center">
            <FaChevronLeft className="text-green-700 dark:text-green-400 text-sm" />
          </button>
          <h3 className="font-bold text-[16px] text-gray-800 dark:text-[#e8f5e9] flex-1">
            {t(lang,'প্রাইভেসি পরিবর্তন','Change Privacy')}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#142d18] flex items-center justify-center">
            <FaTimes className="text-gray-500 text-xs" />
          </button>
        </div>
        <div className="space-y-2 pb-4">
          {PRIVACY_OPTIONS.map(p => {
            const isActive = (story.privacy || 'public') === p.id;
            return (
              <button key={p.id} onClick={() => { onPrivacyChange(p.id); onClose(); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  isActive
                    ? 'border-green-500 bg-green-50 dark:bg-[#142d18]'
                    : 'border-gray-100 dark:border-[#1a4a20] bg-white dark:bg-[#0f2313]'
                }`}>
                <span className="text-[26px]">{p.icon}</span>
                <div className="text-left flex-1">
                  <p className="font-bold text-[14px] text-gray-800 dark:text-[#e8f5e9]">{t(lang,p.bn,p.en)}</p>
                  <p className="text-[12px] text-gray-500 dark:text-[#4a7a50] mt-0.5">{t(lang,p.descBn,p.descEn)}</p>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <FaCheck className="text-white text-[10px]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Sheet>
  );

  return (
    <Sheet>
      <div className="px-5 py-4">
        <h3 className="font-bold text-[17px] text-center text-gray-800 dark:text-[#e8f5e9] mb-4">
          {t(lang,'স্টোরি পরিচালনা','Story Management')}
        </h3>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-[#142d18] dark:to-[#0f2313] rounded-2xl p-4 text-center border border-green-200 dark:border-[#1a4a20]">
            <div className="text-[32px] mb-1">👁️</div>
            <p className="font-black text-[24px] text-green-800 dark:text-green-400">{viewerCount}</p>
            <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">{t(lang,'জন দেখেছে','viewed')}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-[#142d18] dark:to-[#0f2313] rounded-2xl p-4 text-center border border-green-200 dark:border-[#1a4a20]">
            <div className="text-[32px] mb-1">❤️</div>
            <p className="font-black text-[24px] text-green-800 dark:text-green-400">{reactionList.length}</p>
            <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">{t(lang,'রিঅ্যাকশন','reactions')}</p>
          </div>
        </div>
        {reactionList.length > 0 && (
          <div className="flex gap-1.5 mb-4 flex-wrap px-1">
            {Object.entries(reactionList.reduce((a,e) => { a[e]=(a[e]||0)+1; return a; }, {}))
              .map(([emoji,count]) => (
              <div key={emoji} className="flex items-center gap-1 bg-green-50 dark:bg-[#142d18] border border-green-200 dark:border-[#1a4a20] rounded-full px-2.5 py-1">
                <span className="text-[14px]">{emoji}</span>
                <span className="text-[12px] font-bold text-green-700 dark:text-green-400">{count}</span>
              </div>
            ))}
          </div>
        )}
        {/* Privacy button */}
        <button onClick={() => setView('privacy')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-green-100 dark:border-[#1a4a20] bg-white dark:bg-[#0f2313] hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors mb-2.5 active:scale-[0.98]">
          <span className="text-[22px]">{currentPv?.icon}</span>
          <div className="text-left flex-1">
            <p className="font-bold text-[14px] text-gray-800 dark:text-[#e8f5e9]">
              {t(lang,'প্রাইভেসি','Privacy')}: {t(lang, currentPv?.bn||'', currentPv?.en||'')}
            </p>
            <p className="text-[12px] text-gray-400 dark:text-[#4a7a50]">{t(lang,'কে দেখতে পাচ্ছে পরিবর্তন করুন','Change who can see this')}</p>
          </div>
          <FaChevronRight className="text-gray-300 dark:text-[#4a7a50] flex-shrink-0" />
        </button>
        {/* Delete button */}
        <button onClick={() => setView('confirm_delete')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 mb-3 active:scale-[0.98]">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <FaTrash className="text-red-500 text-[13px]" />
          </div>
          <div className="text-left">
            <p className="font-bold text-[14px] text-red-700 dark:text-red-400">{t(lang,'স্টোরি মুছুন','Delete Story')}</p>
            <p className="text-[12px] text-red-400">{t(lang,'স্থায়ীভাবে মুছে যাবে','Will be permanently deleted')}</p>
          </div>
        </button>
        <button onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-[14px] bg-gray-100 dark:bg-[#142d18] text-gray-600 dark:text-[#e8f5e9]">
          {t(lang,'বাতিল','Cancel')}
        </button>
      </div>
    </Sheet>
  );
}

// ─── Story Viewer ─────────────────────────────────────────────────────────────
function StoryViewer({ allStories, startIdx, onClose }) {
  const { lang, currentUser, allUsers, deleteStory, updateStory, viewStory, reactToStory, openChat, contacts, loadMsgs, saveMsgs } = useApp();
  const [idx,         setIdx]         = useState(startIdx);
  const [progress,    setProgress]    = useState(0);
  const [reply,       setReply]       = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [floatEmoji,  setFloatEmoji]  = useState(null);
  const [videoError,  setVideoError]  = useState(false);
  const intervalRef = useRef(null);
  const videoRef    = useRef(null);
  const story       = allStories[idx];

  const isOwnStory  = story?.userId === currentUser?.id;
  const myReaction  = currentUser ? (story?.reactions||{})[currentUser.id] : null;
  const viewerCount = (story?.views||[]).length;
  const pv          = PRIVACY_OPTIONS.find(p => p.id === (story?.privacy||'public'));
  const storyAvatar = story?.avatar || allUsers?.find(u => u.id === story?.userId)?.avatar || currentUser?.avatar;

  const isVideoStory = !!(story?.videoUrl);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setProgress(0);
    // For video stories, timer is driven by onTimeUpdate; fallback to 30s
    if (isVideoStory) return;
    const step = 100 / (5000 / 50);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p + step >= 100) { clearInterval(intervalRef.current); goNext(); return 100; }
        return p + step;
      });
    }, 50);
  };

  useEffect(() => {
    setVideoError(false);
    startTimer();
    if (story && currentUser && !isOwnStory) viewStory(story.id);
    return () => clearInterval(intervalRef.current);
  }, [idx]);

  const goNext = () => { if (idx < allStories.length-1) setIdx(i=>i+1); else onClose(); };
  const goPrev = () => { if (idx > 0) setIdx(i=>i-1); else { setProgress(0); startTimer(); } };

  const handleReact = (emoji) => {
    if (!story || isOwnStory) return;
    reactToStory(story.id, emoji);
    setFloatEmoji(emoji);
    setTimeout(() => setFloatEmoji(null), 900);
  };

  const handleReply = () => {
    if (!reply.trim() || !story || !currentUser) return;
    const contact = contacts.find(c => c.id === story.userId);
    if (contact) {
      const prev = loadMsgs(currentUser.id, story.userId);
      saveMsgs(currentUser.id, story.userId, [...prev, {
        id: Date.now(), from: currentUser.id,
        text: `📸 ${t(lang,'স্টোরি রিপ্লাই','Story reply')}: ${reply.trim()}`, time: Date.now(),
      }]);
      openChat(contact);
    }
    setReply(''); onClose();
  };

  const handleDelete = () => {
    if (story) deleteStory(story.id);
    setShowOptions(false);
    if (allStories.length <= 1) { onClose(); return; }
    if (idx >= allStories.length-1) setIdx(i=>i-1);
  };

  if (!story) return null;
  const hasImage = !!story.image && !isVideoStory;
  const showVideo = isVideoStory && !videoError;

  return (
    <>
      <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center" onClick={onClose}>
        <div className="relative overflow-hidden"
          style={{ width:'100%', maxWidth:'420px', height:'100%', maxHeight:'100dvh',
            background: (hasImage || showVideo) ? '#111' : (story.bg||'linear-gradient(145deg,#1a5c2a,#2d8a3a)') }}
          onClick={e => e.stopPropagation()}>

          {/* Video story */}
          {showVideo && (
            <video
              ref={videoRef}
              src={story.videoUrl}
              autoPlay
              muted={false}
              playsInline
              loop={false}
              className="absolute inset-0 w-full h-full object-contain"
              onError={() => setVideoError(true)}
              onEnded={() => goNext()}
              onTimeUpdate={() => {
                const v = videoRef.current;
                if (v && v.duration) setProgress((v.currentTime / v.duration) * 100);
              }}
            />
          )}
          {/* Fallback: video error — show thumbnail */}
          {isVideoStory && videoError && story.thumbnail && (
            <img src={story.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}

          {hasImage && <img src={story.image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          {(hasImage || showVideo) && <div className="absolute inset-0 bg-black/25 pointer-events-none" />}

          {/* Progress */}
          <div className="absolute top-3 left-3 right-14 z-20 flex gap-1">
            {allStories.map((_,i) => (
              <div key={i} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full"
                  style={{ width: i<idx?'100%':i===idx?`${progress}%`:'0%',
                    transition: i===idx?'width 50ms linear':'none' }} />
              </div>
            ))}
          </div>

          {/* Top buttons */}
          <div className="absolute top-2 right-2 z-20 flex gap-1.5">
            {isOwnStory && (
              <button onClick={() => { clearInterval(intervalRef.current); setShowOptions(true); }}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90">
                <FaEllipsisH className="text-white text-[13px]" />
              </button>
            )}
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center active:scale-90">
              <FaTimes className="text-white text-[13px]" />
            </button>
          </div>

          {/* User info */}
          <div className="absolute top-9 left-3 z-20 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-400 shadow flex-shrink-0">
              <img src={storyAvatar} alt={story.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-[14px] drop-shadow-lg">{story.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-white/70 text-[11px]">{timeLabel(story.createdAt, lang)}</p>
                {story.privacy && story.privacy !== 'public' && (
                  <span className="text-[9px] text-white/70 bg-black/30 rounded-full px-1.5 py-0.5">
                    {pv?.icon}
                  </span>
                )}
              </div>
            </div>
            {isOwnStory && (
              <div className="ml-1 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                <FaEye className="text-white/80 text-[10px]" />
                <span className="text-white text-[11px] font-bold">{viewerCount}</span>
              </div>
            )}
          </div>

          {/* Center content */}
          {!hasImage && !isVideoStory && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-10 pb-20">
              {story.emoji && <span style={{ fontSize:'62px' }} className="mb-5 drop-shadow-2xl">{story.emoji}</span>}
              {story.arabic && (
                <p className="arabic text-white drop-shadow-lg leading-loose mb-4"
                  style={{ fontSize:story.fontSize||'22px', color:story.textColor||'#fff',
                    textShadow:'0 2px 8px rgba(0,0,0,0.4)' }}>
                  {story.arabic}
                </p>
              )}
              {story.text && (
                <p className="text-white/95 drop-shadow leading-relaxed"
                  style={{ fontSize:story.fontSize||'16px', color:story.textColor||'#fff',
                    textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>
                  {story.text}
                </p>
              )}
            </div>
          )}

          {(hasImage || isVideoStory) && story.text && (
            <div className="absolute z-10" style={{ bottom: isOwnStory?'72px':'108px', left:'16px', right:'16px' }}>
              <div className="bg-black/55 backdrop-blur-md rounded-2xl px-4 py-3 text-center shadow-lg">
                <p className="text-white text-[15px] leading-relaxed">{story.text}</p>
              </div>
            </div>
          )}

          {/* Float emoji */}
          {floatEmoji && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <span style={{ fontSize:'76px', animation:'story-float 0.9s ease-out forwards' }}>{floatEmoji}</span>
            </div>
          )}

          {/* Tap zones */}
          <button className="absolute inset-y-0 left-0 w-1/3 z-[15]" onClick={e=>{e.stopPropagation();goPrev();}} />
          <button className="absolute inset-y-0 right-0 w-1/3 z-[15]" onClick={e=>{e.stopPropagation();goNext();}} />

          {/* Nav arrows desktop */}
          {idx > 0 && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-[16] w-8 h-8 rounded-full bg-black/30 hidden sm:flex items-center justify-center pointer-events-none">
              <FaChevronLeft className="text-white text-sm" />
            </div>
          )}
          {idx < allStories.length-1 && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-[16] w-8 h-8 rounded-full bg-black/30 hidden sm:flex items-center justify-center pointer-events-none">
              <FaChevronRight className="text-white text-sm" />
            </div>
          )}

          {/* Bottom — others' story */}
          {!isOwnStory && (
            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3"
              style={{ paddingBottom:'calc(12px + env(safe-area-inset-bottom,0px)',
                background:'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 100%)' }}>
              <div className="flex gap-1.5 justify-center mb-3">
                {REACTIONS.map(emoji => (
                  <button key={emoji} onClick={() => handleReact(emoji)}
                    className={`text-[20px] w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-125 backdrop-blur-sm ${
                      myReaction===emoji?'bg-white/40 ring-2 ring-white scale-110':'bg-black/25 opacity-80 hover:opacity-100'
                    }`}>
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-green-400">
                  <img src={currentUser?.avatar} alt="me" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex items-center bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-2">
                  <input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleReply()}
                    placeholder={`${t(lang,'রিপ্লাই করুন','Reply to')} ${story.name}…`}
                    className="flex-1 bg-transparent outline-none text-white placeholder-white/55 text-[14px] min-w-0"
                    style={{ fontSize:'16px' }} onClick={e=>e.stopPropagation()} />
                  {reply.trim() && (
                    <button onClick={e=>{e.stopPropagation();handleReply();}}
                      className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 ml-2 active:scale-90">
                      <FaPaperPlane className="text-white text-[11px]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom — own story */}
          {isOwnStory && (
            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3"
              style={{ paddingBottom:'calc(12px + env(safe-area-inset-bottom,0px)' }}>
              <button onClick={()=>{clearInterval(intervalRef.current);setShowOptions(true);}}
                className="w-full py-2.5 rounded-xl bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[13px] font-bold flex items-center justify-center gap-2 active:scale-95">
                <FaEllipsisH className="text-[11px]" />
                {t(lang,'স্টোরি অপশন','Story Options')}
              </button>
            </div>
          )}

          {/* Counter */}
          <div className="absolute z-20 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1"
            style={{ bottom: isOwnStory?'60px':'110px', left:'50%', transform:'translateX(-50%)' }}>
            <p className="text-white text-[11px] font-bold">{idx+1} / {allStories.length}</p>
          </div>
        </div>
      </div>

      {showOptions && (
        <StoryOptionsSheet story={story}
          onClose={()=>{setShowOptions(false);startTimer();}}
          onDelete={handleDelete}
          onPrivacyChange={pv=>updateStory(story.id,{privacy:pv})} />
      )}
    </>
  );
}

// ─── Create Story Modal ───────────────────────────────────────────────────────
function CreateStoryModal({ onClose }) {
  const { addStory, lang, currentUser } = useApp();
  const [tab,     setTab]     = useState('photo');
  const [privacy, setPrivacy] = useState('public');

  const [photo,        setPhoto]        = useState(null);
  const [videoUrl,     setVideoUrl]     = useState(null);
  const [videoThumb,   setVideoThumb]   = useState(null);
  const [isVideo,      setIsVideo]      = useState(false);
  const [photoCaption, setPhotoCaption] = useState('');
  const [loading,      setLoading]      = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const fileRef = useRef(null);

  const [textBg,      setTextBg]      = useState(BG_OPTIONS[0]);
  const [textContent, setTextContent] = useState('');
  const [textColor,   setTextColor]   = useState('#ffffff');
  const [fontSize,    setFontSize]    = useState(FONT_SIZES[1]);
  const [sticker,     setSticker]     = useState('');

  const [islamicBg,      setIslamicBg]      = useState(BG_OPTIONS[0]);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [islamicCaption, setIslamicCaption] = useState('');

  const processFile = async (file) => {
    if (!file) return;
    setLoading(true);
    if (file.type.startsWith('video/')) {
      const blobUrl = URL.createObjectURL(file);
      const thumb = await captureVideoThumbnail(blobUrl);
      setVideoUrl(blobUrl); setVideoThumb(thumb); setPhoto(null); setIsVideo(true);
    } else {
      const compressed = await compressImage(file);
      setPhoto(compressed); setVideoUrl(null); setVideoThumb(null); setIsVideo(false);
    }
    setLoading(false);
  };

  const handleFile = async (e) => { await processFile(e.target.files[0]); e.target.value = ''; };
  const handleDrop = async (e) => {
    e.preventDefault(); setDragOver(false);
    await processFile(e.dataTransfer.files[0]);
  };

  const clearMedia = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setPhoto(null); setVideoUrl(null); setVideoThumb(null); setIsVideo(false);
  };

  const canPost = (tab==='photo'&&(photo||videoUrl))||(tab==='text'&&textContent.trim())||tab==='islamic';

  const handlePost = () => {
    if (!canPost) return;
    if (tab==='photo') {
      if (isVideo && videoUrl)
        addStory({ type:'video', videoUrl, thumbnail:videoThumb, image:videoThumb, text:photoCaption.trim(), bg:'#000', emoji:'🎬', label:t(lang,'ভিডিও','Video'), privacy });
      else
        addStory({ type:'photo', image:photo, text:photoCaption.trim(), bg:'#000', emoji:'📸', label:t(lang,'ছবি','Photo'), privacy });
    } else if (tab==='text')
      addStory({ type:'text', bg:textBg.bg, text:textContent.trim(), textColor, fontSize:fontSize.size, emoji:sticker||'✍️', label:t(lang,'টেক্সট','Text'), privacy });
    else
      addStory({ type:'islamic', bg:islamicBg.bg, label:t(lang,selectedPreset.bn,selectedPreset.en), arabic:selectedPreset.arabic, emoji:selectedPreset.emoji, text:islamicCaption.trim(), privacy });
    onClose();
  };

  const TABS = [
    { id:'photo',   icon:<FaCamera />,  bn:'ছবি/ভিডিও', en:'Photo/Video' },
    { id:'text',    icon:'✍️',          bn:'টেক্সট',     en:'Text' },
    { id:'islamic', icon:'📖',          bn:'ইসলামিক',    en:'Islamic' },
  ];

  // Live preview content (shown in left panel and mobile top strip)
  const PreviewFill = ({ compact }) => {
    const fs = compact ? '10px' : '16px';
    const es = compact ? '26px' : '40px';
    if (tab === 'photo') {
      if (loading) return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
      if (isVideo && videoUrl) return (
        <div className="w-full h-full bg-black relative">
          <video src={videoUrl} muted autoPlay playsInline loop className="w-full h-full object-contain" />
          <div className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-0.5 flex items-center gap-1">
            <FaPlay className="text-white text-[8px]" /><span className="text-white font-bold" style={{fontSize:'9px'}}>VIDEO</span>
          </div>
          {photoCaption && <div className="absolute bottom-2 left-2 right-2 bg-black/60 rounded-xl px-2 py-1 text-center">
            <p className="text-white" style={{fontSize:'10px'}}>{photoCaption}</p>
          </div>}
        </div>
      );
      if (photo) return (
        <div className="w-full h-full relative">
          <img src={photo} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          {photoCaption && <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-xl px-2 py-1 text-center">
            <p className="text-white" style={{fontSize:'10px'}}>{photoCaption}</p>
          </div>}
        </div>
      );
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{background:'linear-gradient(145deg,#1a5c2a,#2d8a3a)'}}>
          <FaCamera className="text-white/50" style={{fontSize: compact?'22px':'32px'}} />
          <p className="text-white/40 text-center px-2" style={{fontSize:'10px'}}>{t(lang,'ছবি/ভিডিও বেছে নিন','Choose photo/video')}</p>
        </div>
      );
    }
    if (tab === 'text') return (
      <div className="w-full h-full flex flex-col items-center justify-center px-3" style={{background: textBg.bg}}>
        {sticker && <span style={{fontSize: es}} className="mb-2 drop-shadow-lg">{sticker}</span>}
        {textContent
          ? <p className="text-center leading-snug drop-shadow-lg" style={{color: textColor, fontSize: compact ? Math.min(parseInt(fontSize.size),18)+'px' : fontSize.size}}>
              {textContent.slice(0,60)}{textContent.length>60?'…':''}
            </p>
          : <p className="text-white/30" style={{fontSize:'11px'}}>{t(lang,'প্রিভিউ','Preview')}</p>}
      </div>
    );
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-3" style={{background: islamicBg.bg}}>
        <span style={{fontSize: es}} className="mb-2 drop-shadow-lg">{selectedPreset.emoji}</span>
        <p className="arabic text-white text-center leading-loose drop-shadow-lg" style={{fontSize: fs}}>{selectedPreset.arabic}</p>
        {islamicCaption && <p className="text-white/70 text-center mt-1" style={{fontSize:'10px'}}>{islamicCaption.slice(0,40)}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-[820px] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col sm:flex-row bg-white dark:bg-[#0f2313]">

        {/* ── LEFT: Story preview panel (desktop only) ── */}
        <div className="hidden sm:flex flex-col flex-shrink-0 bg-[#111827]" style={{width:'265px'}}>
          {/* Panel header */}
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-white/50 text-[11px] uppercase tracking-widest font-bold">{t(lang,'প্রিভিউ','Preview')}</p>
            <p className="text-white/80 text-[13px] font-semibold mt-0.5">{t(lang,'এভাবে দেখাবে','How it will look')}</p>
          </div>
          {/* Phone frame preview */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative rounded-[28px] overflow-hidden shadow-2xl" style={{width:'158px', height:'280px', border:'4px solid #374151', background:'#000'}}>
              {/* Story content */}
              <PreviewFill compact />
              {/* Overlay: progress bar */}
              <div className="absolute top-2.5 left-2.5 right-2.5 z-20 h-[2px] rounded-full overflow-hidden bg-white/25">
                <div className="h-full bg-white rounded-full w-[40%]" />
              </div>
              {/* Overlay: user info */}
              <div className="absolute top-5 left-2 right-2 z-20 flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-green-400 flex-shrink-0">
                  <img src={currentUser?.avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-white font-bold drop-shadow" style={{fontSize:'9px'}}>{currentUser?.name?.split(' ')[0]}</p>
                  <p className="text-white/60" style={{fontSize:'8px'}}>{t(lang,'এইমাত্র','Just now')}</p>
                </div>
              </div>
              {/* Privacy badge */}
              <div className="absolute top-5 right-2 z-20 bg-black/50 rounded-full w-5 h-5 flex items-center justify-center">
                <span style={{fontSize:'9px'}}>{PRIVACY_OPTIONS.find(p=>p.id===privacy)?.icon}</span>
              </div>
            </div>
          </div>
          {/* Privacy selector (desktop, below phone) */}
          <div className="px-4 pb-5">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2 font-bold">{t(lang,'কে দেখবে','Audience')}</p>
            <div className="flex gap-1.5">
              {PRIVACY_OPTIONS.map(p => (
                <button key={p.id} onClick={() => setPrivacy(p.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition-all active:scale-95 ${
                    privacy === p.id
                      ? 'border-green-500 bg-green-900/50 text-white'
                      : 'border-white/10 bg-white/5 text-white/50'
                  }`}>
                  <span style={{fontSize:'16px'}}>{p.icon}</span>
                  <span style={{fontSize:'9px'}} className="font-bold leading-none">{t(lang,p.bn,p.en)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Controls panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b border-green-100 dark:border-[#1a4a20] bg-white dark:bg-[#0f2313]">
            <div>
              <h2 className="font-black text-[17px] text-gray-800 dark:text-[#e8f5e9]">
                {t(lang,'স্টোরি তৈরি করুন ✨','Create Your Story ✨')}
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] mt-0.5">
                {t(lang,'২৪ ঘন্টার বদলে ৭ দিন থাকবে','Stays for 7 days')}
              </p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#142d18] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#1a3d20] active:scale-90 transition-all">
              <FaTimes className="text-gray-500 dark:text-gray-400 text-sm" />
            </button>
          </div>

          {/* Mobile preview strip */}
          <div className="sm:hidden flex-shrink-0 relative overflow-hidden" style={{height:'160px'}}>
            <PreviewFill compact />
            {/* User overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-400">
                <img src={currentUser?.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold text-[12px] drop-shadow">{currentUser?.name?.split(' ')[0]}</p>
                <p className="text-white/60 text-[10px]">{t(lang,'এইমাত্র','Just now')}</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="absolute top-2 left-3 right-3 h-[2.5px] rounded-full bg-white/25 z-10">
              <div className="h-full bg-white rounded-full w-[38%]" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-shrink-0 bg-white dark:bg-[#0f2313] border-b border-green-100 dark:border-[#1a4a20]">
            {TABS.map(tb => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-bold transition-all relative ${
                  tab === tb.id
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-400 dark:text-[#4a7a50]'
                }`}>
                <span className="text-[15px]">{tb.icon}</span>
                <span>{t(lang, tb.bn, tb.en)}</span>
                {tab === tb.id && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full bg-green-600" />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">

            {/* ── PHOTO/VIDEO TAB ── */}
            {tab === 'photo' && (
              <div className="p-4 space-y-4">
                {!photo && !videoUrl ? (
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl cursor-pointer overflow-hidden transition-all ${
                      dragOver ? 'scale-[0.99] brightness-105' : ''
                    }`}
                    style={{ height:'230px', border: `2px dashed ${dragOver ? '#16a34a' : '#4ade80'}`,
                      background: dragOver ? 'rgba(22,163,74,0.08)' : 'transparent' }}>
                    {loading ? (
                      <><div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-green-600 dark:text-green-400 text-[13px] font-medium">{t(lang,'প্রস্তুত হচ্ছে...','Preparing...')}</p></>
                    ) : (
                      <>
                        <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-lg"
                          style={{background:'linear-gradient(135deg,#1a5c2a,#2d8a3a)'}}>
                          <FaCamera className="text-white text-[28px]" />
                        </div>
                        <div className="text-center px-4">
                          <p className="font-black text-gray-800 dark:text-[#e8f5e9] text-[16px]">
                            {t(lang,'ছবি বা ভিডিও বেছে নিন','Pick a Photo or Video')}
                          </p>
                          <p className="text-gray-400 dark:text-[#4a7a50] text-[12px] mt-1">
                            {t(lang,'ক্লিক করুন বা টেনে ফেলুন','Click or drag & drop here')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[12px] font-bold shadow"
                            style={{background:'linear-gradient(135deg,#1a5c2a,#2d7a3a)'}}>
                            <FaCamera className="text-[11px]" /> {t(lang,'ছবি','Photo')}
                          </div>
                          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[12px] font-bold shadow"
                            style={{background:'linear-gradient(135deg,#0a3d5c,#0e6090)'}}>
                            <FaPlay className="text-[11px]" /> {t(lang,'ভিডিও','Video')}
                          </div>
                        </div>
                        <p className="text-gray-300 dark:text-[#2a5a30] text-[11px]">
                          JPG, PNG, GIF, MP4, MOV
                        </p>
                      </>
                    )}
                  </div>
                ) : isVideo && videoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black">
                    <video src={videoUrl} muted autoPlay playsInline loop className="w-full object-contain" style={{maxHeight:'280px'}} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 z-10">
                      <FaPlay className="text-white text-[9px]" />
                      <span className="text-white text-[10px] font-bold">{t(lang,'ভিডিও','VIDEO')}</span>
                    </div>
                    {photoCaption && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 text-center">
                        <p className="text-white text-[13px]">{photoCaption}</p>
                      </div>
                    )}
                    <button onClick={clearMedia}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center active:scale-90 z-10">
                      <FaTimes className="text-white text-[11px]" />
                    </button>
                    <button onClick={() => fileRef.current?.click()}
                      className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 active:scale-95 z-10 flex items-center gap-1.5">
                      <FaCamera className="text-white text-[10px]" />
                      <span className="text-white text-[11px] font-bold">{t(lang,'পরিবর্তন','Change')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{height:'280px'}}>
                    <img src={photo} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {photoCaption && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 text-center">
                        <p className="text-white text-[13px]">{photoCaption}</p>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button onClick={() => fileRef.current?.click()}
                        className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 active:scale-95">
                        <FaCamera className="text-white text-[10px]" />
                        <span className="text-white text-[11px] font-bold">{t(lang,'পরিবর্তন','Change')}</span>
                      </button>
                      <button onClick={clearMedia}
                        className="w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90">
                        <FaTrash className="text-white text-[10px]" />
                      </button>
                    </div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />

                {/* Caption */}
                <div className="relative">
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-1.5">
                    💬 {t(lang,'ক্যাপশন যোগ করুন (ঐচ্ছিক)','Add Caption (Optional)')}
                  </label>
                  <input value={photoCaption} onChange={e => setPhotoCaption(e.target.value)}
                    placeholder={t(lang,'কিছু লিখুন...','Write something...')}
                    maxLength={150}
                    className="w-full bg-gray-50 dark:bg-[#142d18] border-2 border-gray-100 dark:border-[#1a4a20] rounded-xl px-4 py-3 text-[14px] text-gray-800 dark:text-[#e8f5e9] placeholder-gray-300 dark:placeholder-[#2a6a30] outline-none focus:border-green-400 transition-colors"
                    style={{fontSize:'16px'}} />
                  <span className="absolute right-3 bottom-3 text-[10px] text-gray-300 dark:text-[#2a5a30]">{photoCaption.length}/150</span>
                </div>

                {/* Mobile privacy */}
                <div className="sm:hidden">
                  <PrivacyRow value={privacy} onChange={setPrivacy} />
                </div>
              </div>
            )}

            {/* ── TEXT TAB ── */}
            {tab === 'text' && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-2">
                    🎨 {t(lang,'ব্যাকগ্রাউন্ড','Background')}
                  </label>
                  <BgPicker selected={textBg} onSelect={setTextBg} />
                </div>

                <div className="relative">
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-1.5">
                    ✍️ {t(lang,'আপনার কথা লিখুন','Write your thoughts')}
                  </label>
                  <textarea value={textContent} onChange={e => setTextContent(e.target.value)}
                    placeholder={t(lang,'মনের কথা লিখুন...','Write from your heart...')}
                    rows={3} maxLength={200}
                    className="w-full bg-gray-50 dark:bg-[#142d18] border-2 border-gray-100 dark:border-[#1a4a20] rounded-xl px-4 py-3 text-[14px] text-gray-800 dark:text-[#e8f5e9] placeholder-gray-300 dark:placeholder-[#2a6a30] outline-none focus:border-green-400 transition-colors resize-none"
                    style={{fontSize:'16px'}} />
                  <span className="absolute right-3 bottom-3 text-[10px] text-gray-300 dark:text-[#2a5a30]">{textContent.length}/200</span>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-2">
                    🖊️ {t(lang,'টেক্সট রঙ','Text Color')}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {TEXT_COLORS.map(c => (
                      <button key={c} onClick={() => setTextColor(c)}
                        className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all"
                        style={{ background: c,
                          outline: textColor===c ? '3px solid #16a34a' : '2px solid transparent',
                          outlineOffset: '2px',
                          boxShadow: textColor===c ? '0 0 0 2px white' : '0 0 0 1px rgba(0,0,0,0.12)' }}>
                        {textColor === c && <FaCheck style={{color: c==='#ffffff'?'#1a5c2a':'white', fontSize:'9px'}} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-2">
                    🔡 {t(lang,'ফন্ট সাইজ','Font Size')}
                  </label>
                  <div className="flex gap-2">
                    {FONT_SIZES.map(f => (
                      <button key={f.en} onClick={() => setFontSize(f)}
                        className={`flex-1 py-2 rounded-xl text-[12px] font-bold border-2 transition-all active:scale-95 ${
                          fontSize.en === f.en
                            ? 'bg-green-700 text-white border-green-700 shadow-md'
                            : 'bg-white dark:bg-[#142d18] border-gray-100 dark:border-[#1a4a20] text-gray-600 dark:text-green-400'
                        }`}>
                        {t(lang, f.bn, f.en)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-2">
                    🌟 {t(lang,'স্টিকার যোগ করুন','Add Sticker')}
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {EMOJI_STICKERS.map(e => (
                      <button key={e} onClick={() => setSticker(sticker===e?'':e)}
                        className={`w-10 h-10 rounded-xl text-[20px] flex items-center justify-center transition-all active:scale-90 ${
                          sticker===e
                            ? 'bg-green-100 dark:bg-green-900/50 scale-110 shadow-md ring-2 ring-green-500'
                            : 'bg-gray-50 dark:bg-[#142d18] hover:bg-green-50 dark:hover:bg-[#1a3d20]'
                        }`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:hidden">
                  <PrivacyRow value={privacy} onChange={setPrivacy} />
                </div>
              </div>
            )}

            {/* ── ISLAMIC TAB ── */}
            {tab === 'islamic' && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-2">
                    🎨 {t(lang,'ব্যাকগ্রাউন্ড','Background')}
                  </label>
                  <BgPicker selected={islamicBg} onSelect={setIslamicBg} />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-2">
                    📖 {t(lang,'আরবি টেক্সট বেছে নিন','Choose Arabic Text')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p, i) => (
                      <button key={i} onClick={() => setSelectedPreset(p)}
                        className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 text-left transition-all active:scale-95 ${
                          selectedPreset.arabic === p.arabic
                            ? 'bg-green-700 text-white border-green-700 shadow-md'
                            : 'bg-white dark:bg-[#142d18] border-gray-100 dark:border-[#1a4a20] text-gray-700 dark:text-[#c8e6c9] hover:border-green-300'
                        }`}>
                        <span className="text-[20px] flex-shrink-0">{p.emoji}</span>
                        <span className="text-[12px] font-semibold leading-tight">{t(lang, p.bn, p.en)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[12px] font-bold text-green-700 dark:text-green-400 mb-1.5">
                    💬 {t(lang,'ক্যাপশন (ঐচ্ছিক)','Caption (Optional)')}
                  </label>
                  <input value={islamicCaption} onChange={e => setIslamicCaption(e.target.value)}
                    placeholder={t(lang,'আপনার অনুভূতি লিখুন...','Write your feelings...')}
                    maxLength={120}
                    className="w-full bg-gray-50 dark:bg-[#142d18] border-2 border-gray-100 dark:border-[#1a4a20] rounded-xl px-4 py-3 text-[14px] text-gray-800 dark:text-[#e8f5e9] placeholder-gray-300 dark:placeholder-[#2a6a30] outline-none focus:border-green-400 transition-colors"
                    style={{fontSize:'16px'}} />
                </div>

                <div className="sm:hidden">
                  <PrivacyRow value={privacy} onChange={setPrivacy} />
                </div>
              </div>
            )}
          </div>

          {/* Footer: Share button */}
          <div className="px-4 pt-3 pb-4 flex-shrink-0 bg-white dark:bg-[#0f2313] border-t border-gray-100 dark:border-[#1a4a20]">
            {/* Mobile privacy hint */}
            <div className="sm:hidden flex items-center gap-2 mb-2.5">
              <span className="text-[15px]">{PRIVACY_OPTIONS.find(p => p.id===privacy)?.icon}</span>
              <span className="text-[11px] text-gray-400 dark:text-[#4a7a50]">
                {t(lang, PRIVACY_OPTIONS.find(p=>p.id===privacy)?.descBn||'', PRIVACY_OPTIONS.find(p=>p.id===privacy)?.descEn||'')}
              </span>
            </div>
            <button onClick={handlePost} disabled={!canPost}
              className={`w-full py-4 rounded-xl font-black text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2 ${
                canPost ? 'shadow-lg hover:brightness-110' : ''
              }`}
              style={{
                background: canPost ? 'linear-gradient(135deg,#1a5c2a,#2d8a3a)' : '#ccc',
                boxShadow: canPost ? '0 6px 24px rgba(26,92,42,0.45)' : 'none',
              }}>
              {canPost
                ? <><FaPaperPlane className="text-[13px]" /> {t(lang,'শেয়ার করুন — ইনশাআল্লাহ 🌙','Share to Story 🌙')}</>
                : <>{tab==='photo' ? `📷 ${t(lang,'আগে ছবি/ভিডিও বেছে নিন','Choose photo/video first')}` : `✍️ ${t(lang,'কিছু লিখুন','Write something')}`}</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Stories Component ───────────────────────────────────────────────────
export default function Stories() {
  const { currentUser, allUsers, stories, lang, contacts } = useApp();
  const [viewerData, setViewerData] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const friendIds = currentUser?.friendIds || [];

  const myStory = stories.find(s => s.userId === currentUser?.id) || null;

  const otherStories = allUsers
    .filter(u => u.id !== currentUser?.id)
    .slice(0, 7)
    .map((u, i) => {
      const userStory = stories.find(s => {
        if (s.userId !== u.id) return false;
        const pv = s.privacy || 'public';
        if (pv === 'public')  return true;
        if (pv === 'friends') return friendIds.includes(u.id);
        return false;
      });
      if (userStory) return { ...userStory, avatar: userStory.avatar || u.avatar };

      const DEMO = [
        { emoji:'📖', arabic:'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا',     bn:'কুরআন',       en:'Quran',    bg:'linear-gradient(145deg,#1a5c2a,#2d8a3a)' },
        { emoji:'📜', arabic:'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',  bn:'হাদিস',       en:'Hadith',   bg:'linear-gradient(145deg,#0a3d5c,#0e6090)' },
        { emoji:'🤲', arabic:'ذِكْرُ اللَّهِ',                        bn:'যিকর',        en:'Dhikr',    bg:'linear-gradient(145deg,#2d4a0a,#3d7a1a)' },
        { emoji:'🌙', arabic:'إِنَّ مَعَ الْعُسْرِ يُسْرًا',          bn:'রিমাইন্ডার', en:'Reminder', bg:'linear-gradient(145deg,#3d1a5c,#6a2d9a)' },
        { emoji:'✨', arabic:'سُبْحَانَ اللَّهِ',                      bn:'তাসবীহ',      en:'Tasbih',   bg:'linear-gradient(145deg,#5c2d0a,#a04c1a)' },
        { emoji:'🌿', arabic:'الْحَمْدُ لِلَّهِ',                      bn:'হামদ',         en:'Praise',   bg:'linear-gradient(145deg,#0a3d2d,#1a7a5c)' },
        { emoji:'💚', arabic:'لَا إِلَهَ إِلَّا اللَّهُ',              bn:'কালেমা',      en:'Kalema',   bg:'linear-gradient(145deg,#1a3d0a,#2d6a1a)' },
      ];
      const d = DEMO[i % DEMO.length];
      return { id:`demo_${u.id}`, userId:u.id, name:u.name.split(' ')[0], avatar:u.avatar,
        createdAt:Date.now()-(i+1)*3600000, label:t(lang,d.bn,d.en), ...d };
    });

  const allStories = [...(myStory?[myStory]:[]), ...otherStories];
  const openViewer = (story) => {
    const idx = allStories.findIndex(s => s.id === story.id);
    setViewerData({ startIdx:Math.max(0,idx) });
  };

  const myViewerCount = myStory ? (myStory.views||[]).length : 0;
  const pvIcon = myStory ? PRIVACY_OPTIONS.find(p=>p.id===(myStory.privacy||'public'))?.icon : null;

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth:'none', msOverflowStyle:'none' }}>

        {/* My story / Create card */}
        <div className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow group border border-green-200 dark:border-[#1a4a20] bg-white dark:bg-[#0f2313] active:scale-[0.97] transition-transform"
          style={{ width:'108px', height:'185px' }}
          onClick={() => myStory ? openViewer(myStory) : setShowCreate(true)}>

          <div className="w-full overflow-hidden flex items-center justify-center relative"
            style={{ height:'128px', background:myStory?((myStory.image||myStory.thumbnail)?'#000':myStory.bg):'linear-gradient(145deg,#1a5c2a,#2d7a3a)' }}>
            {myStory
              ? (myStory.thumbnail || myStory.image)
                ? <>
                    <img src={myStory.thumbnail || myStory.image} alt="my story" className="w-full h-full object-cover" />
                    {myStory.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-black/55 flex items-center justify-center">
                          <FaPlay className="text-white text-[12px] ml-0.5" />
                        </div>
                      </div>
                    )}
                  </>
                : <div className="w-full h-full flex flex-col items-center justify-center px-1">
                    {myStory.emoji && <span className="text-[28px] drop-shadow-lg">{myStory.emoji}</span>}
                    <p className="arabic text-white/90 text-[9px] text-center leading-snug mt-1 px-1">
                      {(myStory.arabic||myStory.text||'').slice(0,28)}
                    </p>
                  </div>
              : currentUser
                ? <img src={currentUser.avatar} alt="me" className="w-full h-full object-cover" />
                : <span className="text-[48px]">☪️</span>}
          </div>

          <div className="flex flex-col items-center justify-end pb-2 pt-5 bg-white dark:bg-[#0f2313]" style={{ height:'57px' }}>
            <div className="absolute flex items-center justify-center rounded-full border-[3px] border-white dark:border-[#0f2313] shadow-md"
              style={{ bottom:'40px', width:'34px', height:'34px', background:myStory?'#16a34a':'#1a5c2a' }}>
              {myStory
                ? <FaChevronRight className="text-white" style={{ fontSize:'10px' }} />
                : <FaPlus className="text-white" style={{ fontSize:'11px' }} />}
            </div>
            <span className="text-[10px] font-bold text-green-800 dark:text-green-400 text-center leading-tight">
              {myStory ? t(lang,'আমার স্টোরি','Your Story') : t(lang,'স্টোরি তৈরি','Create Story')}
            </span>
          </div>

          {/* Viewer badge */}
          {myStory && myViewerCount > 0 && (
            <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-0.5 bg-black/55 rounded-full px-1.5 py-0.5">
              <FaEye className="text-white text-[9px]" />
              <span className="text-white text-[9px] font-bold">{myViewerCount}</span>
            </div>
          )}
          {/* Privacy badge */}
          {myStory && pvIcon && myStory.privacy !== 'public' && (
            <div className="absolute top-1.5 right-6 z-10 bg-black/55 rounded-full w-4 h-4 flex items-center justify-center">
              <span className="text-[8px]">{pvIcon}</span>
            </div>
          )}
          {/* Add button */}
          <button onClick={e=>{e.stopPropagation();setShowCreate(true);}}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-[#0f2313] flex items-center justify-center z-10 shadow active:scale-90">
            <FaPlus className="text-white" style={{ fontSize:'7px' }} />
          </button>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 group-active:opacity-15 transition-opacity" />
        </div>

        {/* Other stories */}
        {otherStories.map(story => {
          const isVideoCard = !!story.videoUrl;
          const thumbSrc = isVideoCard ? story.thumbnail : story.image;
          return (
          <div key={story.id} onClick={()=>openViewer(story)}
            className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow group active:scale-[0.97] transition-transform"
            style={{ width:'108px', height:'185px', background:thumbSrc?'#000':story.bg }}>

            {thumbSrc && <img src={thumbSrc} alt={story.name} className="absolute inset-0 w-full h-full object-cover" />}
            {thumbSrc && <div className="absolute inset-0 bg-black/20" />}

            {/* Video play icon overlay */}
            {isVideoCard && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center">
                  <FaPlay className="text-white text-[14px] ml-0.5" />
                </div>
              </div>
            )}

            {/* Avatar with ring */}
            <div className="absolute top-3 left-3 z-10 rounded-full overflow-hidden"
              style={{ width:'36px', height:'36px',
                boxShadow:'0 0 0 2px #4ade80, 0 0 0 4px rgba(0,0,0,0.3)' }}>
              <img src={story.avatar || allUsers.find(u => u.id === story.userId)?.avatar} alt={story.name} className="w-full h-full object-cover" />
            </div>

            {/* Emoji badge */}
            {!thumbSrc && (
              <div className="absolute top-2.5 right-2 z-10 bg-black/25 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                <span style={{ fontSize:'11px' }}>{story.emoji}</span>
              </div>
            )}

            {/* Arabic text center */}
            {!thumbSrc && (
              <div className="absolute inset-0 flex items-center justify-center px-2">
                <p className="arabic text-white/90 text-center leading-loose drop-shadow-lg" style={{ fontSize:'12px' }}>
                  {story.arabic||story.text?.slice(0,40)}
                </p>
              </div>
            )}

            {/* Bottom gradient + name */}
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2.5 pt-8 z-10"
              style={{ background:'linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 100%)' }}>
              <p className="text-white/70 text-center leading-tight" style={{ fontSize:'9px' }}>{story.label}</p>
              <p className="text-white font-bold text-center leading-tight drop-shadow" style={{ fontSize:'11px' }}>{story.name}</p>
            </div>

            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity" />
          </div>
          );
        })}
      </div>

      {viewerData && (
        <StoryViewer allStories={allStories} startIdx={viewerData.startIdx}
          onClose={()=>setViewerData(null)} />
      )}
      {showCreate && <CreateStoryModal onClose={()=>setShowCreate(false)} />}
    </>
  );
}
