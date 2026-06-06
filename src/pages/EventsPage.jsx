import { useState, useEffect } from 'react';
import api from '../services/api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events')
      .then(r => setEvents(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const respond = async (id, responseType) => {
    const ev = events.find(e => e.id === id);
    const prev = ev?.status;
    const isSame = prev === responseType;
    const newStatus = isSame ? null : responseType;

    // Optimistic update
    setEvents(prev => prev.map(e => {
      if (e.id !== id) return e;
      let going = e.going, interested = e.interested;
      if (prev === 'going') going = Math.max(0, going - 1);
      if (prev === 'interested') interested = Math.max(0, interested - 1);
      if (!isSame && responseType === 'going') going += 1;
      if (!isSame && responseType === 'interested') interested += 1;
      return { ...e, status: newStatus, going, interested };
    }));

    try {
      await api.post(`/events/${id}/respond`, { responseType: isSame ? null : responseType });
    } catch {
      // Revert on error
      api.get('/events').then(r => setEvents(r.data));
    }
  };

  const going = events.filter(e => e.status === 'going');
  const interested = events.filter(e => e.status === 'interested');

  if (loading) return (
    <div className="card p-8 text-center text-green-600">
      <p className="text-[32px] mb-2">⏳</p><p>ইভেন্ট লোড হচ্ছে...</p>
    </div>
  );

  return (
    <div className="fade-in space-y-3">
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[28px]">📅</span>
          <div>
            <h2 className="font-bold text-[18px] text-green-800">ইসলামিক ইভেন্ট</h2>
            <p className="text-[12px] text-gray-500">{events.length}টি আসন্ন ইভেন্ট</p>
          </div>
        </div>
        <div className="flex gap-4 text-[13px] mt-3">
          <div className="flex items-center gap-1.5 text-green-700 font-semibold">
            <span className="text-[16px]">✅</span> {going.length} যাচ্ছেন
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
            <span className="text-[16px]">⭐</span> {interested.length} আগ্রহী
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {events.map(ev => (
          <div key={ev.id} className="card overflow-hidden hover:shadow-lg transition-all fade-in">
            <div className={`bg-gradient-to-r ${ev.color} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[36px]">{ev.emoji}</span>
                  <div>
                    <h3 className="font-bold text-white text-[16px]">{ev.title}</h3>
                    <span className="text-[10px] bg-white/25 text-white px-2 py-0.5 rounded-full font-semibold">{ev.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-[15px]">{ev.date}</p>
                  <p className="text-green-100 text-[12px]">{ev.time}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
                <span>📍</span><span>{ev.location}</span>
              </div>
              <div className="flex gap-4 text-[12px] text-gray-500 mb-4">
                <span>✅ {ev.going.toLocaleString()} জন যাচ্ছেন</span>
                <span>⭐ {ev.interested.toLocaleString()} জন আগ্রহী</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => respond(ev.id, 'going')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-[13px] transition-all ${
                    ev.status === 'going'
                      ? 'bg-green-700 text-white'
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}>
                  {ev.status === 'going' ? '✅ যাচ্ছেন' : '✅ যাব'}
                </button>
                <button onClick={() => respond(ev.id, 'interested')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-[13px] transition-all ${
                    ev.status === 'interested'
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  }`}>
                  ⭐ আগ্রহী
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
