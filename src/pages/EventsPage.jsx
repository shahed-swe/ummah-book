import { useState } from 'react';
import { islamicEvents } from '../data/initialData';

export default function EventsPage() {
  const [events, setEvents] = useState(() =>
    JSON.parse(localStorage.getItem('ub_events') || 'null') || islamicEvents.map(e => ({ ...e, status: null }))
  );

  const save = (updated) => {
    setEvents(updated);
    localStorage.setItem('ub_events', JSON.stringify(updated));
  };

  const respond = (id, responseType) => {
    save(events.map(e => {
      if (e.id !== id) return e;
      const prev = e.status;
      const isSame = prev === responseType;
      const newStatus = isSame ? null : responseType;
      let going = e.going, interested = e.interested;
      if (prev === 'going') going = Math.max(0, going - 1);
      if (prev === 'interested') interested = Math.max(0, interested - 1);
      if (!isSame && responseType === 'going') going += 1;
      if (!isSame && responseType === 'interested') interested += 1;
      return { ...e, status: newStatus, going, interested };
    }));
  };

  const going = events.filter(e => e.status === 'going');
  const interested = events.filter(e => e.status === 'interested');

  return (
    <div className="fade-in space-y-3">
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[28px]">📅</span>
          <div>
            <h2 className="font-bold text-[18px] text-green-800">Islamic Events</h2>
            <p className="text-[13px] text-green-600 font-medium">ইসলামিক ইভেন্ট</p>
            <p className="text-[12px] text-gray-500">{events.length} upcoming events · আসন্ন ইভেন্ট</p>
          </div>
        </div>
        <div className="flex gap-4 text-[13px] mt-3">
          <div className="flex items-center gap-1.5 text-green-700 font-semibold">
            <span className="text-[16px]">✅</span>
            <div>
              <span className="font-bold">{going.length} Going</span>
              <span className="text-[11px] text-green-500 ml-1">· যাচ্ছেন</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
            <span className="text-[16px]">⭐</span>
            <div>
              <span className="font-bold">{interested.length} Interested</span>
              <span className="text-[11px] text-amber-400 ml-1">· আগ্রহী</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {events.map(ev => (
          <div key={ev.id} className="card overflow-hidden hover:shadow-lg transition-all fade-in">
            <div className={`bg-gradient-to-r ${ev.color} p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[28px] sm:text-[36px] shrink-0">{ev.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-[14px] sm:text-[16px] leading-snug">{ev.title}</h3>
                    <span className="text-[10px] bg-white/25 text-white px-2 py-0.5 rounded-full font-semibold">{ev.type}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-bold text-[13px] sm:text-[15px]">{ev.date}</p>
                  <p className="text-green-100 text-[11px] sm:text-[12px]">{ev.time}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
                <span>📍</span><span>{ev.location}</span>
              </div>
              <div className="flex gap-4 text-[12px] text-gray-500 mb-4">
                <span>✅ {ev.going.toLocaleString()} going · যাচ্ছেন</span>
                <span>⭐ {ev.interested.toLocaleString()} interested · আগ্রহী</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => respond(ev.id, 'going')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-[13px] transition-all leading-tight ${
                    ev.status === 'going'
                      ? 'bg-green-700 text-white'
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}>
                  <p>✅ {ev.status === 'going' ? 'Going' : 'Going?'}</p>
                  <p className="text-[11px] opacity-80">{ev.status === 'going' ? 'যাচ্ছেন' : 'যাব'}</p>
                </button>
                <button onClick={() => respond(ev.id, 'interested')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-[13px] transition-all leading-tight ${
                    ev.status === 'interested'
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  }`}>
                  <p>⭐ Interested</p>
                  <p className="text-[11px] opacity-80">আগ্রহী</p>
                </button>
                <button className="px-3 py-2.5 rounded-xl bg-gray-50 text-gray-600 border border-gray-200 text-[13px] hover:bg-gray-100">
                  🔁
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
