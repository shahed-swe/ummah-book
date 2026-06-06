const events = [
  {
    id: 1,
    title: 'জুমার খুতবা লাইভ',
    subtitle: 'বায়তুল মোকাররম মসজিদ, ঢাকা',
    time: 'আজ · দুপুর ১২:৩০',
    emoji: '🕌',
    color: 'from-green-600 to-green-800',
    attendees: 2340,
  },
  {
    id: 2,
    title: 'Quran Tafsir Class',
    subtitle: 'Online · Zoom Meeting',
    time: 'আজ রাত ৮:০০',
    emoji: '📖',
    color: 'from-emerald-600 to-teal-800',
    attendees: 856,
  },
  {
    id: 3,
    title: 'ঈদুল আযহা প্রস্তুতি',
    subtitle: 'Community Gathering',
    time: '৭ জুন · সকাল ৯:০০',
    emoji: '🐑',
    color: 'from-amber-600 to-orange-700',
    attendees: 1200,
  },
];

export default function IslamicEventCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
      {/* Header */}
      <div className="pattern-bg px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-[15px]">📅 Islamic Events</p>
          <p className="text-green-300 text-[11px]">ইসলামিক অনুষ্ঠান ও কার্যক্রম</p>
        </div>
        <button className="text-green-300 text-[13px] font-semibold hover:text-white transition-colors">See all</button>
      </div>

      <div className="divide-y divide-green-50">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center flex-shrink-0 text-2xl shadow`}>
              {event.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[14px] text-[#1a1a1a] group-hover:text-green-700 transition-colors truncate">{event.title}</p>
              <p className="text-[12px] text-[#65676b] truncate">{event.subtitle}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-green-600 font-medium">🕐 {event.time}</span>
                <span className="text-[11px] text-[#65676b]">· {event.attendees.toLocaleString()} going</span>
              </div>
            </div>
            <button className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-bold text-[12px] transition-colors">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
