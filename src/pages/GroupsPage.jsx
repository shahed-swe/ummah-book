import { useState, useEffect } from 'react';
import api from '../services/api';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/groups')
      .then(r => setGroups(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id, joined) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, joined: !joined, members: joined ? g.members - 1 : g.members + 1 } : g));
    try {
      if (joined) await api.delete(`/groups/${id}/leave`);
      else await api.post(`/groups/${id}/join`);
    } catch {
      setGroups(prev => prev.map(g => g.id === id ? { ...g, joined, members: joined ? g.members + 1 : g.members - 1 } : g));
    }
  };

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) || (g.desc || '').includes(search)
  );
  const joined = groups.filter(g => g.joined);

  if (loading) return (
    <div className="card p-8 text-center text-green-600">
      <p className="text-[32px] mb-2">⏳</p><p>গ্রুপ লোড হচ্ছে...</p>
    </div>
  );

  return (
    <div className="fade-in space-y-3">
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[28px]">👥</span>
          <div>
            <h2 className="font-bold text-[18px] text-green-800">ইসলামিক গ্রুপ</h2>
            <p className="text-[12px] text-gray-500">{groups.length}টি গ্রুপ · {joined.length}টিতে যোগ দিয়েছেন</p>
          </div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 গ্রুপ খুঁজুন..." className="input-base" />
      </div>

      {joined.length > 0 && (
        <div className="card p-4">
          <h3 className="font-bold text-[15px] text-green-700 mb-3">✅ আপনার গ্রুপ</h3>
          <div className="flex flex-wrap gap-2">
            {joined.map(g => (
              <div key={g.id} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <img src={g.img} alt={g.name} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-[13px] font-semibold text-green-700">{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(g => (
          <div key={g.id} className="card p-4 hover:shadow-md transition-all fade-in">
            <div className="flex gap-3">
              <img src={g.img} alt={g.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[14px] text-green-800 truncate">{g.name}</h3>
                <p className="text-[12px] text-gray-500">{(g.members / 1000).toFixed(1)}k সদস্য · {g.posts} পোস্ট</p>
              </div>
            </div>
            <p className="text-[12px] text-gray-500 mt-2 line-clamp-2">{g.desc}</p>
            <button onClick={() => toggle(g.id, g.joined)}
              className={`mt-3 w-full py-2 rounded-xl font-bold text-[13px] transition-all ${
                g.joined
                  ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  : 'bg-green-700 text-white hover:bg-green-800'
              }`}>
              {g.joined ? '✅ যোগ দিয়েছেন' : '➕ যোগ দিন'}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-8 text-center text-green-600">
          <p className="text-[32px] mb-2">🔍</p>
          <p>কোনো গ্রুপ পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}
