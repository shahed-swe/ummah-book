import { Coordinates, PrayerTimes, CalculationMethod, Madhab, Prayer } from 'adhan';

// Dhaka, Bangladesh
const COORDS = new Coordinates(23.8103, 90.4125);

const PRAYER_META = {
  fajr:    { name: 'Fajr',    bn: 'ফজর',   icon: '🌅' },
  sunrise: { name: 'Sunrise', bn: 'সূর্যোদয়', icon: '☀️' },
  dhuhr:   { name: 'Dhuhr',   bn: 'জোহর',  icon: '🌤️' },
  asr:     { name: 'Asr',     bn: 'আসর',   icon: '⛅' },
  maghrib: { name: 'Maghrib', bn: 'মাগরিব', icon: '🌇' },
  isha:    { name: 'Isha',    bn: 'ইশা',   icon: '🌙' },
};

function fmt(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function getTodayPrayerTimes() {
  const now = new Date();
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Hanafi;
  const pt = new PrayerTimes(COORDS, now, params);

  const prayers = [
    { key: 'fajr',    time: pt.fajr },
    { key: 'dhuhr',   time: pt.dhuhr },
    { key: 'asr',     time: pt.asr },
    { key: 'maghrib', time: pt.maghrib },
    { key: 'isha',    time: pt.isha },
  ];

  const currentKey = pt.currentPrayer();
  const nextKey    = pt.nextPrayer();

  return {
    prayers: prayers.map(p => ({
      ...p,
      ...PRAYER_META[p.key],
      formatted: fmt(p.time),
      isCurrent: p.key === currentKey,
      isNext: p.key === nextKey,
    })),
    nextPrayer: nextKey !== Prayer.None ? {
      ...PRAYER_META[nextKey],
      time: pt.timeForPrayer(nextKey),
      formatted: fmt(pt.timeForPrayer(nextKey)),
    } : null,
  };
}

export function getTimeUntilNext(nextPrayerTime) {
  if (!nextPrayerTime) return '';
  const diff = nextPrayerTime - new Date();
  if (diff <= 0) return '';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}
