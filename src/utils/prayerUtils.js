import { Coordinates, PrayerTimes, CalculationMethod, Madhab, Prayer } from 'adhan';

const COORDS = new Coordinates(23.8103, 90.4125); // Dhaka, Bangladesh

const PRAYER_META = {
  fajr:    { name: 'Fajr',    bn: 'ফজর',    icon: '🌅' },
  dhuhr:   { name: 'Dhuhr',   bn: 'জোহর',   icon: '🌤️' },
  asr:     { name: 'Asr',     bn: 'আসর',    icon: '⛅' },
  maghrib: { name: 'Maghrib', bn: 'মাগরিব',  icon: '🌇' },
  isha:    { name: 'Isha',    bn: 'ইশা',    icon: '🌙' },
};

function fmt(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getPT(date) {
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Hanafi;
  return new PrayerTimes(COORDS, date, params);
}

export function getTodayPrayerTimes() {
  const now = new Date();
  const pt = getPT(now);

  // Tomorrow's Fajr = Isha end time
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ptTomorrow = getPT(tomorrow);

  // Each prayer's end time = next prayer's start time
  const endTimes = {
    fajr:    pt.sunrise,
    dhuhr:   pt.asr,
    asr:     pt.maghrib,
    maghrib: pt.isha,
    isha:    ptTomorrow.fajr,
  };

  const prayers = [
    { key: 'fajr',    time: pt.fajr },
    { key: 'dhuhr',   time: pt.dhuhr },
    { key: 'asr',     time: pt.asr },
    { key: 'maghrib', time: pt.maghrib },
    { key: 'isha',    time: pt.isha },
  ];

  const currentKey = pt.currentPrayer();
  const nextKey    = pt.nextPrayer();

  // Progress % within current prayer window
  const progressPct = (prayer) => {
    const start = prayer.time.getTime();
    const end   = endTimes[prayer.key].getTime();
    const pct   = ((now.getTime() - start) / (end - start)) * 100;
    return Math.min(100, Math.max(0, pct));
  };

  return {
    prayers: prayers.map(p => ({
      ...p,
      ...PRAYER_META[p.key],
      formatted:    fmt(p.time),
      endFormatted: fmt(endTimes[p.key]),
      endTime:      endTimes[p.key],
      isCurrent:    p.key === currentKey,
      isNext:       p.key === nextKey,
      progress:     p.key === currentKey ? progressPct(p) : 0,
    })),
    nextPrayer: nextKey !== Prayer.None ? {
      ...PRAYER_META[nextKey],
      time:      pt.timeForPrayer(nextKey),
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
