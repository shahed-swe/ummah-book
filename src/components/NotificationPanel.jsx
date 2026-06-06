import { FaTimes } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function NotificationPanel({ onClose }) {
  const { notifications, markAllRead } = useApp();
  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="absolute right-0 top-12 w-[360px] bg-white rounded-2xl shadow-2xl border border-green-100 z-50 overflow-hidden fade-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-green-100">
        <h3 className="text-[20px] font-bold text-[#1a1a1a]">নোটিফিকেশন</h3>
        <div className="flex items-center gap-2">
          {unread.length > 0 && (
            <button onClick={markAllRead} className="text-[12px] text-green-600 font-semibold hover:underline">
              সব পড়া হয়েছে
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-green-50 flex items-center justify-center">
            <FaTimes className="text-[#65676b] text-sm" />
          </button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {unread.length > 0 && (
          <>
            <p className="px-5 pt-3 pb-1 text-[14px] font-bold text-[#1a1a1a]">নতুন</p>
            {unread.map(n => (
              <div key={n.id} className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors bg-green-50/50">
                <div className="relative flex-shrink-0">
                  <img src={n.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-green-300" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-[11px] border-2 border-white">
                    {n.emoji}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#1a1a1a] leading-snug">{n.text}</p>
                  <p className="text-[11px] text-green-600 font-semibold mt-1">{n.time}</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 mt-2" />
              </div>
            ))}
          </>
        )}

        {read.length > 0 && (
          <>
            <p className="px-5 pt-3 pb-1 text-[14px] font-bold text-[#1a1a1a]">আগের</p>
            {read.map(n => (
              <div key={n.id} className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors">
                <div className="relative flex-shrink-0">
                  <img src={n.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-[11px] border-2 border-white">
                    {n.emoji}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#65676b] leading-snug">{n.text}</p>
                  <p className="text-[11px] text-[#65676b] mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {notifications.length === 0 && (
          <p className="text-center text-green-600 py-8 text-[14px]">কোনো নোটিফিকেশন নেই।</p>
        )}
      </div>

      <div className="px-4 py-3 border-t border-green-100">
        <button className="w-full py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-[13px] transition-colors">
          সব নোটিফিকেশন দেখুন
        </button>
      </div>
    </div>
  );
}
