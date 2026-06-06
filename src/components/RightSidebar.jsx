import { FaSearch, FaEllipsisH, FaEdit, FaHashtag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { prayerTimes } from '../data/initialData';

function PrayerCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-green-200 mb-4 shadow-sm">
      <div className="pattern-bg px-4 py-3 text-center">
        <p className="text-green-200 text-[11px] arabic mb-1">الصَّلَاةُ عِمَادُ الدِّينِ</p>
        <p className="text-white font-bold text-[15px]">🕌 Prayer Times · নামাজের সময়</p>
        <p className="text-green-300 text-[12px]">Dhaka, Bangladesh · ঢাকা</p>
        <div className="mt-2 bg-white/10 rounded-lg px-3 py-1.5">
          <p className="text-yellow-300 text-[11px] font-bold">৭ যুল-হিজ্জাহ ১৪৪৬ AH</p>
          <p className="text-green-200 text-[11px]">৬ জুন ২০২৫, শুক্রবার</p>
        </div>
      </div>
      <div className="bg-white divide-y divide-green-50">
        {prayerTimes.map((p, i) => (
          <div key={p.name} className={`flex items-center justify-between px-4 py-2 ${i === 1 ? 'bg-green-50' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{p.icon}</span>
              <span className={`text-[13px] font-medium ${i === 1 ? 'text-green-700 font-bold' : 'text-gray-800'}`}>{p.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[13px] font-mono ${i === 1 ? 'text-green-700 font-bold' : 'text-gray-500'}`}>{p.time}</span>
              {i === 1 && <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">Now · এখন</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingTopics() {
  const topics = [
    { tag: '#JumahMubarak',     posts: '৪৫.২K পোস্ট' },
    { tag: '#Alhamdulillah',    posts: '১২৩K পোস্ট' },
    { tag: '#QuranQuotes',      posts: '৩৮.৭K পোস্ট' },
    { tag: '#IslamicReminder',  posts: '২৯.১K পোস্ট' },
    { tag: '#RamadanMemories',  posts: '১৮.৫K পোস্ট' },
  ];

  return (
    <div className="bg-white border border-green-100 rounded-xl overflow-hidden mb-4 shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-green-100">
        <FaHashtag className="text-green-600" />
        <div>
          <p className="font-bold text-[14px] text-green-800">Trending in Ummah</p>
          <p className="text-[11px] text-green-500">উম্মাহয় ট্রেন্ডিং</p>
        </div>
      </div>
      <div className="divide-y divide-green-50">
        {topics.map((t, i) => (
          <button key={t.tag}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-green-50 transition-colors text-left">
            <div>
              <p className="text-[13px] text-green-700 font-bold">{t.tag}</p>
              <p className="text-[11px] text-gray-500">{t.posts}</p>
            </div>
            <span className="text-[12px] text-gray-400 font-medium">#{i + 1}</span>
          </button>
        ))}
      </div>
      <button className="w-full text-center py-2.5 text-[13px] text-green-600 font-semibold hover:bg-green-50 transition-colors">
        See more trends · আরো ট্রেন্ড দেখুন →
      </button>
    </div>
  );
}

export default function RightSidebar() {
  const { contacts } = useApp();
  const navigate = useNavigate();

  return (
    <aside className="hidden xl:block fixed right-0 top-[56px] h-[calc(100vh-56px)] w-[280px] overflow-y-auto bg-white border-l border-green-100">
      <div className="p-3">

        <PrayerCard />

        {/* Daily Hadith */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-4 text-center shadow-sm">
          <p className="text-[11px] text-amber-600 font-bold uppercase tracking-wider mb-1">💡 Hadith of the Day · আজকের হাদিস</p>
          <p className="text-amber-800 text-[13px] leading-snug font-medium">
            "মুমিনদের মধ্যে সর্বোত্তম সেই ব্যক্তি যার চরিত্র সবচেয়ে সুন্দর।"
          </p>
          <p className="text-amber-600 text-[11px] mt-1.5 font-semibold">— সুনান আত-তিরমিযী</p>
        </div>

        <TrendingTopics />

        {/* Islamic Services */}
        <div className="mb-3">
          <h3 className="text-[14px] font-bold text-green-800">🕌 Islamic Services</h3>
          <p className="text-[11px] text-green-500">ইসলামিক সেবা</p>
        </div>
        {[
          { img: 'https://picsum.photos/seed/isl1/100/100', title: 'অনলাইন Quran শিক্ষা', url: 'quranacademy.com', desc: 'নূরানী পদ্ধতিতে Quran শিখুন।' },
          { img: 'https://picsum.photos/seed/isl2/100/100', title: 'ইসলামিক বইয়ের দোকান', url: 'islamicbooks.com.bd', desc: 'তাফসীর, হাদিস ও ইসলামিক বই।' },
        ].map((ad) => (
          <div key={ad.title} className="flex items-start gap-3 mb-4 cursor-pointer group">
            <img src={ad.img} alt={ad.title} className="w-[80px] h-[80px] rounded-xl object-cover flex-shrink-0 border border-green-200" />
            <div>
              <p className="text-[13px] text-green-900 font-semibold group-hover:text-green-700 leading-snug transition-colors">{ad.title}</p>
              <p className="text-[11px] text-green-600">{ad.url}</p>
              <p className="text-[12px] text-gray-500 mt-0.5 leading-tight">{ad.desc}</p>
            </div>
          </div>
        ))}

        <hr className="border-green-100 my-3" />

        {/* Contacts */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-[14px] font-bold text-green-800">Muslim Contacts</h3>
            <p className="text-[11px] text-green-500">মুসলিম পরিচিতি</p>
          </div>
          <div className="flex gap-1">
            <button className="w-7 h-7 rounded-full hover:bg-green-50 flex items-center justify-center transition-colors">
              <FaSearch className="text-green-600 text-xs" />
            </button>
            <button className="w-7 h-7 rounded-full hover:bg-green-50 flex items-center justify-center transition-colors">
              <FaEllipsisH className="text-green-600 text-xs" />
            </button>
          </div>
        </div>
        <div className="space-y-1">
          {contacts.map((c) => (
            <button key={c.id} onClick={() => navigate(`/profile/${c.id}`)}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-green-50 transition-colors text-left group">
              <div className="relative flex-shrink-0">
                <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full object-cover border-2 border-green-200" />
                {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <span className="text-[14px] text-green-900 font-medium flex-1">{c.name}</span>
              <FaEdit className="text-green-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <hr className="border-green-100 my-3" />
        <p className="text-center text-[11px] text-green-500 arabic">وَاللَّهُ يَهْدِي مَنْ يَشَاءُ</p>
        <p className="text-center text-[11px] text-green-400 mt-1">UmmahBook © 2025 · জাযাকাল্লাহু খায়রান</p>
      </div>
    </aside>
  );
}
