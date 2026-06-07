import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FaGlobe, FaUserFriends, FaEllipsisH, FaShare, FaRegComment, FaPlay } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const t = (lang, bn, en) => lang === 'en' ? en : bn;

const REACTIONS = [
  { emoji: '🤲', label: 'Dua',          color: '#1a5c2a' },
  { emoji: '❤️', label: 'Love',         color: '#e41e3f' },
  { emoji: '😊', label: 'Alhamdulillah', color: '#2d7a3a' },
  { emoji: '😢', label: 'Sad',          color: '#666'    },
  { emoji: '🌟', label: 'MashaAllah',   color: '#b8860b' },
  { emoji: '👍', label: 'Like',         color: '#1a5c2a' },
];

const TYPE_STYLES = {
  quran:    { bg: 'from-green-700 to-green-900',   en: 'Quran Ayat',       bn: 'কুরআন আয়াত',   emoji: '📖', text: 'text-green-300'   },
  hadith:   { bg: 'from-emerald-700 to-teal-900',  en: 'Hadith',           bn: 'হাদিস',         emoji: '📜', text: 'text-emerald-300' },
  reminder: { bg: 'from-green-800 to-green-600',   en: 'Islamic Reminder', bn: 'ইসলামিক স্মরণ', emoji: '🌙', text: 'text-green-200'   },
  dua:      { bg: 'from-teal-700 to-green-800',    en: "Dua & Dhikr",      bn: "দু'আ ও যিকর",  emoji: '🤲', text: 'text-teal-200'    },
};

export default function Post({ post }) {
  const { currentUser, toggleLike, addComment, sharePost, toggleSave, deletePost, savedPosts, allUsers, lang } = useApp();
  const [videoError, setVideoError] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [pickerPos,     setPickerPos]     = useState({ x: 0, y: 0 });
  const [showComments,  setShowComments]  = useState(false);
  const [comment,       setComment]       = useState('');
  const [showMenu,      setShowMenu]      = useState(false);

  const duaBtnRef      = useRef(null);
  const hoverTimer     = useRef(null);
  const longPressTimer = useRef(null);
  const longFired      = useRef(false);

  // Always show the LATEST avatar/name for the post author
  const liveUser = allUsers.find(u => u.id === post.user.id);
  const displayUser = liveUser
    ? { ...post.user, avatar: liveUser.avatar, name: liveUser.name }
    : post.user;

  const myReaction  = currentUser ? (post.userReactions || {})[currentUser.id] : null;
  const reactionObj = REACTIONS.find(r => r.label === myReaction);
  const isSaved     = savedPosts.includes(post.id);

  const openPicker = () => {
    if (window.innerWidth < 640) {
      // Mobile: center horizontally above the button
      const pickerW = 260;
      setPickerPos({
        x: Math.max(8, (window.innerWidth - pickerW) / 2),
        y: window.innerHeight - 140,
      });
    } else if (duaBtnRef.current) {
      const r = duaBtnRef.current.getBoundingClientRect();
      setPickerPos({
        x: Math.max(8, Math.min(r.left - 30, window.innerWidth - 270)),
        y: Math.max(64, r.top - 62),
      });
    }
    setShowReactions(true);
  };

  const handleReact = (r) => {
    if (currentUser) toggleLike(post.id, r);
    setShowReactions(false);
  };

  const onMouseEnter = () => { hoverTimer.current = setTimeout(openPicker, 500); };
  const onMouseLeave = () => { clearTimeout(hoverTimer.current); };

  const onTouchStart = () => {
    longFired.current = false;
    longPressTimer.current = setTimeout(() => { longFired.current = true; openPicker(); }, 500);
  };
  const onTouchEnd = () => clearTimeout(longPressTimer.current);

  const onDuaClick = () => {
    if (longFired.current) { longFired.current = false; return; }
    clearTimeout(hoverTimer.current);
    setShowReactions(false);
    handleReact(REACTIONS[0]);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;
    addComment(post.id, comment);
    setComment('');
  };

  const handleSave = () => {
    if (currentUser) toggleSave(post.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (currentUser && post.user.id === currentUser.id) deletePost(post.id);
    setShowMenu(false);
  };

  const typeStyle   = TYPE_STYLES[post.type] || TYPE_STYLES.reminder;
  const commentsList = post.commentsList || [];

  return (
    <div id={`post-${post.id}`} className="card overflow-hidden fade-in">

      {/* Type banner */}
      <div className={`bg-gradient-to-r ${typeStyle.bg} px-4 py-1.5 flex items-center justify-between`}>
        <div className="flex items-center gap-1.5">
          <span>{typeStyle.emoji}</span>
          <div>
            <span className={`text-[11px] font-bold ${typeStyle.text} block leading-none`}>{typeStyle.en}</span>
            <span className={`text-[10px] ${typeStyle.text} opacity-80 block leading-none`}>{typeStyle.bn}</span>
          </div>
        </div>
        <span className="text-green-200 text-[11px] arabic">بِسْمِ اللَّهِ</span>
      </div>

      {/* Post header */}
      <div className="flex items-start justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img src={displayUser.avatar} alt={displayUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-green-400" />
            <span className="absolute -bottom-1 -right-1 text-xs">☪️</span>
          </div>
          <div>
            <Link to={`/profile/${post.user.id}`}
              className="font-bold text-[15px] hover:underline text-green-900 dark:text-[#e8f5e9]">
              {displayUser.name}
            </Link>
            <div className="flex items-center gap-1 text-[12px]">
              <span className="text-green-600 dark:text-[#6abf69]">{post.time}</span>
              <span className="text-gray-400 dark:text-[#4a7a50]">·</span>
              {post.privacy === 'public'
                ? <FaGlobe className="text-[11px] text-green-600 dark:text-[#4a7a50]" />
                : <FaUserFriends className="text-[11px] text-green-600 dark:text-[#4a7a50]" />}
            </div>
          </div>
        </div>

        {/* ⋯ menu */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full hover:bg-green-50 dark:hover:bg-[#142d18] flex items-center justify-center transition-colors">
            <FaEllipsisH className="text-gray-500 dark:text-[#4a7a50]" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white dark:bg-[#0f2313] rounded-xl shadow-xl w-[220px] z-20 border border-green-100 dark:border-[#1a4a20] overflow-hidden">
              <button onClick={handleSave}
                className="w-full text-left px-4 py-3 text-[13px] hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors font-medium flex items-center gap-2">
                <span>{isSaved ? '✅' : '🔖'}</span>
                <div>
                  <p className="font-bold text-[12px] text-gray-800 dark:text-[#e8f5e9]">{isSaved ? t(lang,'সংরক্ষিত','Saved') : t(lang,'পোস্ট সংরক্ষণ','Save Post')}</p>
                  <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">{isSaved ? t(lang,'সরিয়ে ফেলতে ট্যাপ করুন','Tap to unsave') : t(lang,'পরে পড়ার জন্য সংরক্ষণ করুন','Save for later')}</p>
                </div>
              </button>
              {currentUser && post.user.id === currentUser.id && (
                <button onClick={handleDelete}
                  className="w-full text-left px-4 py-3 text-[13px] hover:bg-red-50 dark:hover:bg-[#2d1414] text-red-600 transition-colors font-medium flex items-center gap-2">
                  <span>🗑️</span>
                  <div>
                    <p className="font-bold text-[12px]">{t(lang,'পোস্ট মুছুন','Delete Post')}</p>
                    <p className="text-[11px] opacity-80">{t(lang,'স্থায়ীভাবে মুছে যাবে','Will be permanently deleted')}</p>
                  </div>
                </button>
              )}
              <button onClick={() => setShowMenu(false)}
                className="w-full text-left px-4 py-3 text-[13px] hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors font-medium flex items-center gap-2">
                <span>🔕</span>
                <div>
                  <p className="font-bold text-[12px] text-gray-800 dark:text-[#e8f5e9]">{t(lang,'পোস্ট লুকান','Hide Post')}</p>
                  <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">{t(lang,'ফিডে আর দেখাবে না','Won\'t show in feed')}</p>
                </div>
              </button>
              <button onClick={() => setShowMenu(false)}
                className="w-full text-left px-4 py-3 text-[13px] hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors font-medium flex items-center gap-2">
                <span>🚫</span>
                <div>
                  <p className="font-bold text-[12px] text-gray-800 dark:text-[#e8f5e9]">{t(lang,'রিপোর্ট করুন','Report')}</p>
                  <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">{t(lang,'আপত্তিকর কন্টেন্ট রিপোর্ট করুন','Report inappropriate content')}</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Arabic text */}
      {post.arabic && (
        <div className="mx-4 mb-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-[#0f2313] dark:to-[#0a1a0d] border border-green-200 dark:border-[#1a4a20] rounded-xl px-5 py-4 text-center">
          <p className="text-green-800 dark:text-[#a7d4ab] text-[20px] font-bold arabic leading-loose">{post.arabic}</p>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-800 dark:text-[#c8e6c9]">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && !post.video && (
        <img src={post.image} alt="post" className="w-full object-cover max-h-[400px] cursor-pointer hover:brightness-95 transition-all" />
      )}

      {/* Video */}
      {post.video && !videoError && (
        <div className="relative bg-black">
          <video
            src={post.video}
            controls
            className="w-full max-h-[400px]"
            poster={post.image || undefined}
            onError={() => setVideoError(true)}
          />
          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <FaPlay className="text-[7px]" /> Video
          </div>
        </div>
      )}

      {/* Video expired / error fallback */}
      {post.video && videoError && (
        <div className="mx-4 mb-3 bg-gray-50 dark:bg-[#142d18] border-2 border-dashed border-gray-200 dark:border-[#1a4a20] rounded-xl flex flex-col items-center justify-center py-8 gap-2">
          {post.image
            ? <img src={post.image} alt="thumbnail" className="w-full max-h-[200px] object-cover rounded-lg opacity-60" />
            : <span className="text-[40px]">🎬</span>}
          <p className="text-[13px] text-gray-400 dark:text-[#4a7a50] font-medium">
            {t(lang, 'ভিডিও আর পাওয়া যাচ্ছে না', 'Video no longer available')}
          </p>
        </div>
      )}

      {/* Reaction counts */}
      {(() => {
        const allLabels = Object.values(post.userReactions || {});
        const topEmojis = [...new Set(allLabels)]
          .slice(0, 3)
          .map(label => REACTIONS.find(r => r.label === label)?.emoji)
          .filter(Boolean);
        return (
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-1">
              {topEmojis.length > 0 && (
                <span className="text-[16px] leading-none">{topEmojis.join('')}</span>
              )}
              {(post.likes || 0) > 0 && (
                <span className="text-[14px] text-gray-500 dark:text-[#4a7a50] ml-1">
                  {(post.likes || 0).toLocaleString()}
                </span>
              )}
            </div>
            <button onClick={() => setShowComments(!showComments)}
              className="text-[14px] text-gray-500 dark:text-[#4a7a50] hover:underline">
              {post.comments > 0 && `${post.comments} ${t(lang,'মন্তব্য','Comments')}`}
              {post.comments > 0 && post.shares > 0 && ' · '}
              {post.shares > 0 && `${post.shares} ${t(lang,'শেয়ার','Shares')}`}
            </button>
          </div>
        );
      })()}

      <hr className="border-green-100 dark:border-[#1a4a20] mx-4" />

      {/* Action buttons */}
      <div className="flex items-center px-2 py-1">

        {/* Dua / Reactions */}
        <button
          ref={duaBtnRef}
          onClick={onDuaClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors select-none active:scale-95 ${
            myReaction ? 'bg-green-50 dark:bg-[#142d18]' : 'hover:bg-green-50 dark:hover:bg-[#142d18]'
          }`}>
          <span className="text-[20px] leading-none">{reactionObj ? reactionObj.emoji : '🤲'}</span>
          <div className="text-left leading-tight min-w-0">
            <p className="font-bold text-[12px] truncate" style={{ color: reactionObj ? reactionObj.color : '#4b5563' }}>
              {myReaction || t(lang, "দু'আ", 'Dua')}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-[#4a7a50] truncate">
              {myReaction ? t(lang,'রিয়েক্ট হয়েছে','Reacted') : t(lang,"দু'আ করুন",'Make Dua')}
            </p>
          </div>
        </button>

        <div className="w-px h-6 bg-green-100 dark:bg-[#1a4a20]" />

        {/* Comment */}
        <button onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors active:scale-95">
          <FaRegComment className="text-[18px] text-gray-500 dark:text-[#4a7a50]" />
          <div className="text-left leading-tight">
            <p className="font-bold text-[12px] text-gray-600 dark:text-[#6abf69]">{t(lang,'মন্তব্য','Comment')}</p>
            <p className="text-[10px] text-gray-400 dark:text-[#4a7a50]">{t(lang,'মতামত দিন','Share thoughts')}</p>
          </div>
        </button>

        <div className="w-px h-6 bg-green-100 dark:bg-[#1a4a20]" />

        {/* Share */}
        <button onClick={() => sharePost(post.id)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors active:scale-95">
          <FaShare className="text-[18px] text-gray-500 dark:text-[#4a7a50]" />
          <div className="text-left leading-tight">
            <p className="font-bold text-[12px] text-gray-600 dark:text-[#6abf69]">{t(lang,'শেয়ার','Share')}</p>
            <p className="text-[10px] text-gray-400 dark:text-[#4a7a50]">{t(lang,'ছড়িয়ে দিন','Spread the word')}</p>
          </div>
        </button>
      </div>

      {/* Reaction picker portal */}
      {showReactions && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setShowReactions(false)} />
          <div className="fixed flex items-center gap-1.5 bg-white dark:bg-[#0f2313] rounded-full shadow-2xl px-3 py-2.5 border border-green-100 dark:border-[#1a4a20]"
            style={{ left: pickerPos.x, top: pickerPos.y, zIndex: 9999 }}>
            {REACTIONS.map(r => (
              <button key={r.label} onClick={() => handleReact(r)} title={r.label}
                className={`text-[28px] leading-none transition-transform duration-150 active:scale-90 hover:scale-150 ${
                  myReaction === r.label ? 'scale-[1.35] drop-shadow' : ''
                }`}>
                {r.emoji}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}

      {/* Comments section */}
      {showComments && (
        <div className="px-4 pb-3">
          <hr className="border-green-100 dark:border-[#1a4a20] mb-3" />
          {commentsList.map(c => (
            <div key={c.id} className="flex items-start gap-2 mb-2">
              <img src={c.user.avatar} alt={c.user.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-green-300 flex-shrink-0" />
              <div className="bg-green-50 dark:bg-[#142d18] rounded-2xl px-3 py-2 border border-green-100 dark:border-[#1a4a20] flex-1">
                <p className="font-bold text-[13px] text-green-800 dark:text-[#6abf69]">{c.user.name}</p>
                <p className="text-[14px] text-gray-700 dark:text-[#c8e6c9]">{c.text}</p>
                <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] mt-0.5">{c.time}</p>
              </div>
            </div>
          ))}
          {currentUser && (
            <form onSubmit={handleComment} className="flex items-center gap-2 mt-2">
              <img src={currentUser.avatar} alt="me"
                className="w-8 h-8 rounded-full object-cover border-2 border-green-400 flex-shrink-0" />
              <div className="flex-1 relative">
                <input type="text" value={comment} onChange={e => setComment(e.target.value)}
                  placeholder={t(lang, 'মন্তব্য লিখুন... 🤲', 'Write a comment... 🤲')}
                  className="w-full bg-green-50 dark:bg-[#142d18] border border-green-200 dark:border-[#1a4a20] rounded-full px-4 py-2 text-[14px] text-gray-800 dark:text-[#e8f5e9] placeholder-green-400 dark:placeholder-[#2d5a35] outline-none focus:border-green-400 pr-10"
                  style={{ fontSize:'16px' }} />
                <button type="submit" disabled={!comment.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[18px] disabled:opacity-40">
                  🕌
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
