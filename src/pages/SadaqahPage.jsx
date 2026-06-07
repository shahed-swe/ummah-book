import { useState } from 'react';
import { useApp } from '../context/AppContext';

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

  const tabs = [['types', T.types], ['verses', T.verses], ['hadith', T.hadith]];

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
      <div className="flex gap-1.5 mb-4">
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
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

      <div className="mt-4 text-center py-3">
        <p className="arabic text-green-600 dark:text-green-400 text-[14px]">اللَّهُمَّ تَقَبَّلْ مِنَّا</p>
        <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] mt-1">হে আল্লাহ! আমাদের কাছ থেকে কবুল করুন।</p>
      </div>
    </div>
  );
}
