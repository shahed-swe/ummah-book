import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const PRAYER_NAMES = {
  Fajr:    { bn: 'ফজর',   en: 'Fajr',    emoji: '🌙', color: 'from-indigo-900 to-purple-900' },
  Dhuhr:   { bn: 'যোহর',  en: 'Dhuhr',   emoji: '☀️', color: 'from-yellow-600 to-orange-500' },
  Asr:     { bn: 'আসর',   en: 'Asr',     emoji: '🌤️', color: 'from-amber-500 to-yellow-400' },
  Maghrib: { bn: 'মাগরিব', en: 'Maghrib', emoji: '🌅', color: 'from-orange-600 to-red-500'   },
  Isha:    { bn: 'এশা',   en: 'Isha',    emoji: '🌃', color: 'from-blue-900 to-indigo-900'  },
};

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function fmtCountdown(totalMins) {
  if (totalMins <= 0) return null;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h > 0) return `${h} ঘন্টা ${m} মিনিট`;
  return `${m} মিনিট`;
}

function getNextPrayer(timings) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const name of PRAYER_ORDER) {
    if (!timings[name]) continue;
    const t = toMinutes(timings[name]);
    if (t > nowMins) return { name, minsLeft: t - nowMins };
  }
  // All prayers done today → next is Fajr tomorrow
  if (timings.Fajr) {
    const t = toMinutes(timings.Fajr) + 24 * 60;
    return { name: 'Fajr', minsLeft: t - nowMins };
  }
  return null;
}

function toHijri(date) {
  const JD = Math.floor((date.getTime() / 86400000) + 2440587.5);
  let l = JD - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719)
    + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  const MONTHS_BN = ['মুহাররম','সফর','রবিউল আউয়াল','রবিউস সানি','জুমাদাল উলা','জুমাদাস সানি','রজব','শাবান','রমযান','শাওয়াল','যিলকদ','যিলহজ'];
  const MONTHS_EN = ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Ula','Jumada al-Thani','Rajab','Sha\'ban','Ramadan','Shawwal','Dhul Qa\'dah','Dhul Hijjah'];
  return { day, month, year, monthName: MONTHS_BN[month - 1], monthNameEn: MONTHS_EN[month - 1] };
}

function toBnDigits(n) {
  return String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
}

function fmt12(timeStr) {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function PrayerTimesPage() {
  const { lang } = useApp();
  const [timings,  setTimings]  = useState(null);
  const [city,     setCity]     = useState('');
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [now,      setNow]      = useState(new Date());

  // Tick every minute to update countdown
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');

    const fetchByCoords = (lat, lon, cityName) => {
      const today = new Date();
      const ts = Math.floor(today.getTime() / 1000);
      fetch(`https://api.aladhan.com/v1/timings/${ts}?latitude=${lat}&longitude=${lon}&method=1`)
        .then(r => r.json())
        .then(data => {
          if (data.status === 'OK') {
            setTimings(data.data.timings);
            setCity(cityName || data.data.meta?.timezone?.split('/')[1]?.replace('_', ' ') || '');
          } else throw new Error('API error');
        })
        .catch(() => fetchDhaka())
        .finally(() => setLoading(false));
    };

    const fetchDhaka = () => {
      const today = new Date();
      const ts = Math.floor(today.getTime() / 1000);
      fetch(`https://api.aladhan.com/v1/timings/${ts}?latitude=23.8103&longitude=90.4125&method=1`)
        .then(r => r.json())
        .then(data => {
          if (data.status === 'OK') {
            setTimings(data.data.timings);
            setCity('ঢাকা, বাংলাদেশ');
          } else throw new Error();
        })
        .catch(() => {
          // Hard-coded fallback for Dhaka
          setTimings({ Fajr: '04:52', Dhuhr: '12:05', Asr: '15:30', Maghrib: '18:15', Isha: '19:30' });
          setCity('ঢাকা (আনুমানিক)');
        })
        .finally(() => setLoading(false));
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude, ''),
        ()  => fetchDhaka(),
        { timeout: 5000 }
      );
    } else {
      fetchDhaka();
    }
  }, []);

  const nextPrayer = timings ? getNextPrayer(timings) : null;
  const nowMins    = now.getHours() * 60 + now.getMinutes();
  const today      = now.toLocaleDateString(lang === 'en' ? 'en-US' : 'bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijri      = toHijri(now);

  const T = {
    title:   lang === 'en' ? 'Prayer Times'      : 'নামাজের সময়',
    next:    lang === 'en' ? 'Next Prayer'        : 'পরের নামায',
    in:      lang === 'en' ? 'in'                 : '',
    left:    lang === 'en' ? ''                   : 'পরে',
    loc:     lang === 'en' ? 'Location'           : 'অবস্থান',
    loading: lang === 'en' ? 'Loading prayer times...' : 'নামাজের সময় লোড হচ্ছে...',
    hadith:  lang === 'en'
      ? '"Indeed, prayer has been decreed upon the believers a decree of specified times." — Quran 4:103'
      : '"নিশ্চয়ই নামায মুমিনদের উপর নির্দিষ্ট সময়ে ফরজ।" — সূরা নিসা: ১০৩',
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden mb-4 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1a3d0a 0%, #2d6e1a 60%, #1a5c2a 100%)' }}>
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[36px]">🕌</span>
            <div>
              <h1 className="text-[22px] font-bold text-white leading-tight">{T.title}</h1>
              <p className="text-green-200 text-[12px]">{today}</p>
            </div>
          </div>
          {city && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-green-300 text-[12px]">📍 {city}</span>
            </div>
          )}
          {/* Next prayer banner */}
          {nextPrayer && timings && (
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-green-200 text-[11px] font-semibold uppercase tracking-widest">{T.next}</p>
                <p className="text-white text-[20px] font-bold mt-0.5">
                  {lang === 'en' ? nextPrayer.name : PRAYER_NAMES[nextPrayer.name]?.bn}
                  <span className="text-[14px] text-green-200 ml-2">{fmt12(timings[nextPrayer.name])}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-green-200">{T.in}</p>
                <p className="text-[16px] font-bold text-yellow-300">{fmtCountdown(nextPrayer.minsLeft)} {T.left}</p>
              </div>
            </div>
          )}
        </div>
        {/* Arabic */}
        <div className="px-5 pb-4 mt-1">
          <p className="text-center arabic text-green-200/80 text-[14px]">إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا</p>
        </div>
      </div>

      {/* Hijri Calendar Card */}
      <div className="rounded-2xl overflow-hidden mb-4 shadow-md"
        style={{ background: 'linear-gradient(135deg, #1a5c2a 0%, #2d7a3a 50%, #3d6e1a 100%)' }}>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="text-[42px] flex-shrink-0">🗓️</div>
          <div className="flex-1">
            <p className="text-green-200 text-[11px] font-semibold uppercase tracking-widest mb-0.5">
              {lang === 'en' ? 'Hijri Date' : 'হিজরি তারিখ'}
            </p>
            <p className="text-white text-[22px] font-bold leading-tight">
              {lang === 'en'
                ? `${hijri.day} ${hijri.monthNameEn} ${hijri.year} AH`
                : `${toBnDigits(hijri.day)} ${hijri.monthName} ${toBnDigits(hijri.year)}`}
            </p>
            <p className="text-green-300 text-[12px] mt-0.5">{today}</p>
          </div>
        </div>
      </div>

      {/* Prayer cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-[14px]">{T.loading}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {PRAYER_ORDER.map(name => {
            const info   = PRAYER_NAMES[name];
            const time   = timings?.[name] || '—';
            const tMins  = time !== '—' ? toMinutes(time) : -1;
            const isPast = tMins !== -1 && tMins < nowMins;
            const isNext = nextPrayer?.name === name;

            return (
              <div key={name}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all ${
                  isNext
                    ? 'bg-green-50 dark:bg-[#1a4a20]/50 border-green-400 dark:border-[#2d7a3a] shadow-md'
                    : isPast
                    ? 'bg-gray-50/80 dark:bg-[#0f2313]/50 border-gray-100 dark:border-[#1a4a20]/30 opacity-60'
                    : 'bg-white dark:bg-[#0f2313] border-green-100 dark:border-[#1a4a20]'
                }`}>
                {/* Emoji / icon */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center text-[22px] shadow-sm flex-shrink-0`}>
                  {info.emoji}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className={`font-bold text-[17px] ${isNext ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-[#e8f5e9]'}`}>
                    {lang === 'en' ? info.en : info.bn}
                  </p>
                  {isPast && !isNext && (
                    <p className="text-[11px] text-gray-400 dark:text-[#4a7a50]">{lang === 'en' ? 'Completed' : 'সম্পন্ন'}</p>
                  )}
                  {isNext && (
                    <p className="text-[11px] text-green-600 dark:text-green-400 font-semibold">
                      {lang === 'en' ? '▶ Next prayer' : '▶ পরবর্তী নামায'}
                    </p>
                  )}
                </div>

                {/* Time */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-[18px] font-bold tabular-nums ${isNext ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-[#c8e6c9]'}`}>
                    {fmt12(time)}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] tabular-nums">{time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hadith footer */}
      <div className="mt-4 bg-green-50 dark:bg-[#0f2313] border border-green-200 dark:border-[#1a4a20] rounded-2xl px-5 py-4 text-center">
        <p className="text-[13px] text-green-800 dark:text-[#c8e6c9] leading-relaxed italic">{T.hadith}</p>
      </div>

      {/* Note */}
      <p className="text-center text-[11px] text-gray-400 dark:text-[#4a7a50] mt-3 mb-2">
        {lang === 'en' ? 'Times may vary slightly by location · Source: aladhan.com' : 'সময় আপনার অবস্থান অনুযায়ী সামান্য ভিন্ন হতে পারে · উৎস: aladhan.com'}
      </p>
    </div>
  );
}
