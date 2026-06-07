import { useState } from 'react';
import { useApp } from '../context/AppContext';

const REGIONS = [
  { flag: '🇸🇦', name_bn: 'সৌদি আরব', name_en: 'Saudi Arabia', pop_bn: '৩.৫ কোটি', pop_en: '35 million', info_bn: 'দুই পবিত্র মসজিদের দেশ — মক্কা ও মদিনার ভূমি', info_en: 'Land of the Two Holy Mosques — Mecca & Medina' },
  { flag: '🇧🇩', name_bn: 'বাংলাদেশ', name_en: 'Bangladesh', pop_bn: '১৭ কোটি+', pop_en: '170 million+', info_bn: 'বিশ্বের ৩য় বৃহত্তম মুসলিম জনসংখ্যা', info_en: '3rd largest Muslim population in the world' },
  { flag: '🇵🇰', name_bn: 'পাকিস্তান', name_en: 'Pakistan', pop_bn: '২৩ কোটি+', pop_en: '230 million+', info_bn: 'বিশ্বের ২য় বৃহত্তম মুসলিম দেশ', info_en: '2nd largest Muslim country by population' },
  { flag: '🇮🇩', name_bn: 'ইন্দোনেশিয়া', name_en: 'Indonesia', pop_bn: '২৮ কোটি+', pop_en: '280 million+', info_bn: 'বিশ্বের বৃহত্তম মুসলিম দেশ', info_en: 'World\'s largest Muslim country by population' },
  { flag: '🇹🇷', name_bn: 'তুরস্ক', name_en: 'Turkey', pop_bn: '৮.৫ কোটি', pop_en: '85 million', info_bn: 'উসমানীয় সভ্যতার ঐতিহ্যবাহী দেশ', info_en: 'Heritage of the Ottoman civilization' },
  { flag: '🇪🇬', name_bn: 'মিসর', name_en: 'Egypt', pop_bn: '১০ কোটি+', pop_en: '100 million+', info_bn: 'আল-আযহার বিশ্ববিদ্যালয়ের দেশ', info_en: 'Home of Al-Azhar University' },
  { flag: '🇮🇷', name_bn: 'ইরান', name_en: 'Iran', pop_bn: '৮.৭ কোটি', pop_en: '87 million', info_bn: 'ইসলামিক সভ্যতার অন্যতম কেন্দ্র', info_en: 'A major center of Islamic civilization' },
  { flag: '🇲🇾', name_bn: 'মালয়েশিয়া', name_en: 'Malaysia', pop_bn: '৩.২ কোটি', pop_en: '32 million', info_bn: 'আধুনিক ইসলামিক উন্নয়নের আদর্শ', info_en: 'A model of modern Islamic development' },
];

const FACTS = [
  { icon: '🌍', num_bn: '১৮০+ কোটি', num_en: '1.8+ billion', label_bn: 'মুসলিম বিশ্বজুড়ে', label_en: 'Muslims worldwide' },
  { icon: '🕌', num_bn: '৩.৬+ লাখ', num_en: '360,000+', label_bn: 'মসজিদ শুধু বাংলাদেশে', label_en: 'Mosques in Bangladesh alone' },
  { icon: '📖', num_bn: '৫০+ ভাষায়', num_en: '50+ languages', label_bn: 'কুরআন অনূদিত', label_en: 'Quran translated' },
  { icon: '🌐', num_bn: '৫৭টি', num_en: '57 countries', label_bn: 'OIC সদস্য দেশ', label_en: 'OIC member states' },
];

const RESOURCES = [
  { icon: '📖', title_bn: 'ইসলামিক ফাইন্ডার', title_en: 'IslamicFinder', desc_bn: 'নামাজের সময়, কিবলা, মসজিদ', desc_en: 'Prayer times, Qibla, Mosques' },
  { icon: '🕌', title_bn: 'মুসলিম প্রো', title_en: 'Muslim Pro', desc_bn: 'কুরআন, নামাজ, যিকর', desc_en: 'Quran, Prayer, Dhikr' },
  { icon: '📚', title_bn: 'সুন্নাহ ডট কম', title_en: 'Sunnah.com', desc_bn: 'হাদিস সংগ্রহ', desc_en: 'Hadith collections' },
  { icon: '🎓', title_bn: 'ইসলাম কিউ এ', title_en: 'IslamQA', desc_bn: 'ইসলামিক প্রশ্নোত্তর', desc_en: 'Islamic Q&A fatawa' },
];

export default function UmmahWorldPage() {
  const { lang } = useApp();
  const [tab, setTab] = useState('map');

  const T = {
    title:     lang === 'en' ? 'Ummah World'        : 'উম্মাহ ওয়ার্ল্ড',
    sub:       lang === 'en' ? 'One Ummah, One Heart' : 'এক উম্মাহ, এক হৃদয়',
    map:       lang === 'en' ? 'Muslim World'        : 'মুসলিম বিশ্ব',
    stats:     lang === 'en' ? 'Statistics'          : 'পরিসংখ্যান',
    resources: lang === 'en' ? 'Resources'           : 'সম্পদ',
    pop:       lang === 'en' ? 'Population'          : 'জনসংখ্যা',
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden mb-4 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0a2d1a 0%, #1a5c2a 60%, #2d8a3a 100%)' }}>
        <div className="px-5 py-5 text-center">
          <div className="text-[48px] mb-2">🌙</div>
          <h1 className="text-[24px] font-bold text-white">{T.title}</h1>
          <p className="text-green-200 text-[13px] mt-1">{T.sub}</p>
          <p className="arabic text-green-300 text-[15px] mt-3">إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ</p>
          <p className="text-green-200 text-[12px] mt-1">"নিশ্চয়ই মুমিনরা পরস্পর ভাই।" — সূরা হুজুরাত: ১০</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {FACTS.map((f, i) => (
          <div key={i} className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-3 text-center shadow-sm">
            <div className="text-[24px] mb-1">{f.icon}</div>
            <p className="font-bold text-[18px] text-green-700 dark:text-green-400">{lang === 'en' ? f.num_en : f.num_bn}</p>
            <p className="text-[11px] text-gray-500 dark:text-[#4a7a50] leading-snug">{lang === 'en' ? f.label_en : f.label_bn}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-4">
        {[['map', T.map], ['resources', T.resources]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
              tab === key ? 'bg-green-700 text-white shadow-sm' : 'bg-white dark:bg-[#0f2313] text-gray-500 dark:text-[#4a7a50] border border-green-100 dark:border-[#1a4a20] hover:bg-green-50'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Muslim World */}
      {tab === 'map' && (
        <div className="space-y-2">
          {REGIONS.map((r, i) => (
            <div key={i} className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[36px] flex-shrink-0">{r.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] text-gray-800 dark:text-[#e8f5e9]">{lang === 'en' ? r.name_en : r.name_bn}</p>
                <p className="text-[12px] text-gray-500 dark:text-[#4a7a50] mt-0.5 leading-snug">{lang === 'en' ? r.info_en : r.info_bn}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[11px] text-gray-400 dark:text-[#4a7a50]">{T.pop}</p>
                <p className="font-bold text-[13px] text-green-700 dark:text-green-400">{lang === 'en' ? r.pop_en : r.pop_bn}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      {tab === 'resources' && (
        <div className="space-y-2">
          {RESOURCES.map((r, i) => (
            <div key={i} className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-[#142d18] flex items-center justify-center text-[24px] flex-shrink-0">
                {r.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[14px] text-gray-800 dark:text-[#e8f5e9]">{lang === 'en' ? r.title_en : r.title_bn}</p>
                <p className="text-[12px] text-gray-500 dark:text-[#4a7a50] mt-0.5">{lang === 'en' ? r.desc_en : r.desc_bn}</p>
              </div>
              <span className="text-green-400 text-[12px]">→</span>
            </div>
          ))}

          {/* Hadith */}
          <div className="bg-green-50 dark:bg-[#0f2313] border border-green-200 dark:border-[#1a4a20] rounded-2xl p-5 mt-3">
            <p className="arabic text-center text-[18px] text-green-800 dark:text-green-300 leading-loose mb-2">
              مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ
            </p>
            <p className="text-[13px] text-gray-700 dark:text-[#c8e6c9] text-center leading-relaxed">
              "মুমিনদের পরস্পরের ভালোবাসা, দয়া ও সহানুভূতির উদাহরণ হলো একটি শরীরের মতো।"
            </p>
            <p className="text-center text-[12px] text-green-600 dark:text-green-400 font-semibold mt-2">— সহীহ বুখারি ও মুসলিম</p>
          </div>
        </div>
      )}

      <div className="mt-4 text-center py-3">
        <p className="text-[12px] text-gray-400 dark:text-[#4a7a50]">
          {lang === 'en' ? 'The Ummah is one body — when one part hurts, all feel it.' : 'উম্মাহ একটি শরীর — একজন কষ্ট পেলে সবাই অনুভব করে।'}
        </p>
      </div>
    </div>
  );
}
