import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login, register, darkMode } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', name: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = await login(form.username, form.password);
    setLoading(false);
    if (res.ok) navigate('/');
    else setError(res.msg);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Password মিলছে না!'); return; }
    if (form.password.length < 6) { setError('Password কমপক্ষে ৬ অক্ষর হতে হবে!'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = await register({ name: form.name, username: form.username, password: form.password });
    setLoading(false);
    if (res.ok) navigate('/');
    else setError(res.msg);
  };

  const quickLogin = (username, password) => {
    setForm(f => ({ ...f, username, password }));
    setTab('login');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-[#0a1a0d]' : 'bg-gradient-to-br from-green-50 to-emerald-100'}`}>

      {/* Background pattern */}
      <div className="absolute inset-0 pattern-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="text-[52px]">☪️</span>
            <div className="text-left">
              <h1 className="text-[36px] font-bold text-green-700 leading-none">UmmahBook</h1>
              <p className="text-green-500 text-[13px]">Connect · Learn · Grow in Islam</p>
            </div>
          </div>
          <p className="arabic text-green-700 text-[18px] font-bold">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        </div>

        {/* Card */}
        <div className={`rounded-2xl shadow-xl p-6 ${darkMode ? 'bg-[#0f2313] border border-[#1a4a20]' : 'bg-white'}`}>
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-6 bg-green-50 p-1">
            {[['login', 'লগইন'], ['register', 'নিবন্ধন']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-[14px] transition-all ${
                  tab === key ? 'bg-green-700 text-white shadow' : 'text-green-700 hover:bg-green-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-[13px] mb-4 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[13px] font-semibold text-green-700 mb-1">Username</label>
                <input name="username" value={form.username} onChange={handle} type="text"
                  placeholder="আপনার username লিখুন" required className="input-base" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-green-700 mb-1">Password</label>
                <input name="password" value={form.password} onChange={handle} type="password"
                  placeholder="আপনার password লিখুন" required className="input-base" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary mt-2">
                {loading ? '⏳ লগইন হচ্ছে...' : '🔐 লগইন করুন'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[13px] font-semibold text-green-700 mb-1">পূর্ণ নাম</label>
                <input name="name" value={form.name} onChange={handle} type="text"
                  placeholder="আপনার পূর্ণ নাম" required className="input-base" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-green-700 mb-1">Username</label>
                <input name="username" value={form.username} onChange={handle} type="text"
                  placeholder="ছোট হাতে, space ছাড়া" required className="input-base" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-green-700 mb-1">Password</label>
                <input name="password" value={form.password} onChange={handle} type="password"
                  placeholder="কমপক্ষে ৬ অক্ষর" required className="input-base" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-green-700 mb-1">Password নিশ্চিত করুন</label>
                <input name="confirm" value={form.confirm} onChange={handle} type="password"
                  placeholder="আবার password লিখুন" required className="input-base" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary mt-2">
                {loading ? '⏳ নিবন্ধন হচ্ছে...' : '✅ নিবন্ধন করুন'}
              </button>
            </form>
          )}

          {/* Demo accounts */}
          <div className="mt-5 pt-4 border-t border-green-100">
            <p className="text-[12px] text-green-600 font-semibold text-center mb-3">🎯 Demo Account দিয়ে চেষ্টা করুন</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Shahaly', u: 'shahaly', p: '123456' },
                { label: 'Abdullah', u: 'abdullah', p: '123456' },
                { label: 'Admin', u: 'admin', p: 'admin' },
              ].map(({ label, u, p }) => (
                <button key={u} onClick={() => quickLogin(u, p)}
                  className="py-2 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-bold text-[12px] transition-colors">
                  👤 {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-green-500 mt-4 arabic">وَاللَّهُ يَهْدِي مَنْ يَشَاءُ</p>
        <p className="text-center text-[11px] text-green-400 mt-1">UmmahBook © 2025 · জাযাকাল্লাহু খায়রান</p>
      </div>
    </div>
  );
}
