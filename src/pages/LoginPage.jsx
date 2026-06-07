import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import { useApp } from '../context/AppContext';


const DUAS = [
  { ar: 'رَبِّ زِدْنِي عِلْمًا', bn: 'হে আমার রব! আমার জ্ঞান বাড়িয়ে দাও।', ref: 'সূরা ত্বহা: ১১৪' },
  { ar: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', bn: 'আল্লাহই আমাদের জন্য যথেষ্ট, আর তিনিই উত্তম তত্ত্বাবধায়ক।', ref: 'সূরা আল-ইমরান: ১৭৩' },
  { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', bn: 'হে আমাদের রব! আমাদের দুনিয়া ও আখিরাতে মঙ্গল দাও।', ref: 'সূরা বাকারা: ২০১' },
];

export default function LoginPage() {
  const { login, register, darkMode } = useApp();
  const navigate = useNavigate();

  const [tab,     setTab]     = useState('login');
  const [form,    setForm]    = useState({ username: '', password: '', name: '', confirm: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  const today = new Date();
  const dua = DUAS[today.getDate() % DUAS.length];

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = login(form.username, form.password);
    setLoading(false);
    if (res.ok) navigate('/');
    else setError(res.msg);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('পাসওয়ার্ড মিলছে না!');
    if (form.password.length < 6)       return setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে!');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = register({ name: form.name, username: form.username, password: form.password });
    setLoading(false);
    if (res.ok) navigate('/');
    else setError(res.msg);
  };

  const switchTab = (t) => { setTab(t); setError(''); setForm({ username: '', password: '', name: '', confirm: '' }); };

  const inputCls = `w-full bg-gray-50 dark:bg-[#142d18] border border-gray-200 dark:border-[#1a4a20] rounded-xl px-4 py-3 pl-10 text-[14px] text-gray-900 dark:text-[#e8f5e9] placeholder-gray-400 dark:placeholder-[#4a7a50] focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all`;

  return (
    <div className={`min-h-screen relative flex ${darkMode ? 'bg-[#071209]' : 'bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-[#e0f2f1]'}`}>

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 p-12 relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }} />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="text-[72px] mb-6">☪️</div>
          <h1 className="text-[42px] font-extrabold text-green-800 dark:text-green-400 leading-none mb-3">UmmahBook</h1>
          <p className="text-green-600 dark:text-green-500 text-[16px] font-medium mb-8">Connect · Learn · Grow in Islam</p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 text-left">
            {[
              ['📖', 'প্রতিদিনের কুরআন ও হাদিস', 'Daily Quran & authentic Hadith'],
              ['🕌', 'ইসলামিক কমিউনিটি', 'Connect with the global Ummah'],
              ['🌟', 'ধর্মীয় জ্ঞান শেয়ার করুন', 'Share and spread Islamic knowledge'],
            ].map(([icon, bn, en]) => (
              <div key={bn} className="flex items-center gap-3 bg-white/60 dark:bg-[#0f2313]/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-green-100 dark:border-[#1a4a20]">
                <span className="text-[22px] flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-[14px] text-gray-800 dark:text-[#e8f5e9]">{bn}</p>
                  <p className="text-[12px] text-gray-500 dark:text-[#4a7a50]">{en}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Daily dua */}
          <div className="mt-6 bg-green-700/10 dark:bg-[#1a4a20]/50 rounded-2xl p-5 border border-green-200 dark:border-[#1a4a20] text-left">
            <p className="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-2">আজকের দুআ</p>
            <p className="arabic text-[20px] text-green-800 dark:text-green-300 font-bold leading-relaxed mb-2">{dua.ar}</p>
            <p className="text-[13px] text-gray-700 dark:text-[#c8e6c9] leading-relaxed">{dua.bn}</p>
            <p className="text-[11px] text-green-500 mt-2">— {dua.ref}</p>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 lg:flex-none lg:w-[480px] flex flex-col items-center justify-center p-5 sm:p-8 min-h-screen">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <span className="text-[48px]">☪️</span>
            <h1 className="text-[30px] font-extrabold text-green-700 dark:text-green-400 leading-none mt-1">UmmahBook</h1>
            <p className="arabic text-green-600 dark:text-green-500 text-[15px] mt-1">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-[#0f2313] rounded-3xl shadow-2xl overflow-hidden border border-green-100 dark:border-[#1a4a20]">

            {/* Tabs */}
            <div className="flex border-b border-green-100 dark:border-[#1a4a20]">
              {[['login', '🔐 লগইন'], ['register', '✨ নিবন্ধন']].map(([key, label]) => (
                <button key={key} onClick={() => switchTab(key)}
                  className={`flex-1 py-4 font-bold text-[14px] transition-all ${
                    tab === key
                      ? 'text-green-700 dark:text-green-400 border-b-2 border-green-600 bg-green-50/50 dark:bg-[#142d18]/50'
                      : 'text-gray-400 dark:text-[#4a7a50] hover:text-green-600 hover:bg-green-50/30'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-[13px] mb-4 flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
                    <input name="username" value={form.username} onChange={handle}
                      type="text" placeholder="Username" required autoComplete="username"
                      className={inputCls} />
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
                    <input name="password" value={form.password} onChange={handle}
                      type={showPw ? 'text' : 'password'} placeholder="Password" required autoComplete="current-password"
                      className={inputCls + ' pr-11'} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                      {showPw ? <FaEyeSlash className="text-[14px]" /> : <FaEye className="text-[14px]" />}
                    </button>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-[15px] transition-all active:scale-[0.98] shadow-lg shadow-green-700/20 flex items-center justify-center gap-2">
                    {loading
                      ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
                      : '🔐 লগইন করুন'
                    }
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="relative">
                    <FaUserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
                    <input name="name" value={form.name} onChange={handle}
                      type="text" placeholder="পূর্ণ নাম" required autoComplete="name"
                      className={inputCls} />
                  </div>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
                    <input name="username" value={form.username} onChange={handle}
                      type="text" placeholder="Username (ছোট হাতে, space ছাড়া)" required autoComplete="username"
                      className={inputCls} />
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
                    <input name="password" value={form.password} onChange={handle}
                      type={showPw ? 'text' : 'password'} placeholder="Password (কমপক্ষে ৬ অক্ষর)" required
                      className={inputCls + ' pr-11'} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                      {showPw ? <FaEyeSlash className="text-[14px]" /> : <FaEye className="text-[14px]" />}
                    </button>
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
                    <input name="confirm" value={form.confirm} onChange={handle}
                      type={showCfm ? 'text' : 'password'} placeholder="Password নিশ্চিত করুন" required
                      className={inputCls + ' pr-11'} />
                    <button type="button" onClick={() => setShowCfm(!showCfm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                      {showCfm ? <FaEyeSlash className="text-[14px]" /> : <FaEye className="text-[14px]" />}
                    </button>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-[15px] transition-all active:scale-[0.98] shadow-lg shadow-green-700/20 flex items-center justify-center gap-2">
                    {loading
                      ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
                      : '✅ অ্যাকাউন্ট তৈরি করুন'
                    }
                  </button>
                </form>
              )}

            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-5 space-y-1">
            <p className="arabic text-green-600 dark:text-green-500 text-[14px]">وَاللَّهُ يَهْدِي مَنْ يَشَاءُ</p>
            <p className="text-[11px] text-gray-400 dark:text-[#4a7a50]">UmmahBook © 2025 · জাযাকাল্লাহু খায়রান</p>
          </div>
        </div>
      </div>
    </div>
  );
}
