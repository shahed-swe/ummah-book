import { useState } from 'react';
import { FaTimes, FaEdit, FaSearch, FaCircle } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const messages = {
  1: [
    { from: 'them', text: 'السَّلَامُ عَلَيْكُمْ ভাই! কেমন আছেন?', time: '২:৩০' },
    { from: 'me', text: 'ওয়ালাইকুমুস সালাম! আলহামদুলিল্লাহ, ভালো আছি। আপনি?', time: '২:৩১' },
    { from: 'them', text: 'মাশাআল্লাহ! আজকের জুমার জন্য প্রস্তুত তো? 🕌', time: '২:৩২' },
  ],
};

function ChatWindow({ contact, onClose }) {
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState(messages[contact.id] || []);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMsgs([...msgs, { from: 'me', text, time: 'এখন' }]);
    setText('');
  };

  return (
    <div className="w-[320px] bg-white rounded-t-2xl shadow-2xl border border-green-200 flex flex-col fade-in" style={{ height: '420px' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-green-100 bg-gradient-to-r from-green-700 to-green-800 rounded-t-2xl">
        <div className="relative">
          <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-full object-cover border-2 border-green-400" />
          {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-green-700" />}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[14px] text-white">{contact.name}</p>
          <p className="text-[11px] text-green-300">{contact.online ? 'Active now' : 'Offline'}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
          <FaTimes className="text-white text-sm" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-green-50/30">
        {msgs.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'them' && (
              <img src={contact.avatar} alt="" className="w-7 h-7 rounded-full object-cover mr-2 flex-shrink-0 self-end" />
            )}
            <div className={`max-w-[200px] px-3 py-2 rounded-2xl text-[13px] ${
              msg.from === 'me'
                ? 'bg-green-600 text-white rounded-br-sm'
                : 'bg-white text-[#1a1a1a] border border-green-100 rounded-bl-sm shadow-sm'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-0.5 ${msg.from === 'me' ? 'text-green-200' : 'text-[#65676b]'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex items-center gap-2 px-3 py-2 border-t border-green-100">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Aa... 🤲"
          className="flex-1 bg-green-50 border border-green-200 rounded-full px-3 py-2 text-[13px] text-[#1a1a1a] placeholder-green-400 outline-none focus:border-green-400"
        />
        <button type="submit" className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center transition-colors text-[14px]">
          ➤
        </button>
      </form>
    </div>
  );
}

export default function FloatingChat() {
  const { contacts } = useApp();
  const [open, setOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const onlineContacts = contacts.filter(c => c.online);

  return (
    <div className="fixed bottom-0 right-4 z-40 flex items-end gap-3">
      {/* Active chat window */}
      {activeChat && (
        <ChatWindow
          contact={activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}

      {/* Chat list panel */}
      {open && (
        <div className="w-[300px] bg-white rounded-t-2xl shadow-2xl border border-green-200 fade-in" style={{ maxHeight: '400px' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-green-100 bg-gradient-to-r from-green-700 to-green-800 rounded-t-2xl">
            <p className="font-bold text-white text-[16px]">✉️ Messages</p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center">
                <FaEdit className="text-white text-sm" />
              </button>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center">
                <FaTimes className="text-white text-sm" />
              </button>
            </div>
          </div>

          <div className="px-3 py-2 border-b border-green-100">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
              <FaSearch className="text-green-500 text-sm" />
              <input type="text" placeholder="Search messages..." className="bg-transparent outline-none text-[13px] w-full placeholder-green-400" />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '290px' }}>
            {contacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => { setActiveChat(contact); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left"
              >
                <div className="relative flex-shrink-0">
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover border-2 border-green-200" />
                  {contact.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-[#1a1a1a] truncate">{contact.name}</p>
                  <p className="text-[12px] text-[#65676b] truncate">{contact.online ? '🟢 Active now' : 'Offline'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat bubble button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 relative"
          style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3a)' }}
        >
          <span className="text-[24px]">💬</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
            {onlineContacts.length}
          </span>
        </button>
      )}
    </div>
  );
}
