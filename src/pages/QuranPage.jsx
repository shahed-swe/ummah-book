import { useState } from 'react';
import { surahs } from '../data/quranData';

function SurahCard({ surah, onSelect }) {
  return (
    <button onClick={() => onSelect(surah)}
      className="card p-4 text-left hover:border-green-400 hover:shadow-md transition-all w-full fade-in group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-[13px] shrink-0 group-hover:bg-green-800 transition-colors">
          {surah.number}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-green-800 text-[14px]">{surah.name}</p>
          <p className="text-gray-500 text-[12px]">{surah.banglaName} · {surah.totalAyats} আয়াত · {surah.type}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="arabic text-green-700 text-[18px] font-bold">{surah.arabicName}</p>
          <p className="text-[11px] text-gray-400">{surah.meaning}</p>
        </div>
      </div>
    </button>
  );
}

function AyatView({ surah, onBack }) {
  const [activeAyat, setActiveAyat] = useState(null);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="card p-4 mb-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-700 font-bold transition-colors">
            ←
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-[18px] text-green-800">{surah.name} — {surah.banglaName}</h2>
            <p className="text-[12px] text-gray-500">{surah.totalAyats} আয়াত · {surah.meaning} · {surah.type}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-700 to-emerald-800 rounded-xl p-4 text-center">
          <p className="arabic text-white text-[26px] font-bold leading-loose">{surah.arabicName}</p>
          {surah.number !== 9 && (
            <p className="arabic text-green-100 text-[14px] mt-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          )}
        </div>
      </div>

      {/* Ayats */}
      <div className="space-y-3">
        {surah.ayats.map(ayat => (
          <div key={ayat.n}
            className={`card p-4 cursor-pointer transition-all ${activeAyat === ayat.n ? 'border-green-400 shadow-md' : 'hover:border-green-300'}`}
            onClick={() => setActiveAyat(activeAyat === ayat.n ? null : ayat.n)}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-[13px] shrink-0 mt-1">
                {ayat.n}
              </div>
              <div className="flex-1">
                <p className="arabic text-green-800 text-[20px] leading-loose text-right">{ayat.ar}</p>
                {(activeAyat === ayat.n || true) && (
                  <p className="text-gray-600 text-[13px] mt-3 pt-3 border-t border-green-50 leading-relaxed">{ayat.bn}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {surah.ayats.length < surah.totalAyats && (
          <div className="card p-4 text-center text-[13px] text-green-600 bg-green-50">
            🕌 সম্পূর্ণ সূরার বাকি {surah.totalAyats - surah.ayats.length}টি আয়াত শীঘ্রই আসছে। আমিন।
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuranPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

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
            <h2 className="font-bold text-[18px] text-green-800">পবিত্র কুরআন</h2>
            <p className="text-[12px] text-gray-500">আরবি টেক্সট ও বাংলা অনুবাদ</p>
          </div>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 সূরা খুঁজুন (বাংলা বা আরবি নামে)..."
          className="input-base"
        />
      </div>

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
    </div>
  );
}
