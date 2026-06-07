import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Stories from '../components/Stories';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import FriendSuggestions from '../components/FriendSuggestions';
import IslamicEventCard from '../components/IslamicEventCard';
import { getTodayPrayerTimes, getTimeUntilNext } from '../utils/prayerUtils';

function getHijriDate() {
  const date = new Date();
  const JD = Math.floor((date.getTime() / 86400000) + 2440587.5);
  let l = JD - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  const BN_MONTHS = ['মুহাররম','সফর','রবিউল আউয়াল','রবিউস সানি','জুমাদাল উলা','জুমাদাস সানি','রজব','শাবান','রমযান','শাওয়াল','যিলকদ','যিলহজ'];
  const BN_NUMS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  const toBN = n => String(n).split('').map(d => BN_NUMS[+d]).join('');
  return `${toBN(day)} ${BN_MONTHS[month-1]} ${toBN(year)}`;
}

function BismillahBanner() {
  const DUAS = [
    { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', bn: 'হে আমাদের রব! আমাদের দুনিয়ায় কল্যাণ দাও এবং আখিরাতেও কল্যাণ দাও এবং আমাদের আগুনের আযাব থেকে রক্ষা করো।' },
    { ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', bn: 'হে আমার রব! আমার বুক প্রশস্ত করে দাও এবং আমার কাজ সহজ করে দাও।' },
    { ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', bn: 'হে আল্লাহ! আমি দুশ্চিন্তা ও দুঃখ থেকে আপনার আশ্রয় চাই।' },
  ];
  const dua = DUAS[new Date().getDate() % DUAS.length];
  const hijri = getHijriDate();
  return (
    <div className="card mb-3 overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="pattern-bg px-4 py-4 text-center">
        <p className="text-green-200 text-[11px] font-semibold mb-1 tracking-wide">
          ☪️ بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p className="arabic text-white text-[18px] font-bold leading-loose">{dua.ar}</p>
        <p className="text-green-300 text-[11px] mt-2 font-medium">📅 {hijri} হিজরি</p>
      </div>
      <div className="bg-white dark:bg-[#0f2313] px-4 py-3 text-center">
        <p className="text-green-700 dark:text-green-400 text-[13px] leading-relaxed">{dua.bn}</p>
      </div>
    </div>
  );
}

function AzkarReminderBanner() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const isMorning = hour >= 4 && hour < 10;
  const isEvening = hour >= 16 && hour < 20;

  const todayKey = `ub_azkar_dismissed_${new Date().toISOString().slice(0, 10)}`;
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(todayKey) === '1'; }
    catch { return false; }
  });

  if (dismissed || (!isMorning && !isEvening)) return null;

  const handleDismiss = (e) => {
    e.stopPropagation();
    try { localStorage.setItem(todayKey, '1'); }
    catch {}
    setDismissed(true);
  };

  const morningText = { icon: '🌅', title: 'সকালের আযকার পড়েছেন?', sub: 'Sabah Azkar — Morning Remembrance' };
  const eveningText = { icon: '🌆', title: 'বিকেলের আযকার পড়েছেন?', sub: 'Masa Azkar — Evening Remembrance' };
  const { icon, title, sub } = isMorning ? morningText : eveningText;

  return (
    <div
      className="card mb-3 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      style={{ borderRadius: '16px', border: '1px solid rgba(34,197,94,0.3)' }}
      onClick={() => navigate('/dua')}>
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-[#0f2313] dark:to-[#0a1a0d]">
        <span className="text-[28px] flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[13px] text-green-900 dark:text-green-300 leading-tight">{title}</p>
          <p className="text-[11px] text-green-600 dark:text-green-500 mt-0.5">{sub}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">
            পড়ুন →
          </span>
          <button
            onClick={handleDismiss}
            className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-[12px] font-bold"
            aria-label="Dismiss">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

function MobilePrayerStrip() {
  const navigate = useNavigate();
  const [data, setData] = useState(() => getTodayPrayerTimes());
  const [now,  setNow]  = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => { setData(getTodayPrayerTimes()); setNow(new Date()); }, 60000);
    return () => clearInterval(tick);
  }, []);

  const nextP    = data.nextPrayer;
  const countdown = nextP ? getTimeUntilNext(nextP.time) : '';
  const prayers5  = data.prayers;

  return (
    <div
      onClick={() => navigate('/prayer-times')}
      className="card mb-3 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      style={{ borderRadius: '16px' }}>
      <div className="pattern-bg px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[22px]">🕌</span>
          <div>
            <p className="text-white font-bold text-[13px] leading-tight">নামাজের সময়</p>
            <p className="text-green-200 text-[11px]">Prayer Times</p>
          </div>
        </div>
        {nextP && countdown && (
          <div className="text-right">
            <p className="text-yellow-300 text-[11px] font-bold">{nextP.icon} {nextP.bn}</p>
            <p className="text-green-200 text-[10px]">{countdown} পরে</p>
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-[#0f2313] px-3 py-2 flex justify-between">
        {prayers5.map(p => (
          <div key={p.key} className="flex flex-col items-center gap-0.5">
            <span className="text-[14px]">{p.icon}</span>
            <p className={`font-bold text-[10px] leading-none ${p.isNext ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-[#4a7a50]'}`}>{p.bn}</p>
            <p className={`text-[10px] leading-none ${p.isNext ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-400 dark:text-[#4a7a50]'}`}>{p.formatted}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { posts } = useApp();

  return (
    <div className="space-y-3">
      <BismillahBanner />
      <AzkarReminderBanner />
      {/* Prayer strip — visible on mobile only (xl hides when right sidebar shows) */}
      <div className="xl:hidden">
        <MobilePrayerStrip />
      </div>
      <Stories />
      <CreatePost />
      {posts.map(post => <Post key={post.id} post={post} />)}
      <FriendSuggestions />
      <IslamicEventCard />
      <div className="card p-4 text-center text-[13px] text-green-600 dark:text-[#4a7a50]">
        <p className="arabic text-[16px] mb-1">وَاللَّهُ خَيْرٌ وَأَبْقَى</p>
        <p>আল্লাহই সর্বোত্তম এবং চিরস্থায়ী · UmmahBook © 2025</p>
      </div>
    </div>
  );
}
