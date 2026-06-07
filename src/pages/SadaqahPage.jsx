import { useState } from 'react';
import { useApp } from '../context/AppContext';

const GOLD_NISAB_G   = 87.48;
const SILVER_NISAB_G = 612.36;
const GOLD_RATE_BDT  = 9000;   // per gram
const SILVER_RATE_BDT = 100;   // per gram
const SILVER_NISAB_BDT = SILVER_NISAB_G * SILVER_RATE_BDT; // 61236

function ZakatCalculator() {
  const [gold,     setGold]     = useState('');
  const [silver,   setSilver]   = useState('');
  const [cash,     setCash]     = useState('');
  const [business, setBusiness] = useState('');
  const [recv,     setRecv]     = useState('');

  const goldVal     = parseFloat(gold)     || 0;
  const silverVal   = parseFloat(silver)   || 0;
  const cashVal     = parseFloat(cash)     || 0;
  const businessVal = parseFloat(business) || 0;
  const recvVal     = parseFloat(recv)     || 0;

  const goldBDT    = goldVal   * GOLD_RATE_BDT;
  const silverBDT  = silverVal * SILVER_RATE_BDT;
  const total      = goldBDT + silverBDT + cashVal + businessVal + recvVal;
  const meetsNisab = total >= SILVER_NISAB_BDT;
  const zakatDue   = meetsNisab ? total * 0.025 : 0;

  const reset = () => { setGold(''); setSilver(''); setCash(''); setBusiness(''); setRecv(''); };

  const fmt = (n) => n.toLocaleString('bn-BD', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      {/* Nisab Info */}
      <div className="bg-green-50 dark:bg-[#0f2313] border border-green-200 dark:border-[#1a4a20] rounded-2xl p-4">
        <h3 className="font-bold text-[14px] text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
          <span>⚖️</span> নিসাবের পরিমাণ
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white dark:bg-[#142d18] rounded-xl px-3 py-2 text-center">
            <p className="text-[11px] text-gray-500 dark:text-[#6abf69]">স্বর্ণ নিসাব</p>
            <p className="font-bold text-[14px] text-yellow-600 dark:text-yellow-400">{GOLD_NISAB_G}g</p>
            <p className="text-[11px] text-gray-400 dark:text-[#4a7a50]">≈ ৳{fmt(GOLD_NISAB_G * GOLD_RATE_BDT)}</p>
          </div>
          <div className="bg-white dark:bg-[#142d18] rounded-xl px-3 py-2 text-center">
            <p className="text-[11px] text-gray-500 dark:text-[#6abf69]">রূপা নিসাব</p>
            <p className="font-bold text-[14px] text-gray-500 dark:text-gray-300">{SILVER_NISAB_G}g</p>
            <p className="text-[11px] text-gray-400 dark:text-[#4a7a50]">≈ ৳{fmt(SILVER_NISAB_BDT)}</p>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] mt-2 text-center">* রূপার নিসাব হিসাবে যাকাত নির্ধারণ করা হয় (সর্বনিম্ন)</p>
      </div>

      {/* Input Fields */}
      <div className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-4 space-y-3">
        <h3 className="font-bold text-[14px] text-green-800 dark:text-green-300 flex items-center gap-2 mb-1">
          <span>📝</span> সম্পদের বিবরণ দিন
        </h3>

        {[
          { label: '🥇 স্বর্ণ (গ্রাম)', val: gold,     set: setGold,     ph: 'যেমন: ৫০', note: goldVal > 0 ? `≈ ৳${fmt(goldBDT)}` : '' },
          { label: '🪙 রূপা (গ্রাম)',   val: silver,   set: setSilver,   ph: 'যেমন: ২০০', note: silverVal > 0 ? `≈ ৳${fmt(silverBDT)}` : '' },
          { label: '💵 নগদ / ব্যাংক (BDT)', val: cash, set: setCash,     ph: 'যেমন: ৫০০০০', note: '' },
          { label: '🏪 ব্যবসায়িক পণ্য (BDT)', val: business, set: setBusiness, ph: 'যেমন: ১০০০০০', note: '' },
          { label: '📋 পাওনা অর্থ (BDT)', val: recv,   set: setRecv,     ph: 'যেমন: ২০০০০', note: '' },
        ].map(({ label, val, set, ph, note }) => (
          <div key={label}>
            <label className="text-[12px] font-semibold text-gray-600 dark:text-[#8bc34a] mb-1 block">{label}</label>
            <div className="relative">
              <input
                type="number" min="0" value={val}
                onChange={e => set(e.target.value)}
                placeholder={ph}
                className="w-full px-3 py-2.5 rounded-xl border border-green-200 dark:border-[#1a4a20] bg-green-50/50 dark:bg-[#142d18] text-[14px] text-gray-800 dark:text-[#e8f5e9] focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              />
              {note && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-green-600 dark:text-green-400 font-semibold">{note}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className={`rounded-2xl p-5 border ${
        total > 0
          ? meetsNisab
            ? 'bg-green-50 dark:bg-[#0a2e10] border-green-400 dark:border-green-600'
            : 'bg-orange-50 dark:bg-[#2a1a00] border-orange-300 dark:border-orange-700'
          : 'bg-white dark:bg-[#0f2313] border-green-100 dark:border-[#1a4a20]'
      }`}>
        <h3 className="font-bold text-[14px] text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
          <span>🧮</span> হিসাবের ফলাফল
        </h3>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-600 dark:text-[#6abf69]">মোট যাকাতযোগ্য সম্পদ:</span>
            <span className="font-bold text-gray-800 dark:text-[#e8f5e9]">৳{fmt(total)}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-gray-600 dark:text-[#6abf69]">নিসাব (রূপা):</span>
            <span className="font-bold text-gray-800 dark:text-[#e8f5e9]">৳{fmt(SILVER_NISAB_BDT)}</span>
          </div>
          <div className="border-t border-green-200 dark:border-[#1a4a20] pt-2">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-gray-600 dark:text-[#6abf69]">অবস্থা:</span>
              {total === 0 ? (
                <span className="text-[13px] text-gray-400 dark:text-[#4a7a50]">পরিমাণ লিখুন</span>
              ) : meetsNisab ? (
                <span className="text-[14px] font-bold text-green-600 dark:text-green-400">✅ নিসাব পূর্ণ হয়েছে</span>
              ) : (
                <span className="text-[14px] font-bold text-orange-500 dark:text-orange-400">⚠️ নিসাব পূর্ণ হয়নি</span>
              )}
            </div>
          </div>
        </div>

        {meetsNisab && total > 0 && (
          <div className="bg-green-600 dark:bg-green-700 rounded-xl px-4 py-3 text-center mt-3">
            <p className="text-green-100 text-[12px] mb-1">প্রদেয় যাকাত (২.৫%)</p>
            <p className="text-white text-[26px] font-bold">৳{fmt(zakatDue)}</p>
            <p className="text-green-200 text-[11px] mt-1">আল্লাহর পথে এই পরিমাণ যাকাত আদায় করুন</p>
          </div>
        )}

        {!meetsNisab && total > 0 && (
          <div className="bg-orange-100 dark:bg-[#2a1a00] rounded-xl px-4 py-3 text-center mt-3">
            <p className="text-orange-700 dark:text-orange-400 text-[13px] font-semibold">নিসাব পূর্ণ হয়নি</p>
            <p className="text-orange-500 dark:text-orange-500 text-[12px] mt-1">
              আরও ৳{fmt(SILVER_NISAB_BDT - total)} বৃদ্ধি পেলে যাকাত ফরজ হবে
            </p>
          </div>
        )}
      </div>

      {/* Reset */}
      {(gold || silver || cash || business || recv) && (
        <button onClick={reset}
          className="w-full py-2.5 rounded-xl border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 text-[13px] font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
          🗑️ রিসেট / পরিষ্কার করুন
        </button>
      )}

      <div className="text-center text-[11px] text-gray-400 dark:text-[#4a7a50] pb-2">
        * স্বর্ণ ≈ ৳৯,০০০/গ্রাম · রূপা ≈ ৳১০০/গ্রাম (আনুমানিক বাজার মূল্য)
      </div>
    </div>
  );
}

const TYPES = [
  { emoji: '💰', title_bn: 'মালী সদকা', title_en: 'Financial Sadaqah', desc_bn: 'অর্থ, সম্পদ দান করা', desc_en: 'Giving money or wealth to those in need' },
  { emoji: '😊', title_bn: 'হাসিমুখ', title_en: 'A Smile', desc_bn: 'ভাইয়ের মুখে হাসি দেওয়া সদকা', desc_en: 'Smiling at your brother is charity' },
  { emoji: '📖', title_bn: 'জ্ঞান দান', title_en: 'Knowledge', desc_bn: 'ইসলামিক জ্ঞান ছড়িয়ে দেওয়া', desc_en: 'Sharing Islamic knowledge with others' },
  { emoji: '💧', title_bn: 'পানি দান', title_en: 'Water', desc_bn: 'তৃষ্ণার্তকে পানি পান করানো', desc_en: 'Providing water to the thirsty' },
  { emoji: '🤝', title_bn: 'সাহায্য করা', title_en: 'Helping Others', desc_bn: 'বিপদে পড়া মানুষকে সহায়তা', desc_en: 'Assisting someone in need' },
  { emoji: '🌳', title_bn: 'গাছ লাগানো', title_en: 'Planting a Tree', desc_bn: 'সদকায়ে জারিয়া — সর্বদা পুরস্কার', desc_en: 'Ongoing charity — reward continues after death' },
  { emoji: '🕌', title_bn: 'মসজিদ নির্মাণ', title_en: 'Building a Mosque', desc_bn: 'সদকায়ে জারিয়ার সর্বোত্তম মাধ্যম', desc_en: 'One of the best forms of ongoing charity' },
  { emoji: '📚', title_bn: 'শিক্ষা প্রদান', title_en: 'Education', desc_bn: 'এতিম ও গরীব শিশুর পড়াশোনার ব্যবস্থা', desc_en: 'Supporting education for orphans and poor children' },
];

const VERSES = [
  { ar: 'مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ', tr: 'যারা আল্লাহর পথে তাদের সম্পদ ব্যয় করে, তাদের উদাহরণ হলো একটি বীজের মতো যা সাতটি শীষ জন্মায়।', ref: 'সূরা বাকারা: ২৬১' },
  { ar: 'لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا مِمَّا تُحِبُّونَ', tr: 'তোমরা কখনই পুণ্য লাভ করবে না, যতক্ষণ না তোমরা তোমাদের প্রিয় বস্তু থেকে ব্যয় করবে।', ref: 'সূরা আলে ইমরান: ৯২' },
  { ar: 'وَمَا تُنفِقُوا مِنْ خَيْرٍ فَإِنَّ اللَّهَ بِهِ عَلِيمٌ', tr: 'তোমরা যা-ই কল্যাণে ব্যয় করো, নিশ্চয়ই আল্লাহ সে সম্পর্কে সম্যক জ্ঞাত।', ref: 'সূরা বাকারা: ২৭৩' },
];

const HADITHS = [
  { text: '"প্রতিটি মুসলমানের জন্য সদকা করা ওয়াজিব।" সাহাবীরা বললেন: যার কিছু নেই? নবী (সা.) বললেন: "সে নিজ হাতে কাজ করুক, এবং নিজেকে উপকৃত করে অন্যকেও দান করুক।"', ref: 'সহীহ বুখারি' },
  { text: '"দান সম্পদ কমায় না।"', ref: 'সহীহ মুসলিম' },
  { text: '"মানুষের কাছ থেকে ভালো কথা গ্রহণ করা ও প্রতিটি ভালো কাজও সদকা।"', ref: 'সহীহ বুখারি' },
];

export default function SadaqahPage() {
  const { lang } = useApp();
  const [tab, setTab] = useState('types');

  const T = {
    title:  lang === 'en' ? 'Sadaqah & Charity' : 'সদকা ও দান',
    sub:    lang === 'en' ? 'Purify your wealth, purify your soul' : 'সম্পদ পবিত্র করুন, আত্মা পবিত্র করুন',
    types:  lang === 'en' ? 'Types' : 'প্রকারভেদ',
    verses: lang === 'en' ? 'Quran' : 'কুরআন',
    hadith: lang === 'en' ? 'Hadith' : 'হাদিস',
    benefits_title: lang === 'en' ? 'Benefits of Sadaqah' : 'সদকার ফযিলত',
    benefits: lang === 'en' ? [
      '🌟 Protects from calamities and misfortunes',
      '💚 Increases wealth and blessings (barakah)',
      '🏥 Cures illnesses and removes hardship',
      '😇 Earns intercession on the Day of Judgment',
      '🌈 Cools the anger of Allah',
      '🔑 Opens doors of goodness',
    ] : [
      '🌟 বিপদ-আপদ থেকে রক্ষা করে',
      '💚 সম্পদ ও বরকত বৃদ্ধি পায়',
      '🏥 রোগ নিরাময় ও কষ্ট দূর হয়',
      '😇 কিয়ামতে সুপারিশ লাভ',
      '🌈 আল্লাহর রাগ নিভিয়ে দেয়',
      '🔑 কল্যাণের দরজা খুলে দেয়',
    ],
  };

  const tabs = [['types', T.types], ['verses', T.verses], ['hadith', T.hadith], ['zakat', lang === 'en' ? 'Zakat Calc' : 'যাকাত 🧮']];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden mb-4 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #2d4a0a 0%, #3d6e1a 60%, #1a5c2a 100%)' }}>
        <div className="px-5 py-5 text-center">
          <div className="text-[48px] mb-2">🤲</div>
          <h1 className="text-[24px] font-bold text-white">{T.title}</h1>
          <p className="text-green-200 text-[13px] mt-1">{T.sub}</p>
          <p className="arabic text-green-300 text-[15px] mt-3">وَمَا تُنفِقُوا مِنْ خَيْرٍ يُوَفَّ إِلَيْكُمْ وَأَنتُمْ لَا تُظْلَمُونَ</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-4 mb-4 shadow-sm">
        <h2 className="font-bold text-[15px] text-green-800 dark:text-[#c8e6c9] mb-3 flex items-center gap-2">
          <span>✨</span> {T.benefits_title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {T.benefits.map((b, i) => (
            <p key={i} className="text-[13px] text-gray-700 dark:text-[#8bc34a] bg-green-50 dark:bg-[#142d18] rounded-xl px-3 py-2">{b}</p>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex-shrink-0 ${
              tab === key ? 'bg-green-700 text-white shadow-sm' : 'bg-white dark:bg-[#0f2313] text-gray-500 dark:text-[#4a7a50] border border-green-100 dark:border-[#1a4a20] hover:bg-green-50'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Types */}
      {tab === 'types' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TYPES.map((t, i) => (
            <div key={i} className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-4 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[28px] flex-shrink-0">{t.emoji}</span>
              <div>
                <p className="font-bold text-[14px] text-gray-800 dark:text-[#e8f5e9]">{lang === 'en' ? t.title_en : t.title_bn}</p>
                <p className="text-[12px] text-gray-500 dark:text-[#6abf69] mt-0.5">{lang === 'en' ? t.desc_en : t.desc_bn}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quran Verses */}
      {tab === 'verses' && (
        <div className="space-y-3">
          {VERSES.map((v, i) => (
            <div key={i} className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-5 shadow-sm">
              <p className="arabic text-[18px] text-green-800 dark:text-green-300 text-right leading-loose mb-3">{v.ar}</p>
              <p className="text-[14px] text-gray-700 dark:text-[#c8e6c9] leading-relaxed">{v.tr}</p>
              <p className="text-[12px] text-green-600 dark:text-green-400 font-semibold mt-2">— {v.ref}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hadith */}
      {tab === 'hadith' && (
        <div className="space-y-3">
          {HADITHS.map((h, i) => (
            <div key={i} className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-5 shadow-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-[#142d18] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[18px]">📜</span>
                </div>
                <div>
                  <p className="text-[14px] text-gray-700 dark:text-[#c8e6c9] leading-relaxed">{h.text}</p>
                  <p className="text-[12px] text-green-600 dark:text-green-400 font-semibold mt-2">— {h.ref}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zakat Calculator */}
      {tab === 'zakat' && <ZakatCalculator />}

      <div className="mt-4 text-center py-3">
        <p className="arabic text-green-600 dark:text-green-400 text-[14px]">اللَّهُمَّ تَقَبَّلْ مِنَّا</p>
        <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] mt-1">হে আল্লাহ! আমাদের কাছ থেকে কবুল করুন।</p>
      </div>
    </div>
  );
}
