import { useState, useEffect, useRef } from 'react';
import {
  FaHeart, FaRegHeart, FaCopy, FaCheck, FaRedo, FaHandPointUp,
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { duaCategories } from '../data/duaData';

// ─── localStorage helpers ────────────────────────────────────────────────────
const FAV_KEY     = 'ub_dua_favorites';
const TASBIH_KEY  = 'ub_tasbih';

function loadFavs()    { try { return JSON.parse(localStorage.getItem(FAV_KEY))  || []; }   catch { return []; } }
function saveFavs(arr) { try { localStorage.setItem(FAV_KEY, JSON.stringify(arr)); } catch {} }

function loadTasbih()  {
  try {
    return JSON.parse(localStorage.getItem(TASBIH_KEY)) || {
      count: 0, dhikr: 0, target: 33,
    };
  } catch {
    return { count: 0, dhikr: 0, target: 33 };
  }
}
function saveTasbih(obj) { try { localStorage.setItem(TASBIH_KEY, JSON.stringify(obj)); } catch {} }

// ─── Preset dhikr list ───────────────────────────────────────────────────────
const DHIKR_LIST = [
  { arabic: 'سُبْحَانَ اللَّهِ',             bn: 'সুবহানাল্লাহ',      en: 'Glory be to Allah' },
  { arabic: 'الْحَمْدُ لِلَّهِ',             bn: 'আলহামদুলিল্লাহ',    en: 'All praise to Allah' },
  { arabic: 'اللَّهُ أَكْبَرُ',              bn: 'আল্লাহু আকবার',      en: 'Allah is the Greatest' },
  { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',    bn: 'লা ইলাহা ইল্লাল্লাহ', en: 'None worthy of worship but Allah' },
];

const TARGETS = [33, 100, 300, 1000];

// ─── Utility: build a flat list of every dua (for favorites lookup) ──────────
const ALL_DUAS = duaCategories.flatMap(cat =>
  cat.duas.map(d => ({ ...d, catId: cat.id, catEmoji: cat.emoji, catBn: cat.bn, catEn: cat.en }))
);

// ─── SVG progress ring ───────────────────────────────────────────────────────
function ProgressRing({ count, target, size = 180 }) {
  const r      = (size - 18) / 2;
  const circ   = 2 * Math.PI * r;
  const pct    = Math.min(count / target, 1);
  const offset = circ * (1 - pct);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#d4edda" strokeWidth={10} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={pct >= 1 ? '#f59e0b' : '#1a5c2a'}
        strokeWidth={10}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
    </svg>
  );
}

// ─── Single Dua Card ─────────────────────────────────────────────────────────
function DuaCard({ dua, lang, favIds, onToggleFav }) {
  const [copied, setCopied] = useState(false);
  const isFav = favIds.includes(dua.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(dua.arabic).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = dua.arabic;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="card mb-3 overflow-hidden fade-in"
      style={{ borderLeft: '4px solid #1a5c2a' }}>
      {/* Arabic text */}
      <div
        className="px-4 pt-4 pb-2"
        style={{ background: 'linear-gradient(135deg, #f0f9f1, #e8f5e9)' }}>
        <p
          className="arabic text-[22px] leading-loose text-green-900"
          style={{ direction: 'rtl', textAlign: 'right' }}>
          {dua.arabic}
        </p>
      </div>

      <div className="px-4 py-3">
        {/* Transliteration */}
        <p className="text-[13px] italic text-green-700 mb-2 leading-relaxed">
          {dua.transliteration}
        </p>

        {/* Bangla / English meaning */}
        <p className="text-[14px] text-gray-700 dark:text-[#c8e6c9] leading-relaxed mb-3">
          {lang === 'en' ? dua.en : dua.bn}
        </p>

        {/* Footer row: source + actions */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span
            className="text-[11px] font-semibold px-2 py-1 rounded-full"
            style={{ background: '#e8f5e9', color: '#1a5c2a' }}>
            📚 {dua.source}
          </span>

          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              title={lang === 'en' ? 'Copy Arabic' : 'আরবি কপি করুন'}
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border border-green-200 text-green-700 hover:bg-green-50 transition-colors">
              {copied
                ? <><FaCheck className="text-green-600" /> <span>{lang === 'en' ? 'Copied' : 'কপি হয়েছে'}</span></>
                : <><FaCopy /> <span>{lang === 'en' ? 'Copy' : 'কপি'}</span></>}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFav(dua)}
              title={isFav ? (lang === 'en' ? 'Remove from favorites' : 'ফেভারিট থেকে সরান') : (lang === 'en' ? 'Add to favorites' : 'ফেভারিটে যোগ করুন')}
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor: isFav ? '#e53e3e' : '#c3e6cb',
                color:       isFav ? '#e53e3e' : '#2d7a3a',
                background:  isFav ? '#fff5f5' : 'transparent',
              }}>
              {isFav ? <FaHeart /> : <FaRegHeart />}
              <span>{isFav ? (lang === 'en' ? 'Saved' : 'সংরক্ষিত') : (lang === 'en' ? 'Save' : 'সেভ')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function DuaPage() {
  const { lang } = useApp();

  // ── top-level tab: 'duas' | 'tasbih'
  const [mainTab, setMainTab] = useState('duas');

  // ── Duas section state
  const [selectedCatId, setSelectedCatId]   = useState('morning');
  const [duaSubTab,     setDuaSubTab]        = useState('all');   // 'all' | 'favorites'
  const [favIds,        setFavIds]           = useState(loadFavs);
  const [favDuas,       setFavDuas]          = useState(() => {
    const ids = loadFavs();
    return ALL_DUAS.filter(d => ids.includes(d.id));
  });

  // ── Tasbih section state
  const [tasbih,     setTasbih]     = useState(loadTasbih);
  const [pulse,      setPulse]      = useState(false);
  const [celebrated, setCelebrated] = useState(false);
  const celebrateTimerRef           = useRef(null);

  // persist tasbih
  useEffect(() => { saveTasbih(tasbih); }, [tasbih]);

  // clear celebration timer on unmount
  useEffect(() => () => clearTimeout(celebrateTimerRef.current), []);

  // ── Favorites helpers
  const toggleFav = (dua) => {
    setFavIds(prev => {
      const next = prev.includes(dua.id)
        ? prev.filter(id => id !== dua.id)
        : [...prev, dua.id];
      saveFavs(next);
      return next;
    });
    setFavDuas(prev => {
      const exists = prev.find(d => d.id === dua.id);
      if (exists) return prev.filter(d => d.id !== dua.id);
      const full = ALL_DUAS.find(d => d.id === dua.id);
      return full ? [...prev, full] : prev;
    });
  };

  // ── Tasbih helpers
  const increment = () => {
    if (navigator.vibrate) navigator.vibrate(30);
    setPulse(true);
    setTimeout(() => setPulse(false), 180);

    setTasbih(prev => {
      const next = prev.count + 1;
      const reached = next === prev.target;
      if (reached) {
        clearTimeout(celebrateTimerRef.current);
        setCelebrated(true);
        celebrateTimerRef.current = setTimeout(() => setCelebrated(false), 3000);
      }
      return { ...prev, count: next };
    });
  };

  const resetTasbih = () => {
    setCelebrated(false);
    setTasbih(prev => ({ ...prev, count: 0 }));
  };

  const selectDhikr = (idx) => {
    setCelebrated(false);
    setTasbih(prev => ({ count: 0, dhikr: idx, target: prev.target }));
  };

  const selectTarget = (t) => {
    setCelebrated(false);
    setTasbih(prev => ({ ...prev, target: t, count: 0 }));
  };

  // ── current category
  const currentCat = duaCategories.find(c => c.id === selectedCatId) || duaCategories[0];

  // ── displayed duas
  const displayedDuas = duaSubTab === 'favorites' ? favDuas : currentCat.duas;

  return (
    <div className="min-h-screen pb-4">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden mb-4 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0d3318 0%, #1a5c2a 55%, #2d7a3a 100%)' }}>
        <div className="px-5 py-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[38px]">🤲</span>
            <div>
              <h1 className="text-[22px] font-bold text-white leading-tight">
                {lang === 'en' ? 'Dua & Tasbih' : 'দোয়া ও তাসবীহ'}
              </h1>
              <p className="text-green-200 text-[12px]">
                {lang === 'en' ? 'Daily remembrance of Allah' : 'আল্লাহর যিকির ও দোয়া'}
              </p>
            </div>
          </div>
          <p className="arabic text-green-200 text-center text-[15px] mt-2 leading-loose">
            وَاذْكُرُوا اللَّهَ كَثِيرًا لَعَلَّكُمْ تُفْلِحُونَ
          </p>
          <p className="text-green-300 text-center text-[11px] mt-1">
            "আল্লাহকে বেশি বেশি স্মরণ কর, যাতে তোমরা সফলকাম হতে পার।" — সূরা আনফাল: ৪৫
          </p>
        </div>

        {/* ── Main Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex border-t border-green-600/40">
          {[
            { id: 'duas',   bn: 'দোয়া সমূহ',        en: 'Duas',    emoji: '🤲' },
            { id: 'tasbih', bn: 'তাসবীহ কাউন্টার', en: 'Tasbih',  emoji: '📿' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className="flex-1 py-3 text-[14px] font-bold transition-colors"
              style={{
                color:      mainTab === tab.id ? '#ffffff' : 'rgba(255,255,255,0.55)',
                borderBottom: mainTab === tab.id ? '3px solid #ffd700' : '3px solid transparent',
                background: mainTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}>
              {tab.emoji} {lang === 'en' ? tab.en : tab.bn}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  TAB 1: DUAS                                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {mainTab === 'duas' && (
        <div>
          {/* Dua sub-tabs: All / Favorites */}
          <div className="flex gap-2 mb-3">
            {[
              { id: 'all',       bn: 'সকল',        en: 'All' },
              { id: 'favorites', bn: `ফেভারিট (${favIds.length})`, en: `Favorites (${favIds.length})` },
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setDuaSubTab(st.id)}
                className="px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors border"
                style={{
                  background:   duaSubTab === st.id ? '#1a5c2a' : 'white',
                  color:        duaSubTab === st.id ? 'white'   : '#1a5c2a',
                  borderColor:  '#1a5c2a',
                }}>
                {lang === 'en' ? st.en : st.bn}
              </button>
            ))}
          </div>

          {/* Category pills — only shown on 'all' tab */}
          {duaSubTab === 'all' && (
            <div className="flex flex-wrap gap-2 mb-3">
              {duaCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-bold transition-all border"
                  style={{
                    background:  selectedCatId === cat.id
                      ? 'linear-gradient(135deg, #1a5c2a, #2d7a3a)'
                      : 'white',
                    color:       selectedCatId === cat.id ? 'white' : '#1a5c2a',
                    borderColor: selectedCatId === cat.id ? '#1a5c2a' : '#c3e6cb',
                    boxShadow:   selectedCatId === cat.id ? '0 2px 8px rgba(26,92,42,0.3)' : 'none',
                  }}>
                  <span>{cat.emoji}</span>
                  <span>{lang === 'en' ? cat.en : cat.bn}</span>
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded-full font-normal"
                    style={{
                      background: selectedCatId === cat.id ? 'rgba(255,255,255,0.25)' : '#e8f5e9',
                      color:      selectedCatId === cat.id ? 'white' : '#2d7a3a',
                    }}>
                    {cat.duas.length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Section label */}
          {duaSubTab === 'all' && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[20px]">{currentCat.emoji}</span>
              <h2 className="text-[16px] font-bold text-green-900 dark:text-[#e8f5e9]">
                {lang === 'en' ? currentCat.en : currentCat.bn}
              </h2>
              <span className="text-[12px] text-green-600">({currentCat.duas.length})</span>
            </div>
          )}

          {duaSubTab === 'favorites' && favIds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[40px] mb-3">🤍</p>
              <p className="text-gray-500 text-[15px] font-semibold">
                {lang === 'en' ? 'No favorites saved yet' : 'এখনো কোনো ফেভারিট নেই'}
              </p>
              <p className="text-gray-400 text-[13px] mt-1">
                {lang === 'en'
                  ? 'Tap the heart on any dua to save it here'
                  : 'যেকোনো দোয়ার হার্ট বাটনে ক্লিক করুন'}
              </p>
            </div>
          )}

          {/* Dua cards */}
          {displayedDuas.map(dua => (
            <DuaCard
              key={dua.id}
              dua={dua}
              lang={lang}
              favIds={favIds}
              onToggleFav={toggleFav}
            />
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/*  TAB 2: TASBIH                                                        */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {mainTab === 'tasbih' && (
        <div>
          {/* Dhikr selector */}
          <div className="card p-3 mb-4">
            <p className="text-[12px] font-bold text-green-700 mb-2 uppercase tracking-wide">
              {lang === 'en' ? 'Select Dhikr' : 'যিকির বেছে নিন'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DHIKR_LIST.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => selectDhikr(idx)}
                  className="p-3 rounded-xl border-2 text-center transition-all"
                  style={{
                    borderColor: tasbih.dhikr === idx ? '#1a5c2a' : '#c3e6cb',
                    background:  tasbih.dhikr === idx
                      ? 'linear-gradient(135deg, #e8f5e9, #d4edda)'
                      : 'white',
                    boxShadow: tasbih.dhikr === idx ? '0 2px 8px rgba(26,92,42,0.2)' : 'none',
                  }}>
                  <p
                    className="arabic text-[16px] font-bold mb-1"
                    style={{ color: '#1a5c2a', direction: 'rtl' }}>
                    {d.arabic}
                  </p>
                  <p className="text-[11px] text-green-700 font-semibold">
                    {lang === 'en' ? d.en : d.bn}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Target selector */}
          <div className="card p-3 mb-4">
            <p className="text-[12px] font-bold text-green-700 mb-2 uppercase tracking-wide">
              {lang === 'en' ? 'Target' : 'লক্ষ্যমাত্রা'}
            </p>
            <div className="flex gap-2">
              {TARGETS.map(t => (
                <button
                  key={t}
                  onClick={() => selectTarget(t)}
                  className="flex-1 py-2 rounded-xl text-[14px] font-bold border-2 transition-all"
                  style={{
                    borderColor: tasbih.target === t ? '#1a5c2a' : '#c3e6cb',
                    background:  tasbih.target === t ? '#1a5c2a' : 'white',
                    color:       tasbih.target === t ? 'white'   : '#1a5c2a',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Counter display */}
          <div className="card p-6 mb-4 flex flex-col items-center">
            {/* Current dhikr label */}
            <p
              className="arabic text-[24px] font-bold mb-1 text-green-800 dark:text-green-300"
              style={{ direction: 'rtl' }}>
              {DHIKR_LIST[tasbih.dhikr].arabic}
            </p>
            <p className="text-[13px] text-green-600 mb-5">
              {lang === 'en'
                ? DHIKR_LIST[tasbih.dhikr].en
                : DHIKR_LIST[tasbih.dhikr].bn}
            </p>

            {/* Progress ring + count */}
            <div className="relative mb-5" style={{ width: 180, height: 180 }}>
              <ProgressRing count={tasbih.count} target={tasbih.target} size={180} />
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ top: 0, left: 0 }}>
                <span
                  className="font-black tabular-nums leading-none"
                  style={{
                    fontSize:   tasbih.count >= 1000 ? '36px' : '52px',
                    color:      tasbih.count >= tasbih.target ? '#f59e0b' : '#1a5c2a',
                    transition: 'font-size 0.2s',
                    transform:  pulse ? 'scale(1.18)' : 'scale(1)',
                    transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                  }}>
                  {tasbih.count}
                </span>
                <span className="text-[12px] text-green-600 mt-1">
                  / {tasbih.target}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-green-100 dark:bg-[#1a4a20] rounded-full h-2 mb-5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width:      `${Math.min((tasbih.count / tasbih.target) * 100, 100)}%`,
                  background: tasbih.count >= tasbih.target
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : 'linear-gradient(90deg, #1a5c2a, #2d7a3a)',
                }}
              />
            </div>

            {/* Celebration message */}
            {celebrated && (
              <div
                className="w-full text-center py-3 px-4 rounded-2xl mb-4 fade-in"
                style={{ background: 'linear-gradient(135deg, #fef9c3, #fde68a)', border: '2px solid #f59e0b' }}>
                <p className="arabic text-[20px] text-amber-800 font-bold">اللَّهُ أَكْبَرُ!</p>
                <p className="text-amber-700 font-bold text-[14px] mt-1">
                  {lang === 'en'
                    ? `MashaAllah! You've completed ${tasbih.target} times! 🎉`
                    : `মাশাআল্লাহ! ${tasbih.target} বার সম্পন্ন! 🎉`}
                </p>
              </div>
            )}

            {/* Big + button */}
            <button
              onClick={increment}
              className="rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 mb-4"
              style={{
                width:      '90px',
                height:     '90px',
                background: 'linear-gradient(135deg, #1a5c2a, #2d7a3a)',
                color:      'white',
                fontSize:   '38px',
                fontWeight: '700',
                boxShadow:  '0 6px 24px rgba(26,92,42,0.4)',
                transform:  pulse ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
              +
            </button>

            {/* Reset button */}
            <button
              onClick={resetTasbih}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-300 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors">
              <FaRedo className="text-[11px]" />
              {lang === 'en' ? 'Reset' : 'রিসেট'}
            </button>
          </div>

          {/* Quick tips */}
          <div
            className="rounded-2xl p-4"
            style={{ background: 'linear-gradient(135deg, #e8f5e9, #f0f9f1)', border: '1px solid #c3e6cb' }}>
            <p className="text-[13px] font-bold text-green-800 mb-2">
              {lang === 'en' ? '✨ Tasbih Tips' : '✨ তাসবীহের ফযিলত'}
            </p>
            <ul className="space-y-1.5">
              {(lang === 'en' ? [
                'Saying "SubhanAllah" 100 times erases 1000 sins (Muslim 2691)',
                '"AlHamdulillah" fills the scales of good deeds (Muslim 223)',
                'The Prophet ﷺ said: "الباقيات الصالحات" — these words are the lasting good deeds',
              ] : [
                '"সুবহানাল্লাহ" ১০০ বার বললে ১০০০ গুনাহ মাফ হয় (মুসলিম ২৬৯১)',
                '"আলহামদুলিল্লাহ" মিযানের পাল্লা ভরে দেয় (মুসলিম ২২৩)',
                'নবী (সা.) বলেছেন: এই যিকিরগুলো হলো "বাকিয়াতুস সালিহাত" — চিরস্থায়ী নেক আমল',
              ]).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-green-800">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
