import { useState } from 'react';
import { islamicGroups } from '../data/initialData';
import { useApp } from '../context/AppContext';

export default function GroupsPage() {
  const { posts, currentUser } = useApp();

  const [groups, setGroups] = useState(() =>
    JSON.parse(localStorage.getItem('ub_groups') || 'null') || islamicGroups
  );
  const [search,   setSearch]   = useState('');
  const [tab,      setTab]      = useState('browse');
  const [showModal, setShowModal] = useState(false);

  // Create Group modal state
  const [form, setForm] = useState({ name: '', desc: '', type: 'public' });
  const [formErr, setFormErr] = useState('');

  const save = (updated) => {
    setGroups(updated);
    localStorage.setItem('ub_groups', JSON.stringify(updated));
  };

  const toggle = (id) => {
    save(groups.map(g => g.id === id
      ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 }
      : g
    ));
  };

  const createGroup = () => {
    if (!form.name.trim()) { setFormErr('গ্রুপের নাম দিন।'); return; }
    const newGroup = {
      id: Date.now(),
      name: form.name.trim(),
      desc: form.desc.trim() || 'ইসলামিক আলোচনা গ্রুপ',
      type: form.type,
      members: 1,
      posts: 0,
      joined: true,
      img: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name.trim())}&background=2d7a3a&color=fff&size=128`,
    };
    const updated = [newGroup, ...groups];
    save(updated);
    setForm({ name: '', desc: '', type: 'public' });
    setFormErr('');
    setShowModal(false);
    setTab('joined');
  };

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) || (g.desc || '').includes(search)
  );
  const joined = groups.filter(g => g.joined);

  // Group posts: posts from any user (show all public posts as "group feed")
  const groupPosts = posts.filter(p => p.privacy === 'public' || p.privacy === undefined).slice(0, 20);

  const fmtMembers = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const tabBtnClass = (key) =>
    `px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
      tab === key
        ? 'bg-green-700 text-white shadow-sm'
        : 'bg-white dark:bg-[#0f2313] text-gray-500 dark:text-[#4a7a50] border border-green-100 dark:border-[#1a4a20] hover:bg-green-50 dark:hover:bg-[#142d18]'
    }`;

  return (
    <div className="fade-in space-y-3">
      {/* Header */}
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-[28px]">👥</span>
            <div>
              <h2 className="font-bold text-[18px] text-green-800 dark:text-[#c8e6c9]">Islamic Groups</h2>
              <p className="text-[12px] text-gray-500 dark:text-[#6abf69]">{groups.length} groups · {joined.length} joined</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-[12px] font-bold px-3 py-2 rounded-xl transition-all shadow-sm flex-shrink-0">
            <span>➕</span>
            <span>গ্রুপ তৈরি করুন</span>
          </button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search groups / গ্রুপ খুঁজুন..."
          className="w-full px-3 py-2.5 rounded-xl border border-green-200 dark:border-[#1a4a20] bg-green-50/50 dark:bg-[#142d18] text-[13px] text-gray-800 dark:text-[#e8f5e9] focus:outline-none focus:ring-2 focus:ring-green-400 transition-all" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setTab('browse')}  className={tabBtnClass('browse')}>সব গ্রুপ</button>
        <button onClick={() => setTab('joined')}  className={tabBtnClass('joined')}>যোগ দিয়েছেন {joined.length > 0 && `(${joined.length})`}</button>
        <button onClick={() => setTab('posts')}   className={tabBtnClass('posts')}>গ্রুপ পোস্ট</button>
      </div>

      {/* Browse Tab */}
      {tab === 'browse' && (
        <>
          {joined.length > 0 && (
            <div className="card p-4">
              <div className="mb-3">
                <h3 className="font-bold text-[15px] text-green-700 dark:text-green-400">✅ আপনার গ্রুপ</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {joined.map(g => (
                  <div key={g.id} className="flex items-center gap-2 bg-green-50 dark:bg-[#142d18] border border-green-200 dark:border-[#1a4a20] rounded-xl px-3 py-2">
                    <img src={g.img} alt={g.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-[13px] font-semibold text-green-700 dark:text-green-400">{g.name}</span>
                    {g.type === 'private' && <span className="text-[10px] text-gray-400">🔒</span>}
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
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[14px] text-green-800 dark:text-[#c8e6c9] truncate">{g.name}</h3>
                      {g.type === 'private' && <span className="text-[10px] text-gray-400 dark:text-[#4a7a50] flex-shrink-0">🔒</span>}
                    </div>
                    <p className="text-[12px] text-gray-500 dark:text-[#6abf69]">
                      {fmtMembers(g.members)} সদস্য · {g.posts} পোস্ট
                    </p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-500 dark:text-[#6abf69] mt-2 line-clamp-2">{g.desc}</p>
                <button onClick={() => toggle(g.id)}
                  className={`mt-3 w-full py-2 rounded-xl font-bold text-[13px] transition-all leading-tight ${
                    g.joined
                      ? 'bg-green-50 dark:bg-[#0f2313] text-green-700 dark:text-green-400 border border-green-300 dark:border-[#1a4a20] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200'
                      : 'bg-green-700 text-white hover:bg-green-800'
                  }`}>
                  {g.joined ? '✅ যোগ দিয়েছেন' : '➕ যোগ দিন'}
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card p-8 text-center text-green-600 dark:text-green-400">
              <p className="text-[32px] mb-2">🔍</p>
              <p className="font-bold">No groups found</p>
              <p className="text-[13px] mt-1">কোনো গ্রুপ পাওয়া যায়নি।</p>
            </div>
          )}
        </>
      )}

      {/* Joined Tab */}
      {tab === 'joined' && (
        <>
          {joined.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-[36px] mb-2">👥</p>
              <p className="font-bold text-gray-700 dark:text-[#c8e6c9]">কোনো গ্রুপে যোগ দেননি</p>
              <p className="text-[13px] text-gray-500 dark:text-[#6abf69] mt-1">সব গ্রুপ ট্যাব থেকে গ্রুপে যোগ দিন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {joined.map(g => (
                <div key={g.id} className="card p-4 hover:shadow-md transition-all fade-in">
                  <div className="flex gap-3 items-center">
                    <img src={g.img} alt={g.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-[14px] text-green-800 dark:text-[#c8e6c9] truncate">{g.name}</h3>
                        {g.type === 'private' && <span className="text-[10px] text-gray-400">🔒</span>}
                      </div>
                      <p className="text-[12px] text-gray-500 dark:text-[#6abf69]">{fmtMembers(g.members)} সদস্য</p>
                      <span className="inline-block mt-1 bg-green-100 dark:bg-[#142d18] text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">✅ সদস্য</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-gray-500 dark:text-[#6abf69] mt-2 line-clamp-2">{g.desc}</p>
                  <button onClick={() => toggle(g.id)}
                    className="mt-3 w-full py-2 rounded-xl font-bold text-[13px] transition-all bg-green-50 dark:bg-[#0f2313] text-green-700 dark:text-green-400 border border-green-300 dark:border-[#1a4a20] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-200">
                    গ্রুপ ছেড়ে দিন
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Group Posts Tab */}
      {tab === 'posts' && (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-[#0f2313] border border-green-200 dark:border-[#1a4a20] rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-[18px]">📰</span>
            <p className="text-[13px] text-green-700 dark:text-green-400 font-semibold">
              গ্রুপ ফিড — সকল পাবলিক পোস্ট
            </p>
          </div>

          {groupPosts.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-[36px] mb-2">📭</p>
              <p className="font-bold text-gray-700 dark:text-[#c8e6c9]">কোনো পোস্ট নেই</p>
            </div>
          ) : (
            groupPosts.map(p => (
              <div key={p.id} className="card p-4 hover:shadow-md transition-all">
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={p.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.user?.name || 'U')}&background=2d7a3a&color=fff`}
                    alt={p.user?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-green-200 dark:border-[#1a4a20]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] text-gray-800 dark:text-[#e8f5e9] truncate">{p.user?.name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-[#4a7a50]">{p.time}</p>
                  </div>
                  {p.type === 'hadith' && (
                    <span className="text-[10px] bg-green-100 dark:bg-[#142d18] text-green-700 dark:text-green-400 font-bold px-2 py-0.5 rounded-full">হাদিস</span>
                  )}
                </div>

                {/* Arabic */}
                {p.arabic && (
                  <p className="arabic text-[16px] text-green-800 dark:text-green-300 text-right leading-loose mb-2 px-1">{p.arabic}</p>
                )}

                {/* Content */}
                {p.content && (
                  <p className="text-[13px] text-gray-700 dark:text-[#c8e6c9] leading-relaxed mb-2 whitespace-pre-line line-clamp-4">{p.content}</p>
                )}

                {/* Image */}
                {p.image && (
                  <img src={p.image} alt="" className="w-full rounded-xl object-cover max-h-48 mb-2" />
                )}

                {/* Reactions bar */}
                <div className="flex items-center gap-4 pt-2 border-t border-green-50 dark:border-[#1a4a20] text-[12px] text-gray-500 dark:text-[#6abf69]">
                  <span>❤️ {p.likes}</span>
                  <span>💬 {p.comments}</span>
                  <span>🔁 {p.shares}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Group Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white dark:bg-[#0f2313] rounded-2xl shadow-2xl w-full max-w-md border border-green-200 dark:border-[#1a4a20] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #1a5c2a 0%, #2d7a3a 100%)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[22px]">👥</span>
                <div>
                  <h3 className="font-bold text-white text-[16px]">গ্রুপ তৈরি করুন</h3>
                  <p className="text-green-200 text-[11px]">Create Islamic Group</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-[16px] transition-all">
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-gray-600 dark:text-[#8bc34a] mb-1 block">গ্রুপের নাম *</label>
                <input
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormErr(''); }}
                  placeholder="যেমন: তাফসীর আলোচনা"
                  className="w-full px-3 py-2.5 rounded-xl border border-green-200 dark:border-[#1a4a20] bg-green-50/50 dark:bg-[#142d18] text-[14px] text-gray-800 dark:text-[#e8f5e9] focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-600 dark:text-[#8bc34a] mb-1 block">বিবরণ</label>
                <textarea
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  placeholder="গ্রুপের উদ্দেশ্য বা বিষয় লিখুন..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-green-200 dark:border-[#1a4a20] bg-green-50/50 dark:bg-[#142d18] text-[14px] text-gray-800 dark:text-[#e8f5e9] focus:outline-none focus:ring-2 focus:ring-green-400 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-gray-600 dark:text-[#8bc34a] mb-2 block">গ্রুপের ধরন</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'public', icon: '🌐', label: 'পাবলিক', sub: 'সবাই দেখতে পারবে' },
                    { val: 'private', icon: '🔒', label: 'প্রাইভেট', sub: 'শুধু সদস্যরা' },
                  ].map(opt => (
                    <button key={opt.val}
                      onClick={() => setForm(f => ({ ...f, type: opt.val }))}
                      className={`rounded-xl px-3 py-3 text-left transition-all border ${
                        form.type === opt.val
                          ? 'bg-green-50 dark:bg-[#1a4a20] border-green-400 dark:border-green-600'
                          : 'bg-white dark:bg-[#142d18] border-green-100 dark:border-[#1a4a20] hover:bg-green-50/50'
                      }`}>
                      <span className="text-[18px] block mb-0.5">{opt.icon}</span>
                      <p className="text-[13px] font-bold text-gray-800 dark:text-[#e8f5e9]">{opt.label}</p>
                      <p className="text-[11px] text-gray-500 dark:text-[#6abf69]">{opt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {formErr && (
                <p className="text-[12px] text-red-500 dark:text-red-400 font-semibold">{formErr}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-green-200 dark:border-[#1a4a20] text-gray-600 dark:text-[#8bc34a] text-[13px] font-bold hover:bg-green-50 dark:hover:bg-[#142d18] transition-all">
                  বাতিল
                </button>
                <button onClick={createGroup}
                  className="flex-1 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-[13px] font-bold transition-all shadow-sm">
                  গ্রুপ তৈরি করুন ✅
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
