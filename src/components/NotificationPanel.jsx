import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaBell, FaHeart, FaComment, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const TYPE_META = {
  like:           { color: 'bg-red-500'     },
  comment:        { color: 'bg-blue-500'    },
  friend_request: { color: 'bg-green-600'   },
  friend_accept:  { color: 'bg-emerald-500' },
  system:         { color: 'bg-amber-500'   },
  default:        { color: 'bg-gray-400'    },
};

function getNotifText(notif, lang) {
  if (notif.text && !notif.type) return notif.text;
  const name = notif.actorName || (lang === 'en' ? 'Someone' : 'কেউ');
  if (lang === 'en') {
    switch (notif.type) {
      case 'like':           return `${name} reacted ${notif.emoji || '❤️'} to your post`;
      case 'comment':        return `${name} commented on your post`;
      case 'friend_request': return `${name} sent you a friend request`;
      case 'friend_accept':  return `${name} accepted your friend request 🎉`;
      default:               return notif.text || `${name} interacted with you`;
    }
  }
  switch (notif.type) {
    case 'like':           return `${name} আপনার পোস্টে ${notif.emoji || '❤️'} দিয়েছেন`;
    case 'comment':        return `${name} আপনার পোস্টে মন্তব্য করেছেন`;
    case 'friend_request': return `${name} আপনাকে বন্ধু অনুরোধ পাঠিয়েছেন`;
    case 'friend_accept':  return `${name} আপনার বন্ধু অনুরোধ গ্রহণ করেছেন 🎉`;
    default:               return notif.text || `${name} আপনার সাথে যোগাযোগ করেছেন`;
  }
}

function getTimeStr(notif, lang) {
  if (!notif.timestamp) return notif.time || '';
  const diff = Date.now() - notif.timestamp;
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (lang === 'en') {
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  }
  if (mins < 1) return 'এইমাত্র';
  if (mins < 60) return `${mins} মি আগে`;
  if (hrs < 24) return `${hrs} ঘ আগে`;
  return `${days} দিন আগে`;
}

function TypeIcon({ type }) {
  const cls = 'text-white text-[9px]';
  switch (type) {
    case 'like':           return <FaHeart     className={cls} />;
    case 'comment':        return <FaComment   className={cls} />;
    case 'friend_request': return <FaUserPlus  className={cls} />;
    case 'friend_accept':  return <FaUserCheck className={cls} />;
    default:               return <FaBell      className={cls} />;
  }
}

export default function NotificationPanel({ onClose }) {
  const { notifications, markAllRead, markRead, deleteNotif, lang } = useApp();
  const navigate  = useNavigate();
  const [filter, setFilter] = useState('all');

  const displayed = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCnt = notifications.filter(n => !n.read).length;

  const T = {
    title:   lang === 'en' ? 'Notifications' : 'নোটিফিকেশন',
    all:     lang === 'en' ? 'All'           : 'সব',
    unread:  lang === 'en' ? 'Unread'        : 'অপঠিত',
    markAll: lang === 'en' ? 'Mark all read' : 'সব পড়া হয়েছে',
    newLbl:  lang === 'en' ? 'new'           : 'নতুন',
    seeAll:  lang === 'en' ? 'See all notifications' : 'সব নোটিফিকেশন দেখুন',
    empty1:  filter === 'unread'
              ? (lang === 'en' ? 'All caught up!' : 'সব পড়া হয়ে গেছে!')
              : (lang === 'en' ? 'No notifications yet' : 'এখনো কোনো নোটিফিকেশন নেই'),
    empty2:  lang === 'en'
              ? 'Like or comment on posts to see activity here'
              : 'পোস্টে লাইক বা মন্তব্য করুন, এখানে দেখা যাবে',
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="sm:hidden fixed inset-0 bg-black/40 z-[98]"
        style={{ top: 56 }}
        onClick={onClose}
      />

      <div
        className="fixed sm:absolute top-[56px] sm:top-full left-0 right-0 sm:left-auto sm:right-0 sm:w-[390px] bg-white dark:bg-[#0f2313] rounded-none sm:rounded-2xl overflow-hidden flex flex-col z-[99] border-0 sm:border sm:border-green-100 dark:sm:border-[#1a4a20]"
        style={{
          maxHeight: 'calc(100dvh - 56px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-green-100 dark:border-[#1a4a20] flex-shrink-0">
          <div>
            <h3 className="text-[20px] font-bold text-gray-900 dark:text-[#e8f5e9] leading-tight">{T.title}</h3>
            {unreadCnt > 0 && (
              <p className="text-[12px] text-green-600 dark:text-green-400 font-semibold">{unreadCnt} {T.newLbl}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCnt > 0 && (
              <button onClick={markAllRead}
                className="text-[12px] text-green-700 dark:text-green-400 font-bold px-3 py-1.5 rounded-xl hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors">
                {T.markAll}
              </button>
            )}
            <button onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#142d18] flex items-center justify-center transition-colors">
              <FaTimes className="text-gray-500 dark:text-[#6abf69] text-sm" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 px-4 py-2.5 border-b border-green-50 dark:border-[#1a4a20] flex-shrink-0 bg-gray-50/50 dark:bg-transparent">
          {[['all', T.all], ['unread', `${T.unread}${unreadCnt > 0 ? ` (${unreadCnt})` : ''}`]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all ${
                filter === val
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'text-gray-500 dark:text-[#6abf69] hover:bg-green-50 dark:hover:bg-[#142d18]'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-[#142d18] flex items-center justify-center mb-4">
                <FaBell className="text-green-400 text-2xl" />
              </div>
              <p className="text-[15px] font-bold text-gray-700 dark:text-[#c8e6c9]">{T.empty1}</p>
              <p className="text-[12px] text-gray-400 dark:text-[#4a7a50] mt-1.5 max-w-[220px] leading-relaxed">{T.empty2}</p>
            </div>
          ) : displayed.map(n => {
            const meta    = TYPE_META[n.type] || TYPE_META.default;
            const isLegacy= !n.type;
            const avatar  = n.actorAvatar || n.avatar || 'https://i.pravatar.cc/150?img=68';

            return (
              <div key={n.id}
                className={`group relative flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-all border-b border-gray-50 dark:border-[#1a4a20]/40 last:border-0 ${
                  !n.read
                    ? 'bg-green-50/60 dark:bg-[#1a4a20]/25 hover:bg-green-50 dark:hover:bg-[#1a4a20]/40'
                    : 'hover:bg-gray-50 dark:hover:bg-[#142d18]/50'
                }`}
                onClick={() => {
                  if (!n.read) markRead(n.id);
                  // Navigate to relevant content
                  if (n.type === 'friend_request' || n.type === 'friend_accept') {
                    onClose();
                    navigate(`/profile/${n.actorId}`);
                  } else if (n.type === 'like' || n.type === 'comment') {
                    onClose();
                    navigate('/');
                    // After navigation, scroll to the post
                    if (n.data?.postId) {
                      setTimeout(() => {
                        const el = document.getElementById(`post-${n.data.postId}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 400);
                    }
                  }
                }}>

                {/* Avatar + badge */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <img
                    src={avatar} alt=""
                    onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(n.actorName || '?')}&background=1a5c2a&color=fff&size=48`; }}
                    className={`w-12 h-12 rounded-full object-cover border-2 ${!n.read ? 'border-green-400' : 'border-gray-200 dark:border-[#1a4a20]'}`}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-[22px] h-[22px] rounded-full ${isLegacy ? 'bg-green-600' : meta.color} flex items-center justify-center border-2 border-white dark:border-[#0f2313]`}>
                    {isLegacy ? (
                      <span className="text-[11px]">{n.emoji || '🔔'}</span>
                    ) : (
                      <TypeIcon type={n.type} />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-7">
                  <p className={`text-[13px] leading-snug ${!n.read ? 'text-gray-900 dark:text-[#e8f5e9] font-semibold' : 'text-gray-600 dark:text-[#8bc34a]'}`}>
                    {getNotifText(n, lang)}
                  </p>
                  <p className={`text-[11px] mt-1 font-semibold ${!n.read ? 'text-green-600 dark:text-[#4ade80]' : 'text-gray-400 dark:text-[#4a7a50]'}`}>
                    {getTimeStr(n, lang)}
                  </p>
                </div>

                {/* Right column */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                  {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />}
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                    title={lang === 'en' ? 'Delete' : 'মুছুন'}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30">
                    <FaTimes className="text-gray-300 dark:text-[#4a7a50] hover:text-red-500 text-[10px]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-green-100 dark:border-[#1a4a20] flex-shrink-0">
            <button className="w-full py-2.5 rounded-xl bg-green-50 dark:bg-[#142d18] hover:bg-green-100 dark:hover:bg-[#1a4a20] text-green-700 dark:text-[#6abf69] font-bold text-[13px] transition-colors active:scale-[0.98]">
              {T.seeAll}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
