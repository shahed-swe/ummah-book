import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

// ── helpers ────────────────────────────────────────────────────────────────────

function resizeImage(file, maxSize, quality, cb) {
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const scale = Math.min(1, maxSize / img.width, maxSize / img.height);
    const canvas = document.createElement('canvas');
    canvas.width  = Math.round(img.width  * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    cb(canvas.toDataURL('image/jpeg', quality));
  };
  img.src = url;
}

function fmtBirthday(d) {
  if (!d) return d;
  try {
    const [y, m, day] = d.split('-');
    const months = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
    return `${parseInt(day)} ${months[parseInt(m) - 1]}, ${y}`;
  } catch { return d; }
}

const ROLE_BADGE = {
  'Hafiz':                   { label:'Hafiz 📗',        bg:'#d1fae5', color:'#065f46' },
  'Imam':                    { label:'Imam 🕌',          bg:'#dcfce7', color:'#166534' },
  'Alim':                    { label:'Alim 📚',          bg:'#ccfbf1', color:'#0f766e' },
  'Quran Teacher':           { label:'Quran Teacher 📖', bg:'#d9f99d', color:'#3f6212' },
  'Student of Knowledge':    { label:'Talib ul Ilm 📚',  bg:'#dbeafe', color:'#1e40af' },
  'Madrasa Student':         { label:'Madrasa 🏫',       bg:'#fef9c3', color:'#92400e' },
  'Islamic Content Creator': { label:'Creator 🎙️',      bg:'#ede9fe', color:'#6d28d9' },
  'Admin':                   { label:'Admin ✅',          bg:'#f1f5f9', color:'#475569' },
};

const ROLE_OPTIONS    = ['','Regular Muslim','Hafiz','Imam','Alim','Student of Knowledge','Madrasa Student','Quran Teacher','Islamic Content Creator'];
const MADHHAB_OPTIONS = ['','হানাফি (Hanafi)',"শাফেয়ি (Shafi'i)",'মালিকি (Maliki)','হাম্বলি (Hanbali)','জানি না'];
const GENDER_OPTIONS  = ['','পুরুষ (Male)','মহিলা (Female)','বলতে চাই না'];
const QURAN_OPTIONS   = ['','হাফেজ — পুরো কুরআন মুখস্থ','নিয়মিত তিলাওয়াত করি','শিখছি','মাঝে মাঝে পড়ি'];

// ── Edit Profile Modal ─────────────────────────────────────────────────────────

function EditProfileModal({ user, onClose, onSave }) {
  const { darkMode } = useApp();

  const [form, setForm] = useState({
    name:user.name||'', bio:user.bio||'', birthday:user.birthday||'', gender:user.gender||'',
    work:user.work||'', position:user.position||'', education:user.education||'',
    islamicRole:user.islamicRole||'', masjid:user.masjid||'', madhhab:user.madhhab||'', quranStatus:user.quranStatus||'',
    location:user.location||'', hometown:user.hometown||'', country:user.country||'',
    phone:user.phone||'', website:user.website||'',
  });
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [pendingCover,  setPendingCover]  = useState(null);
  const avatarRef = useRef(null);
  const coverRef  = useRef(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const h = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    const u = { ...form };
    if (pendingAvatar) u.avatar     = pendingAvatar;
    if (pendingCover)  u.coverPhoto = pendingCover;
    onSave(u); onClose();
  };

  const changed = Object.entries(form).some(([k,v]) => v !== (user[k]||'')) || pendingAvatar || pendingCover;

  // ── Shared styles ────────────────────────────────────────────────────────────
  const iCls = 'w-full bg-transparent outline-none text-[15px] text-gray-800 dark:text-[#e8f5e9] placeholder-gray-300 dark:placeholder-[#2d5a35] py-0.5 focus:placeholder-transparent';
  const iStyle = { fontSize:'16px' };

  // ── Field building blocks ────────────────────────────────────────────────────

  const Row = ({ label, hint, children }) => (
    <div className="py-3 border-b border-gray-100 dark:border-[#1a4a20] last:border-0 focus-within:border-green-400 dark:focus-within:border-[#4ade80] transition-colors duration-150">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-extrabold text-gray-400 dark:text-[#4a7a50] uppercase tracking-widest">{label}</span>
        {hint && <span className="text-[11px] text-gray-400 dark:text-[#4a7a50]">{hint}</span>}
      </div>
      {children}
    </div>
  );

  const F = ({ label, name, placeholder, type='text', hint }) => (
    <Row label={label} hint={hint}>
      <input name={name} type={type} value={form[name]} onChange={h}
        className={iCls} placeholder={placeholder}
        style={{ ...iStyle, ...(type==='date' ? { colorScheme: darkMode ? 'dark' : 'normal' } : {}) }} />
    </Row>
  );

  const T = ({ label, name, placeholder, maxLen }) => (
    <Row label={label} hint={maxLen ? `${form[name].length}/${maxLen}` : undefined}>
      <textarea name={name} value={form[name]} onChange={h} rows={3} maxLength={maxLen}
        className={`${iCls} resize-none`} placeholder={placeholder} style={iStyle} />
    </Row>
  );

  // Custom select — appearance:none + SVG chevron so it looks the same as text fields
  const S = ({ label, name, options }) => (
    <Row label={label}>
      <div className="relative">
        <select name={name} value={form[name]} onChange={h}
          className={`${iCls} pr-7 cursor-pointer`}
          style={{ ...iStyle, appearance:'none', WebkitAppearance:'none', MozAppearance:'none' }}>
          {options.map(o => (
            <option key={o} value={o}>{o || '— নির্বাচন করুন —'}</option>
          ))}
        </select>
        {/* Custom chevron */}
        <svg className="absolute right-0.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 dark:text-[#4a7a50] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </Row>
  );

  const Div = ({ title }) => (
    <div className="flex items-center gap-3 pt-6 pb-0.5">
      <div className="flex-1 h-px bg-gray-100 dark:bg-[#1a4a20]" />
      <span className="text-[10px] font-extrabold text-gray-400 dark:text-[#4a7a50] uppercase tracking-[0.2em] whitespace-nowrap px-1">{title}</span>
      <div className="flex-1 h-px bg-gray-100 dark:bg-[#1a4a20]" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex flex-col">
      <div className="flex-1 flex items-end sm:items-center justify-center">
        <div
          className="w-full max-w-[520px] bg-white dark:bg-[#0f2313] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
          style={{ height: 'min(96vh, 100dvh)', maxHeight: 'min(96vh, 100dvh)' }}>

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-[#1a4a20] shrink-0 rounded-t-3xl bg-white dark:bg-[#0f2313]">
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#142d18] flex items-center justify-center text-gray-600 dark:text-[#6abf69] hover:bg-gray-200 dark:hover:bg-[#1a4a20] active:scale-95 shrink-0 text-[18px]">
              ←
            </button>
            <h3 className="flex-1 font-extrabold text-[17px] text-gray-900 dark:text-[#e8f5e9]">প্রোফাইল সম্পাদনা</h3>
            <button onClick={handleSave} disabled={!changed}
              className={`px-5 py-2 rounded-xl font-extrabold text-[14px] transition-all active:scale-95 text-white ${changed ? 'opacity-100' : 'opacity-40 cursor-not-allowed'}`}
              style={{ background:'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
              সংরক্ষণ
            </button>
          </div>

          {/* ── Scrollable body ─────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">

            {/* Cover + Avatar hero */}
            <div className="relative mb-16">
              {/* Cover */}
              <div className="relative h-[150px] cursor-pointer group" onClick={() => coverRef.current.click()}>
                {(pendingCover || user.coverPhoto)
                  ? <img src={pendingCover || user.coverPhoto} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full pattern-bg" />
                }
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 flex items-center justify-center transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[12px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    📷 Cover বদলান
                  </span>
                </div>
                {pendingCover && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">✓ নির্বাচিত</span>
                )}
                <input ref={coverRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f=e.target.files?.[0]; if(f) resizeImage(f,1200,0.80,d=>setPendingCover(d)); }} />
              </div>

              {/* Avatar — centered, overlapping cover */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-14">
                <div className="relative cursor-pointer group" onClick={() => avatarRef.current.click()}>
                  <img src={pendingAvatar || user.avatar} alt=""
                    className="w-28 h-28 rounded-full object-cover shadow-2xl ring-4 ring-white dark:ring-[#0f2313]" />
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                    <span className="text-[28px] opacity-0 group-hover:opacity-100 transition-opacity">📷</span>
                  </div>
                  {/* Camera chip */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-[#142d18] border border-gray-200 dark:border-[#1a4a20] text-gray-600 dark:text-[#6abf69] text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                    📷 ছবি বদলান
                  </div>
                  {pendingAvatar && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-[#0f2313] flex items-center justify-center text-white text-[10px] font-bold shadow">✓</div>
                  )}
                  <input ref={avatarRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f=e.target.files?.[0]; if(f) resizeImage(f,400,0.82,d=>setPendingAvatar(d)); }} />
                </div>
              </div>
            </div>

            {/* Name preview */}
            <div className="text-center px-4 pb-2 border-b border-gray-100 dark:border-[#1a4a20]">
              <p className="font-extrabold text-[19px] text-gray-900 dark:text-[#e8f5e9] leading-snug">{form.name || user.name}</p>
              <p className="text-[13px] text-gray-400 dark:text-[#4a7a50] mb-2">@{user.username}</p>
            </div>

            {/* ── Fields ───────────────────────────────────────────────────── */}
            <div className="px-5 pb-2">

              <Div title="পরিচয়" />
              <F label="পুরো নাম *" name="name" placeholder="আপনার পুরো নাম" />
              <T label="Bio · পরিচিতি" name="bio" placeholder="নিজের সম্পর্কে কিছু লিখুন..." maxLen={200} />
              <S label="লিঙ্গ" name="gender" options={GENDER_OPTIONS} />
              <F label="জন্মতারিখ" name="birthday" type="date" />

              <Div title="কাজ ও শিক্ষা" />
              <F label="প্রতিষ্ঠান / নিয়োগকর্তা" name="work"      placeholder="যেমন: Grameenphone, নিজস্ব ব্যবসা..." />
              <F label="পদবি / ভূমিকা"         name="position"  placeholder="যেমন: Software Engineer, Teacher..." />
              <F label="শিক্ষা প্রতিষ্ঠান"     name="education" placeholder="যেমন: BUET, Dhaka University..." />

              <Div title="ইসলামিক তথ্য ☪️" />
              <S label="ইসলামিক ভূমিকা"  name="islamicRole" options={ROLE_OPTIONS} />
              <S label="মাযহাব"           name="madhhab"     options={MADHHAB_OPTIONS} />
              <S label="কুরআনের অবস্থা"  name="quranStatus" options={QURAN_OPTIONS} />
              <F label="মসজিদ"            name="masjid"      placeholder="যেমন: বায়তুল মোকাররম..." />

              <Div title="অবস্থান" />
              <F label="বর্তমান শহর"        name="location" placeholder="যেমন: Dhaka, Chittagong..." />
              <F label="জন্মস্থান / গ্রামের বাড়ি" name="hometown" placeholder="যেমন: Sylhet, Comilla..." />
              <F label="দেশ"                name="country"  placeholder="যেমন: Bangladesh" />

              <Div title="যোগাযোগ" />
              <F label="মোবাইল নম্বর"   name="phone"   type="tel" placeholder="01700-000000" />
              <F label="ওয়েবসাইট / ব্লগ" name="website" type="url" placeholder="https://..." />

              {/* Bottom actions */}
              <div className="pt-6 pb-8 space-y-2.5">
                <button onClick={handleSave} disabled={!changed}
                  className={`w-full py-3.5 rounded-2xl font-extrabold text-[15px] text-white transition-all active:scale-95 shadow-lg ${!changed ? 'opacity-40 cursor-not-allowed' : ''}`}
                  style={{ background:'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
                  ✅ সংরক্ষণ করুন
                </button>
                <button onClick={onClose}
                  className="w-full py-3 rounded-2xl border border-gray-200 dark:border-[#1a4a20] text-gray-600 dark:text-[#6abf69] font-bold text-[14px] hover:bg-gray-50 dark:hover:bg-[#142d18] active:scale-95">
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Photo Viewer ───────────────────────────────────────────────────────────────

function PhotoViewer({ post, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl hover:bg-white/30">✕</button>
      <img src={post.image} alt="" className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl" onClick={e => e.stopPropagation()} />
    </div>
  );
}

// ── AddPrompt ──────────────────────────────────────────────────────────────────

function AddPrompt({ icon, text, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-green-300 dark:border-[#2d5a35] text-green-600 dark:text-[#4a7a50] hover:bg-green-50 dark:hover:bg-[#142d18] active:scale-95 transition-all text-[13px] font-medium">
      <span className="text-[16px]">{icon}</span>
      <span>{text}</span>
      <span className="ml-auto text-[11px] opacity-60">+ যোগ করুন</span>
    </button>
  );
}

// ── ProfilePage ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { userId } = useParams();
  const {
    currentUser, allUsers, posts, updateProfile, savedPosts,
    isFriend, hasSentRequest, hasReceivedRequest,
    sendFriendRequest, cancelFriendRequest, declineFriendRequest, acceptFriend, removeFriend,
    openChat,
  } = useApp();

  const [tab,   setTab]   = useState('posts');
  const [edit,  setEdit]  = useState(false);
  const [photo, setPhoto] = useState(null);

  if (!currentUser) return <div className="card p-8 text-center text-green-600">লগইন প্রয়োজন।</div>;

  const pid = userId ? parseInt(userId) : currentUser.id;
  const own = pid === currentUser.id;
  const pu  = own ? currentUser : allUsers.find(u => u.id === pid);

  if (!pu) return (
    <div className="card p-16 text-center">
      <p className="text-[48px] mb-3">👤</p>
      <p className="font-bold text-[17px] text-green-700">ব্যবহারকারী পাওয়া যায়নি।</p>
    </div>
  );

  const ups    = posts.filter(p => p.user.id === pu.id);
  const upics  = ups.filter(p => p.image);
  const saved  = posts.filter(p => savedPosts.includes(p.id));
  const frds   = allUsers.filter(u => (pu.friendIds || []).includes(u.id));
  const mutIds = !own ? (currentUser.friendIds || []).filter(id => (pu.friendIds || []).includes(id)) : [];
  const muts   = allUsers.filter(u => mutIds.includes(u.id));
  const badge  = ROLE_BADGE[pu.islamicRole];
  const isFrd  = isFriend(pu.id);
  const rcvd   = !own && hasReceivedRequest(pu.id);
  const sent   = !own && hasSentRequest(pu.id);

  const tabs = [
    { k:'posts',   l:'পোস্ট' },
    { k:'photos',  l:'ছবি' },
    { k:'friends', l:'বন্ধু' },
    { k:'about',   l:'পরিচয়' },
    ...(own ? [{ k:'saved', l:'সংরক্ষিত' }] : []),
  ];

  const introItems = [
    pu.position && { icon:'🪪', text: pu.position + (pu.work ? ` · ${pu.work}` : '') },
    !pu.position && pu.work && { icon:'💼', text:`কাজ করেন ${pu.work}` },
    pu.education  && { icon:'🎓', text:`পড়াশোনা ${pu.education}` },
    pu.islamicRole && pu.islamicRole !== 'Regular Muslim' && { icon:'🕌', text:pu.islamicRole },
    pu.madhhab    && { icon:'📿', text:`মাযহাব: ${pu.madhhab}` },
    pu.quranStatus && { icon:'📖', text:pu.quranStatus },
    pu.masjid     && { icon:'🕌', text:`মসজিদ: ${pu.masjid}` },
    pu.location   && { icon:'📍', text:`থাকেন ${pu.location}${pu.country && pu.country !== 'Bangladesh' ? `, ${pu.country}` : ''}` },
    pu.hometown && pu.hometown !== pu.location && { icon:'🏠', text:`জন্মস্থান ${pu.hometown}` },
    pu.birthday   && { icon:'🎂', text:fmtBirthday(pu.birthday) },
    pu.joinDate   && { icon:'📅', text:`যোগ দিয়েছেন ${pu.joinDate}` },
  ].filter(Boolean);

  const CH = 'font-extrabold text-[16px] text-gray-900 dark:text-[#e8f5e9]';
  const CS = 'text-[12px] text-gray-500 dark:text-[#4a7a50]';
  const CL = 'text-[12px] text-green-600 dark:text-[#4ade80] font-semibold hover:underline px-2 py-1 rounded-lg hover:bg-green-50 dark:hover:bg-[#142d18]';
  const BD = 'border-gray-100 dark:border-[#1a4a20]';

  return (
    <div className="fade-in">
      {edit  && <EditProfileModal user={pu} onClose={() => setEdit(false)} onSave={updateProfile} />}
      {photo && <PhotoViewer post={photo} onClose={() => setPhoto(null)} />}

      {/* ═══ HEADER CARD ═══════════════════════════════════════════════════════ */}
      <div className="card overflow-hidden mb-3">

        {/* Cover */}
        <div className="relative">
          {pu.coverPhoto
            ? <img src={pu.coverPhoto} alt="" className="w-full h-[200px] sm:h-[280px] object-cover" />
            : <div className="w-full h-[200px] sm:h-[280px] pattern-bg" />
          }
          <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 50%)' }} />
          {own && (
            <button onClick={() => setEdit(true)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 text-white text-[12px] font-bold px-3 py-1.5 rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/20 active:scale-95"
              style={{ background:'rgba(0,0,0,0.45)' }}>
              📷 Cover
            </button>
          )}
        </div>

        {/* Avatar + Info */}
        <div className="px-4 sm:px-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-end gap-0 sm:gap-4 -mt-[52px] sm:-mt-[60px]">

            {/* Avatar */}
            <div className="relative w-[104px] h-[104px] sm:w-[140px] sm:h-[140px] shrink-0 group"
              onClick={own ? () => setEdit(true) : undefined}
              style={own ? { cursor:'pointer' } : {}}>
              <img src={pu.avatar} alt={pu.name}
                className="w-full h-full rounded-full object-cover shadow-xl ring-4 ring-white dark:ring-[#0f2313]" />
              <div className="absolute bottom-1.5 right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white dark:border-[#0f2313]" />
              {own && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-[24px]">📷</span>
                </div>
              )}
            </div>

            {/* Text info + buttons */}
            <div className="flex-1 mt-2.5 sm:mt-0 sm:mb-1.5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h1 className="font-extrabold text-[22px] sm:text-[26px] text-gray-900 dark:text-[#e8f5e9] leading-tight">{pu.name}</h1>
                    {badge && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background:badge.bg, color:badge.color }}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-gray-500 dark:text-[#6abf69]">
                    {pu.position && <span className="font-medium text-gray-700 dark:text-[#a7d4ab]">{pu.position}</span>}
                    {!pu.position && pu.work && <span className="font-medium text-gray-700 dark:text-[#a7d4ab]">{pu.work}</span>}
                    {pu.education && <span>🎓 {pu.education}</span>}
                    {pu.location  && <span>📍 {pu.location}</span>}
                  </div>
                  {frds.length > 0 && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex -space-x-1.5">
                        {frds.slice(0,5).map(f => (
                          <img key={f.id} src={f.avatar} alt="" className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0f2313] object-cover" />
                        ))}
                      </div>
                      <span className="text-[12px] text-gray-500 dark:text-[#4a7a50]">
                        <span className="font-semibold text-gray-700 dark:text-[#a7d4ab]">{frds.length} জন বন্ধু</span>
                        {muts.length > 0 && ` · ${muts.length} জন পারস্পরিক`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  {own ? (
                    <button onClick={() => setEdit(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] text-white active:scale-95 shadow"
                      style={{ background:'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <>
                      {isFrd ? (
                        <button onClick={() => removeFriend(pu.id)}
                          className="px-4 py-2.5 rounded-xl bg-green-100 dark:bg-[#142d18] text-green-700 dark:text-[#4ade80] font-bold text-[13px] hover:bg-red-50 dark:hover:bg-[#2d1414] hover:text-red-600 active:scale-95">
                          👥 বন্ধু ✓
                        </button>
                      ) : rcvd ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => acceptFriend(pu.id)}
                            className="px-4 py-2.5 rounded-xl text-white font-bold text-[13px] active:scale-95 shadow"
                            style={{ background:'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>✓ গ্রহণ</button>
                          <button onClick={() => declineFriendRequest(pu.id)}
                            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#142d18] text-gray-600 dark:text-[#6abf69] font-bold text-[13px] hover:bg-red-50 hover:text-red-600 active:scale-95">✗</button>
                        </div>
                      ) : sent ? (
                        <button onClick={() => cancelFriendRequest(pu.id)}
                          className="px-4 py-2.5 rounded-xl bg-yellow-100 dark:bg-[#2d2a0f] text-yellow-700 dark:text-[#fbbf24] font-bold text-[13px] hover:bg-yellow-200 active:scale-95">
                          ⏳ Pending
                        </button>
                      ) : (
                        <button onClick={() => sendFriendRequest(pu.id)}
                          className="px-4 py-2.5 rounded-xl text-white font-bold text-[13px] active:scale-95 shadow"
                          style={{ background:'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
                          + বন্ধু যোগ করুন
                        </button>
                      )}
                      {isFrd && (
                        <button onClick={() => openChat(pu)}
                          className="px-4 py-2.5 rounded-xl border-2 border-green-200 dark:border-[#1a4a20] bg-white dark:bg-[#0f2313] text-green-700 dark:text-[#4ade80] font-bold text-[13px] hover:bg-green-50 dark:hover:bg-[#142d18] active:scale-95">
                          💬 Message
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {pu.bio && (
                <p className="text-[14px] text-gray-600 dark:text-[#a7d4ab] mt-2 leading-relaxed whitespace-pre-line">{pu.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 border-t ${BD} divide-x divide-gray-100 dark:divide-[#1a4a20]`}>
          {[
            { l:'পোস্ট',  v:ups.length,   k:'posts'   },
            { l:'বন্ধু',  v:frds.length,  k:'friends' },
            { l:'ছবি',    v:upics.length, k:'photos'  },
          ].map(s => (
            <button key={s.k} onClick={() => setTab(s.k)}
              className="flex flex-col items-center py-3 hover:bg-gray-50 dark:hover:bg-[#142d18] active:bg-gray-100 transition-colors">
              <span className="font-extrabold text-[18px] sm:text-[20px] text-green-700 dark:text-[#4ade80]">{s.v}</span>
              <span className={CS}>{s.l}</span>
            </button>
          ))}
        </div>

        {/* Tab bar */}
        <div className={`flex overflow-x-auto border-t ${BD}`} style={{ scrollbarWidth:'none' }}>
          {tabs.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`flex-1 min-w-max px-4 py-3 font-bold text-[13px] border-b-[3px] transition-colors whitespace-nowrap ${
                tab === t.k
                  ? 'border-green-700 text-green-700 dark:text-[#4ade80] dark:border-[#4ade80] bg-green-50/60 dark:bg-[#142d18]/60'
                  : `border-transparent text-gray-500 dark:text-[#4a7a50] hover:bg-gray-50 dark:hover:bg-[#142d18]`
              }`}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ 2-COLUMN ══════════════════════════════════════════════════════════ */}
      <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-3 lg:items-start space-y-3 lg:space-y-0">

        {/* LEFT sidebar */}
        <div className="space-y-3">

          {/* Intro */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={CH}>পরিচিতি</h3>
              {own && <button onClick={() => setEdit(true)} className={CL}>✏️ Edit details</button>}
            </div>

            {pu.bio ? (
              <p className="text-[14px] text-gray-700 dark:text-[#a7d4ab] text-center leading-relaxed whitespace-pre-line mb-4 pb-4 border-b border-gray-100 dark:border-[#1a4a20]">
                {pu.bio}
              </p>
            ) : own && (
              <div className="mb-4 pb-4 border-b border-gray-100 dark:border-[#1a4a20]">
                <AddPrompt icon="📝" text="Bio লিখুন" onClick={() => setEdit(true)} />
              </div>
            )}

            <div className="space-y-2.5">
              {introItems.map((item, i) => (
                <div key={i}
                  onClick={own ? () => setEdit(true) : undefined}
                  className={`flex items-start gap-3 text-[13px] text-gray-700 dark:text-[#c8e6c9] rounded-lg px-1 py-0.5 transition-colors ${own ? 'cursor-pointer hover:text-green-700 dark:hover:text-[#4ade80] group hover:bg-green-50 dark:hover:bg-[#142d18]' : ''}`}>
                  <span className="text-[17px] w-6 text-center shrink-0 mt-0.5">{item.icon}</span>
                  <span className="flex-1 leading-snug">{item.text}</span>
                  {own && <span className="text-green-400 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0">✏️</span>}
                </div>
              ))}
            </div>

            {own && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#1a4a20] space-y-2">
                {!pu.work && !pu.position && <AddPrompt icon="💼" text="কাজের তথ্য যোগ করুন"      onClick={() => setEdit(true)} />}
                {!pu.education   && <AddPrompt icon="🎓" text="শিক্ষার তথ্য যোগ করুন"    onClick={() => setEdit(true)} />}
                {!pu.islamicRole && <AddPrompt icon="🕌" text="ইসলামিক ভূমিকা যোগ করুন" onClick={() => setEdit(true)} />}
                {!pu.location    && <AddPrompt icon="📍" text="অবস্থান যোগ করুন"         onClick={() => setEdit(true)} />}
              </div>
            )}

            {own && (
              <button onClick={() => setEdit(true)}
                className="w-full mt-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#142d18] hover:bg-gray-200 dark:hover:bg-[#1a4a20] text-gray-700 dark:text-[#6abf69] font-bold text-[13px] active:scale-95 transition-all">
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* Photos mini */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className={CH}>ছবি</h3>
              {upics.length > 0 && <button onClick={() => setTab('photos')} className={CL}>সব দেখুন</button>}
            </div>
            {upics.length === 0 ? (
              <div className="py-6 text-center"><p className="text-[28px] mb-1">🖼️</p><p className={CS}>কোনো ছবি নেই</p></div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {upics.slice(0,9).map(p => (
                  <div key={p.id} onClick={() => setPhoto(p)}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 active:scale-95 transition-all">
                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Friends mini */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className={CH}>বন্ধু</h3>
                {frds.length > 0 && <p className={CS}>{frds.length} জন</p>}
              </div>
              {frds.length > 0 && <button onClick={() => setTab('friends')} className={CL}>সব দেখুন</button>}
            </div>
            {frds.length === 0 ? (
              <div className="py-6 text-center"><p className="text-[28px] mb-1">👥</p><p className={CS}>এখনো কোনো বন্ধু নেই</p></div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {frds.slice(0,9).map(f => (
                  <Link key={f.id} to={`/profile/${f.id}`} className="group text-center">
                    <div className="aspect-square rounded-xl overflow-hidden mb-1 group-hover:opacity-90 transition-opacity shadow-sm">
                      <img src={f.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] font-semibold text-gray-700 dark:text-[#a7d4ab] truncate">{f.name.split(' ')[0]}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT content */}
        <div className="space-y-3">

          {/* Posts tab */}
          {tab==='posts' && (
            <>
              {own && <CreatePost />}
              {ups.length === 0
                ? <div className="card p-12 text-center"><p className="text-[44px] mb-3">🕌</p><p className="font-bold text-[17px] text-green-700 mb-1">এখনো কোনো পোস্ট নেই।</p><p className={CS}>প্রথম পোস্ট শেয়ার করুন!</p></div>
                : ups.map(p => <Post key={p.id} post={p} />)
              }
            </>
          )}

          {/* Photos tab */}
          {tab==='photos' && (
            <div className="card p-5">
              <h3 className={`${CH} mb-4`}>🖼️ সকল ছবি</h3>
              {upics.length === 0 ? (
                <div className="py-12 text-center"><p className="text-[44px] mb-3">🖼️</p><p className="font-bold text-[16px] text-green-700 mb-1">কোনো ছবি নেই।</p><p className={CS}>পোস্ট করার সময় ছবি যোগ করুন।</p></div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  {upics.map(p => (
                    <div key={p.id} onClick={() => setPhoto(p)}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-sm">
                      <img src={p.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Friends tab */}
          {tab==='friends' && (
            frds.length === 0
              ? <div className="card p-12 text-center"><p className="text-[44px] mb-3">👥</p><p className="font-bold text-[17px] text-green-700">এখনো কোনো বন্ধু নেই।</p></div>
              : (
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={CH}>বন্ধু তালিকা</h3>
                      <p className={CS}>{frds.length} জন{muts.length > 0 && !own ? ` · ${muts.length} জন পারস্পরিক` : ''}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {frds.map(f => {
                      const isMut = mutIds.includes(f.id);
                      return (
                        <Link key={f.id} to={`/profile/${f.id}`}
                          className="rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1a4a20] hover:shadow-md transition-shadow group">
                          <div className="relative">
                            <img src={f.avatar} alt="" className="w-full h-[90px] sm:h-[105px] object-cover group-hover:opacity-95" />
                            {isMut && <span className="absolute top-2 right-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:'rgba(22,101,52,0.9)' }}>পারস্পরিক</span>}
                          </div>
                          <div className="p-2.5 text-center">
                            <p className="font-bold text-[13px] text-gray-800 dark:text-[#e8f5e9] truncate">{f.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] truncate">{f.islamicRole || 'Muslim'}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )
          )}

          {/* About tab */}
          {tab==='about' && (
            <div className="card p-5">
              <div className={`flex items-center justify-between mb-5 pb-3 border-b ${BD}`}>
                <h3 className="font-extrabold text-[17px] text-gray-800 dark:text-[#e8f5e9]">পরিচয় তথ্য</h3>
                {own && <button onClick={() => setEdit(true)} className={CL}>✏️ সম্পাদনা</button>}
              </div>
              {[
                { title:'👤 বেসিক তথ্য', items:[
                  { icon:'👤', label:'নাম',      val:pu.name },
                  { icon:'🏷️', label:'Username', val:`@${pu.username}` },
                  pu.birthday && { icon:'🎂', label:'জন্মতারিখ', val:fmtBirthday(pu.birthday) },
                  pu.gender   && { icon:'👥', label:'লিঙ্গ',     val:pu.gender },
                ].filter(Boolean) },
                { title:'💼 কাজ ও শিক্ষা', items:[
                  pu.position  && { icon:'🪪', label:'পদবি',  val:pu.position  },
                  pu.work      && { icon:'💼', label:'কাজ',   val:pu.work      },
                  pu.education && { icon:'🎓', label:'শিক্ষা', val:pu.education },
                ].filter(Boolean) },
                { title:'🕌 ইসলামিক তথ্য', items:[
                  pu.islamicRole && { icon:'🕌', label:'ভূমিকা',  val:pu.islamicRole },
                  pu.madhhab     && { icon:'📿', label:'মাযহাব',  val:pu.madhhab    },
                  pu.quranStatus && { icon:'📖', label:'কুরআন',   val:pu.quranStatus },
                  pu.masjid      && { icon:'🕌', label:'মসজিদ',   val:pu.masjid     },
                ].filter(Boolean) },
                { title:'📍 অবস্থান', items:[
                  pu.location && { icon:'📍', label:'বর্তমান',   val:pu.location },
                  pu.hometown && { icon:'🏠', label:'জন্মস্থান', val:pu.hometown },
                  pu.country  && { icon:'🌍', label:'দেশ',       val:pu.country  },
                ].filter(Boolean) },
                ...(own ? [{ title:'📞 যোগাযোগ', items:[
                  pu.phone   && { icon:'📱', label:'মোবাইল',    val:pu.phone   },
                  pu.website && { icon:'🌐', label:'ওয়েবসাইট', val:pu.website },
                ].filter(Boolean) }] : []),
              ].filter(s => s.items.length > 0).map((sec, si) => (
                <div key={si} className={si > 0 ? `mt-5 pt-5 border-t ${BD}` : ''}>
                  <p className="text-[10px] font-extrabold text-gray-400 dark:text-[#4a7a50] uppercase tracking-widest mb-3">{sec.title}</p>
                  <div className="space-y-3">
                    {sec.items.map((item, ii) => (
                      <div key={ii} className="flex items-start gap-3">
                        <span className="text-[19px] w-7 shrink-0 text-center mt-0.5">{item.icon}</span>
                        <div>
                          <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] font-medium">{item.label}</p>
                          <p className="font-semibold text-[14px] text-gray-800 dark:text-[#e8f5e9] break-all">{item.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {pu.bio && (
                <div className={`mt-5 pt-5 border-t ${BD}`}>
                  <p className="text-[10px] font-extrabold text-gray-400 dark:text-[#4a7a50] uppercase tracking-widest mb-2">📝 Bio</p>
                  <p className="text-[14px] text-gray-700 dark:text-[#a7d4ab] leading-relaxed whitespace-pre-line">{pu.bio}</p>
                </div>
              )}
              <div className={`mt-5 pt-5 border-t ${BD} flex items-center gap-3`}>
                <span className="text-[20px]">👥</span>
                <div>
                  <p className="text-[11px] text-gray-400 dark:text-[#4a7a50]">বন্ধু</p>
                  <p className="font-bold text-[14px] text-gray-800 dark:text-[#e8f5e9]">{frds.length} জন</p>
                </div>
              </div>
            </div>
          )}

          {/* Saved tab */}
          {tab==='saved' && own && (
            saved.length === 0
              ? <div className="card p-12 text-center"><p className="text-[44px] mb-3">🔖</p><p className="font-bold text-[17px] text-green-700 mb-1">কোনো সংরক্ষিত পোস্ট নেই।</p><p className={CS}>পোস্টে Bookmark আইকন চাপুন।</p></div>
              : saved.map(p => <Post key={p.id} post={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
