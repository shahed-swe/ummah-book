import { useState, useEffect } from 'react';
import { surahs } from '../data/quranData';

const BOOKMARKS_KEY = 'ub_quran_bookmarks';

function loadBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || []; }
  catch { return []; }
}

function saveBookmarks(bms) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bms));
}

function SurahCard({ surah, onSelect }) {
  return (
    <button onClick={() => onSelect(surah)}
      className="card p-4 text-left hover:border-green-400 hover:shadow-md transition-all w-full fade-in group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-[13px] shrink-0 group-hover:bg-green-800 transition-colors">
          {surah.number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-green-800 dark:text-[#c8e6c9] text-[14px]">{surah.name}</p>
          <p className="text-gray-500 dark:text-[#4a7a50] text-[12px]">{surah.banglaName} · {surah.totalAyats} আয়াত · {surah.type}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="arabic text-green-700 dark:text-[#6abf69] text-[18px] font-bold">{surah.arabicName}</p>
          <p className="text-[11px] text-gray-400 dark:text-[#4a7a50]">{surah.meaning}</p>
        </div>
      </div>
    </button>
  );
}

function AyatView({ surah, onBack }) {
  const [activeAyat, setActiveAyat] = useState('all');
  const [bookmarks, setBookmarks] = useState(loadBookmarks);

  const showAll = activeAyat === 'all';

  const isBookmarked = (ayatNumber) =>
    bookmarks.some(b => b.surahId === surah.id && b.ayatNumber === ayatNumber);

  const toggleBookmark = (ayat) => {
    setBookmarks(prev => {
      let updated;
      if (isBookmarked(ayat.n)) {
        updated = prev.filter(b => !(b.surahId === surah.id && b.ayatNumber === ayat.n));
      } else {
        updated = [...prev, {
          surahId: surah.id,
          surahName: surah.name,
          ayatNumber: ayat.n,
          arabic: ayat.ar,
          bangla: ayat.bn,
        }];
      }
      saveBookmarks(updated);
      return updated;
    });
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="card p-4 mb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full bg-green-50 dark:bg-[#142d18] hover:bg-green-100 dark:hover:bg-[#1a4a20] flex items-center justify-center text-green-700 dark:text-[#6abf69] font-bold transition-colors">
            ←
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-[18px] text-green-800 dark:text-[#c8e6c9]">{surah.name} — {surah.banglaName}</h2>
            <p className="text-[12px] text-gray-500 dark:text-[#4a7a50]">{surah.totalAyats} আয়াত · {surah.meaning} · {surah.type}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-700 to-emerald-800 rounded-xl p-4 text-center">
          <p className="arabic text-white text-[26px] font-bold leading-loose">{surah.arabicName}</p>
          {surah.number !== 9 && (
            <p className="arabic text-green-100 text-[14px] mt-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          )}
        </div>

        {/* Toggle: show translation or just Arabic */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveAyat('all')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${showAll ? 'bg-green-700 text-white' : 'bg-green-50 dark:bg-[#142d18] text-green-700 dark:text-[#6abf69] border border-green-200 dark:border-[#1a4a20]'}`}>
            আরবি + বাংলা
          </button>
          <button
            onClick={() => setActiveAyat('arabic')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${!showAll ? 'bg-green-700 text-white' : 'bg-green-50 dark:bg-[#142d18] text-green-700 dark:text-[#6abf69] border border-green-200 dark:border-[#1a4a20]'}`}>
            শুধু আরবি
          </button>
        </div>
      </div>

      {/* Ayats */}
      <div className="space-y-2">
        {surah.ayats.map(ayat => {
          const bmed = isBookmarked(ayat.n);
          return (
            <div key={ayat.n} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-[12px] shrink-0 mt-1">
                  {ayat.n}
                </div>
                <div className="flex-1">
                  <p className="arabic text-green-800 dark:text-[#a7d4ab] leading-loose text-right" style={{ fontSize: '20px' }}>{ayat.ar}</p>
                  {showAll && (
                    <p className="text-gray-600 dark:text-[#c8e6c9] text-[13px] mt-3 pt-3 border-t border-green-100 dark:border-[#1a4a20] leading-relaxed">{ayat.bn}</p>
                  )}
                </div>
                <button
                  onClick={() => toggleBookmark(ayat)}
                  title={bmed ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[16px] transition-all active:scale-90 mt-1 ${
                    bmed
                      ? 'bg-green-700 text-white shadow'
                      : 'bg-green-50 dark:bg-[#142d18] text-green-500 dark:text-[#4a7a50] hover:bg-green-100 dark:hover:bg-[#1a4a20]'
                  }`}>
                  🔖
                </button>
              </div>
            </div>
          );
        })}

        {surah.ayats.length < surah.totalAyats && (
          <div className="card p-4 text-center text-[13px] text-green-600 dark:text-[#4a7a50] bg-green-50 dark:bg-[#0f2313]">
            🕌 সম্পূর্ণ সূরার বাকি {surah.totalAyats - surah.ayats.length}টি আয়াত শীঘ্রই আসছে। আমিন।
          </div>
        )}
      </div>
    </div>
  );
}

function BookmarksView({ bookmarks, onNavigate, onDelete }) {
  if (bookmarks.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-[44px] mb-3">🔖</p>
        <p className="font-bold text-[17px] text-green-700 dark:text-[#6abf69] mb-1">কোনো বুকমার্ক নেই।</p>
        <p className="text-[13px] text-gray-500 dark:text-[#4a7a50]">আয়াত পড়ার সময় 🔖 বোতাম চাপুন।</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 fade-in">
      {bookmarks.map((bm, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onNavigate(bm.surahId)}
              className="flex-1 text-left group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-green-600 dark:text-[#4ade80] bg-green-50 dark:bg-[#142d18] px-2 py-0.5 rounded-full">
                  {bm.surahName} · আয়াত {bm.ayatNumber}
                </span>
              </div>
              <p className="arabic text-green-800 dark:text-[#a7d4ab] leading-loose text-right mb-2" style={{ fontSize: '18px' }}>{bm.arabic}</p>
              {bm.bangla && (
                <p className="text-gray-600 dark:text-[#c8e6c9] text-[13px] leading-relaxed line-clamp-2">{bm.bangla}</p>
              )}
              <p className="text-[11px] text-green-600 dark:text-[#4ade80] mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                → এই সূরায় যান
              </p>
            </button>
            <button
              onClick={() => onDelete(bm.surahId, bm.ayatNumber)}
              className="shrink-0 w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-[14px] hover:bg-red-500 transition-colors active:scale-90 mt-1"
              title="বুকমার্ক সরান">
              🔖
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function QuranPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [listTab, setListTab] = useState('surahs'); // 'surahs' | 'bookmarks'
  const [bookmarks, setBookmarks] = useState(loadBookmarks);

  // Keep bookmarks in sync when AyatView updates localStorage
  useEffect(() => {
    const sync = () => setBookmarks(loadBookmarks());
    window.addEventListener('storage', sync);
    // Also re-check on focus (same-tab changes from AyatView won't fire storage event)
    const interval = setInterval(() => setBookmarks(loadBookmarks()), 500);
    return () => { window.removeEventListener('storage', sync); clearInterval(interval); };
  }, []);

  const deleteBookmark = (surahId, ayatNumber) => {
    const updated = bookmarks.filter(b => !(b.surahId === surahId && b.ayatNumber === ayatNumber));
    saveBookmarks(updated);
    setBookmarks(updated);
  };

  const navigateToSurah = (surahId) => {
    const surah = surahs.find(s => s.id === surahId);
    if (surah) setSelected(surah);
  };

  const filtered = surahs.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.banglaName.includes(search) ||
    s.arabicName.includes(search)
  );

  if (selected) return <AyatView surah={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="fade-in">
      <div className="card p-4 mb-3">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[28px]">📖</span>
          <div>
            <h2 className="font-bold text-[18px] text-green-800 dark:text-[#c8e6c9]">পবিত্র কুরআন</h2>
            <p className="text-[12px] text-gray-500 dark:text-[#4a7a50]">আরবি টেক্সট ও বাংলা অনুবাদ</p>
          </div>
        </div>

        {/* Tab switcher: Surahs / Bookmarks */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setListTab('surahs')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${listTab === 'surahs' ? 'bg-green-700 text-white' : 'bg-green-50 dark:bg-[#142d18] text-green-700 dark:text-[#6abf69] border border-green-200 dark:border-[#1a4a20]'}`}>
            📋 সূরা তালিকা
          </button>
          <button
            onClick={() => setListTab('bookmarks')}
            className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${listTab === 'bookmarks' ? 'bg-green-700 text-white' : 'bg-green-50 dark:bg-[#142d18] text-green-700 dark:text-[#6abf69] border border-green-200 dark:border-[#1a4a20]'}`}>
            🔖 বুকমার্ক
            {bookmarks.length > 0 && (
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${listTab === 'bookmarks' ? 'bg-white/30 text-white' : 'bg-green-700 text-white'}`}>
                {bookmarks.length}
              </span>
            )}
          </button>
        </div>

        {listTab === 'surahs' && (
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 সূরা খুঁজুন (বাংলা বা আরবি নামে)..."
            className="input-base"
          />
        )}
      </div>

      {listTab === 'surahs' && (
        <>
          <div className="card p-3 mb-3 text-center pattern-bg rounded-xl">
            <p className="arabic text-white text-[18px] font-bold">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p>
            <p className="text-green-100 text-[12px] mt-1">"এবং কুরআন তিলাওয়াত করো ধীরে ধীরে, স্পষ্ট করে" — সূরা মুযযাম্মিল: ৪</p>
          </div>

          <div className="space-y-2">
            {filtered.map(s => <SurahCard key={s.id} surah={s} onSelect={setSelected} />)}
          </div>

          {filtered.length === 0 && (
            <div className="card p-8 text-center text-green-600">
              <p className="text-[32px] mb-2">🔍</p>
              <p>কোনো সূরা পাওয়া যায়নি।</p>
            </div>
          )}
        </>
      )}

      {listTab === 'bookmarks' && (
        <BookmarksView
          bookmarks={bookmarks}
          onNavigate={navigateToSurah}
          onDelete={deleteBookmark}
        />
      )}
    </div>
  );
}
