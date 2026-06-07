import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Stories from '../components/Stories';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import FriendSuggestions from '../components/FriendSuggestions';
import IslamicEventCard from '../components/IslamicEventCard';
import { getTodayPrayerTimes, getTimeUntilNext } from '../utils/prayerUtils';

function BismillahBanner() {
  const DUAS = [
    { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', bn: 'হে আমাদের রব! আমাদের দুনিয়ায় কল্যাণ দাও এবং আখিরাতেও কল্যাণ দাও এবং আমাদের আগুনের আযাব থেকে রক্ষা করো।' },
    { ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', bn: 'হে আমার রব! আমার বুক প্রশস্ত করে দাও এবং আমার কাজ সহজ করে দাও।' },
    { ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', bn: 'হে আল্লাহ! আমি দুশ্চিন্তা ও দুঃখ থেকে আপনার আশ্রয় চাই।' },
  ];
  const dua = DUAS[new Date().getDate() % DUAS.length];
  return (
    <div className="card mb-3 overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="pattern-bg px-4 py-4 text-center">
        <p className="text-green-200 text-[11px] font-semibold mb-1 tracking-wide">
          ☪️ بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p className="arabic text-white text-[18px] font-bold leading-loose">{dua.ar}</p>
      </div>
      <div className="bg-white dark:bg-[#0f2313] px-4 py-3 text-center">
        <p className="text-green-700 dark:text-green-400 text-[13px] leading-relaxed">{dua.bn}</p>
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
