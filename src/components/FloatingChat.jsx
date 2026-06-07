import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSearch, FaPaperPlane, FaChevronLeft } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return 'এইমাত্র';
  if (m < 60) return `${m}মি`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}ঘ`;
  return `${Math.floor(h/24)}দিন`;
}

function ChatWindow({ contact, onBack, isMobile }) {
  const { currentUser, loadMsgs, saveMsgs } = useApp();
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState(() => {
    const stored = loadMsgs(currentUser.id, contact.id);
    // If no history, show a welcome message
    if (stored.length === 0) {
      return [{ id: 0, from: contact.id, text: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ! 🌙 কেমন আছেন?', time: Date.now() - 60000 }];
    }
    return stored;
  });
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    const msg = { id: Date.now(), from: currentUser.id, text: text.trim(), time: Date.now() };
    const next = [...msgs, msg];
    setMsgs(next);
    saveMsgs(currentUser.id, contact.id, next);
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const containerStyle = isMobile
    ? { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column',
        background: 'white', paddingBottom: 'env(safe-area-inset-bottom,0px)' }
    : { width: '310px', height: '420px', display: 'flex', flexDirection: 'column',
        borderRadius: '16px 16px 0 0', overflow: 'hidden',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.15)', border: '1px solid #d4edda' };

  return (
    <div style={containerStyle} className="bg-white dark:bg-[#0f2313]">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
        {isMobile && (
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <FaChevronLeft className="text-white text-sm" />
          </button>
        )}
        <div className="relative flex-shrink-0">
          <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-full object-cover border-2 border-green-400" />
          {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-green-700" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[14px] text-white truncate">{contact.name}</p>
          <p className="text-[11px] text-green-300">{contact.online ? '🟢 অনলাইন' : '⚫ অফলাইন'}</p>
        </div>
        {!isMobile && (
          <button onClick={onBack} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center flex-shrink-0">
            <FaTimes className="text-white text-sm" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
        style={{ background: 'var(--chat-bg,#f0f9f2)' }}
        ref={r => r && (r.style.cssText += '; background: #f0f9f2;')}>
        {msgs.map((msg) => {
          const isMe = msg.from === currentUser.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <img src={contact.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-green-200" />
              )}
              <div className={`max-w-[220px] group`}>
                <div className={`px-3 py-2 rounded-2xl text-[13px] leading-snug ${
                  isMe
                    ? 'bg-green-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-[#142d18] text-gray-800 dark:text-[#e8f5e9] border border-green-100 dark:border-[#1a4a20] rounded-bl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
                <p className={`text-[10px] mt-0.5 ${isMe ? 'text-right text-gray-400' : 'text-gray-400'}`}>
                  {timeAgo(msg.time)}
                </p>
              </div>
              {isMe && (
                <img src={currentUser.avatar} alt="me" className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-green-400" />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-green-100 dark:border-[#1a4a20] flex-shrink-0 bg-white dark:bg-[#0f2313]">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="মেসেজ লিখুন... 🤲"
          className="flex-1 bg-green-50 dark:bg-[#142d18] border border-green-200 dark:border-[#1a4a20] rounded-full px-4 py-2.5 text-[14px] text-gray-800 dark:text-[#e8f5e9] placeholder-green-400 outline-none focus:border-green-400"
          style={{ fontSize: '16px' }}
        />
        <button
          type="button"
          onClick={send}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
          <FaPaperPlane className="text-white text-[14px]" />
        </button>
      </div>
    </div>
  );
}

function ContactList({ contacts, search, setSearch, onSelect, onClose, isMobile }) {
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const online   = contacts.filter(c => c.online);

  const containerStyle = isMobile
    ? { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column',
        paddingBottom: 'env(safe-area-inset-bottom,0px)' }
    : { width: '300px', maxHeight: '440px', display: 'flex', flexDirection: 'column',
        borderRadius: '16px 16px 0 0', overflow: 'hidden',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.15)', border: '1px solid #d4edda' };

  return (
    <div style={containerStyle} className="bg-white dark:bg-[#0f2313]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
        <div>
          <p className="font-bold text-white text-[16px]">💬 মেসেজ</p>
          {online.length > 0 && (
            <p className="text-green-300 text-[11px]">🟢 {online.length} জন অনলাইন</p>
          )}
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
          <FaTimes className="text-white text-sm" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-green-100 dark:border-[#1a4a20] flex-shrink-0 bg-white dark:bg-[#0f2313]">
        <div className="flex items-center gap-2 bg-green-50 dark:bg-[#142d18] border border-green-200 dark:border-[#1a4a20] rounded-full px-3 py-2">
          <FaSearch className="text-green-500 text-sm flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="বন্ধু খুঁজুন..."
            className="bg-transparent outline-none text-[14px] w-full text-gray-800 dark:text-[#e8f5e9] placeholder-green-400"
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            {contacts.length === 0
              ? <><p className="text-[36px] mb-3">👥</p>
                  <p className="font-bold text-[14px] text-green-800 dark:text-green-400">এখনো কোনো বন্ধু নেই</p>
                  <p className="text-[12px] text-gray-400 dark:text-[#4a7a50] mt-1">বন্ধু যোগ করলে চ্যাট করতে পারবেন</p></>
              : <><p className="text-[36px] mb-3">🔍</p>
                  <p className="text-[14px] text-gray-500">কোনো ফলাফল নেই</p></>}
          </div>
        ) : filtered.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors text-left active:scale-[0.98]">
            <div className="relative flex-shrink-0">
              <img src={c.avatar} alt={c.name} className="w-11 h-11 rounded-full object-cover border-2 border-green-200" />
              {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-[#0f2313]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] text-green-900 dark:text-[#e8f5e9] truncate">{c.name}</p>
              <p className="text-[12px] text-gray-500 dark:text-[#4a7a50] truncate">
                {c.online ? '🟢 অনলাইন' : '⚫ অফলাইন'} · {c.title || 'Muslim'}
              </p>
            </div>
            <div className="flex-shrink-0 text-green-500 text-[18px]">›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FloatingChat() {
  const { currentUser, contacts, chatRequest, setChatRequest } = useApp();
  const [open,       setOpen]       = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [search,     setSearch]     = useState('');
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 640);

  useEffect(() => {
    const upd = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  // Open chat when triggered from profile page
  useEffect(() => {
    if (chatRequest) {
      setActiveChat(chatRequest);
      setOpen(true);
      setChatRequest(null);
    }
  }, [chatRequest]);

  if (!currentUser) return null;

  const friendIds = currentUser?.friendIds || [];
  const friendContacts = contacts.filter(c => friendIds.includes(c.id));
  const onlineCount = friendContacts.filter(c => c.online).length;

  const closeAll = () => { setOpen(false); setActiveChat(null); setSearch(''); };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (open || activeChat) && (
        <div className="fixed inset-0 z-[199] bg-black/40" onClick={closeAll} />
      )}

      {/* Chat panel — desktop: floating bottom-right; mobile: full screen */}
      <div
        className={`${isMobile ? '' : 'fixed bottom-[80px] lg:bottom-4 right-4 z-40 flex items-end gap-3'}`}
        style={isMobile && (open || activeChat) ? {} : {}}>

        {/* Contact list */}
        {open && !activeChat && (
          <ContactList
            contacts={friendContacts}
            search={search}
            setSearch={setSearch}
            onSelect={c => { setActiveChat(c); }}
            onClose={closeAll}
            isMobile={isMobile}
          />
        )}

        {/* Chat window */}
        {activeChat && (
          <ChatWindow
            contact={activeChat}
            onBack={() => { if (isMobile) { setActiveChat(null); } else { setActiveChat(null); setOpen(false); } }}
            isMobile={isMobile}
          />
        )}

        {/* FAB button — only show when not in mobile full-screen mode */}
        {(!isMobile || (!open && !activeChat)) && (
          <div className={`${isMobile ? 'fixed bottom-[80px] right-4 z-40' : ''}`}>
            <button
              onClick={() => { setOpen(o => !o); setActiveChat(null); }}
              className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative"
              style={{ background: 'linear-gradient(135deg,#1a5c2a,#2d7a3a)' }}>
              {open
                ? <FaTimes className="text-white text-[20px]" />
                : <span className="text-[24px]">💬</span>}
              {!open && onlineCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-400 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {onlineCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
