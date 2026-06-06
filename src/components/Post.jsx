import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe, FaUserFriends, FaEllipsisH, FaShare, FaRegComment } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const REACTIONS = [
  { emoji: '🤲', label: 'Dua', color: '#1a5c2a' },
  { emoji: '❤️', label: 'Love', color: '#e41e3f' },
  { emoji: '😊', label: 'Alhamdulillah', color: '#2d7a3a' },
  { emoji: '😢', label: 'Sad', color: '#666' },
  { emoji: '🌟', label: 'MashaAllah', color: '#b8860b' },
  { emoji: '👍', label: 'Like', color: '#1a5c2a' },
];

const TYPE_STYLES = {
  quran:    { bg: 'from-green-700 to-green-900',   en: 'Quran Ayat',       bn: 'কুরআন আয়াত',   emoji: '📖', text: 'text-green-300' },
  hadith:   { bg: 'from-emerald-700 to-teal-900',  en: 'Hadith',           bn: 'হাদিস',         emoji: '📜', text: 'text-emerald-300' },
  reminder: { bg: 'from-green-800 to-green-600',   en: 'Islamic Reminder', bn: 'ইসলামিক স্মরণ', emoji: '🌙', text: 'text-green-200' },
  dua:      { bg: 'from-teal-700 to-green-800',    en: 'Dua & Dhikr',      bn: 'দু\'আ ও যিকর',  emoji: '🤲', text: 'text-teal-200' },
};

export default function Post({ post }) {
  const { currentUser, toggleLike, addComment, sharePost, toggleSave, deletePost, savedPosts } = useApp();
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  let reactionTimer;

  const myReaction = currentUser ? (post.userReactions || {})[currentUser.id] : null;
  const reactionObj = REACTIONS.find(r => r.label === myReaction);
  const isSaved = savedPosts.includes(post.id);

  const handleReact = (r) => {
    if (currentUser) toggleLike(post.id, r);
    setShowReactions(false);
  };

  const handleLikeClick = () => {
    if (currentUser) toggleLike(post.id, REACTIONS[0]);
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

  const typeStyle = TYPE_STYLES[post.type] || TYPE_STYLES.reminder;
  const commentsList = post.commentsList || [];

  return (
    <div className="card overflow-hidden fade-in">
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

      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover border-2 border-green-400" />
            <span className="absolute -bottom-1 -right-1 text-xs">☪️</span>
          </div>
          <div>
            <Link to={`/profile/${post.user.id}`} className="font-bold text-[15px] hover:underline text-green-900">
              {post.user.name}
            </Link>
            <div className="flex items-center gap-1 text-[#65676b] text-[12px]">
              <span className="text-green-600">{post.time}</span>
              <span>·</span>
              {post.privacy === 'public'
                ? <FaGlobe className="text-[11px] text-green-600" />
                : <FaUserFriends className="text-[11px] text-green-600" />}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full hover:bg-green-50 flex items-center justify-center transition-colors">
            <FaEllipsisH className="text-[#65676b]" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl w-[220px] z-20 border border-green-100 overflow-hidden">
              <button onClick={handleSave}
                className="w-full text-left px-4 py-3 text-[13px] hover:bg-green-50 transition-colors font-medium flex items-center gap-2">
                <span>{isSaved ? '✅' : '🔖'}</span>
                <div>
                  <p className="font-bold text-[12px]">{isSaved ? 'Saved' : 'Save Post'}</p>
                  <p className="text-[11px] text-gray-500">{isSaved ? 'সংরক্ষিত হয়েছে' : 'পোস্ট সংরক্ষণ করুন'}</p>
                </div>
              </button>
              {currentUser && post.user.id === currentUser.id && (
                <button onClick={handleDelete}
                  className="w-full text-left px-4 py-3 text-[13px] hover:bg-red-50 text-red-600 transition-colors font-medium flex items-center gap-2">
                  <span>🗑️</span>
                  <div>
                    <p className="font-bold text-[12px]">Delete Post</p>
                    <p className="text-[11px] opacity-80">পোস্ট মুছুন</p>
                  </div>
                </button>
              )}
              <button onClick={() => setShowMenu(false)}
                className="w-full text-left px-4 py-3 text-[13px] hover:bg-green-50 transition-colors font-medium flex items-center gap-2">
                <span>🔕</span>
                <div>
                  <p className="font-bold text-[12px]">Hide Post</p>
                  <p className="text-[11px] text-gray-500">পোস্ট লুকান</p>
                </div>
              </button>
              <button onClick={() => setShowMenu(false)}
                className="w-full text-left px-4 py-3 text-[13px] hover:bg-green-50 transition-colors font-medium flex items-center gap-2">
                <span>🚫</span>
                <div>
                  <p className="font-bold text-[12px]">Report</p>
                  <p className="text-[11px] text-gray-500">রিপোর্ট করুন</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Arabic text */}
      {post.arabic && (
        <div className="mx-4 mb-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl px-5 py-4 text-center">
          <p className="text-green-800 text-[20px] font-bold arabic leading-loose">{post.arabic}</p>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-800">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <img src={post.image} alt="post" className="w-full object-cover max-h-[400px] cursor-pointer hover:brightness-95 transition-all" />
      )}

      {/* Counts */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          {(post.reactions?.length > 0) && (
            <span className="text-base">{post.reactions[0]}</span>
          )}
          <span className="text-[14px] text-[#65676b] ml-1">
            {(post.likes || 0).toLocaleString()}
          </span>
        </div>
        <button onClick={() => setShowComments(!showComments)} className="text-[14px] text-[#65676b] hover:underline">
          {post.comments} Comments · মন্তব্য &nbsp;·&nbsp; {post.shares} Shares · শেয়ার
        </button>
      </div>

      <hr className="border-green-100 mx-4" />

      {/* Action buttons */}
      <div className="flex items-center px-2 py-1">
        {/* Like/React */}
        <div className="relative flex-1">
          <button
            onMouseEnter={() => { reactionTimer = setTimeout(() => setShowReactions(true), 500); }}
            onMouseLeave={() => { clearTimeout(reactionTimer); setTimeout(() => setShowReactions(false), 300); }}
            onClick={handleLikeClick}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-green-50 transition-colors">
            {myReaction && reactionObj
              ? <><span className="text-xl">{reactionObj.emoji}</span><span className="font-bold text-[13px]" style={{ color: reactionObj.color }}>{reactionObj.label}</span></>
              : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🤲</span>
                  <div className="text-left leading-tight">
                    <p className="font-bold text-[11px] text-green-700">Dua</p>
                    <p className="text-[10px] text-green-500">দু'আ</p>
                  </div>
                </div>
              )
            }
          </button>
          {showReactions && (
            <div
              className="absolute bottom-9 left-0 bg-white rounded-full shadow-xl px-2 py-2 flex items-center gap-1 z-10 border border-green-200"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}>
              {REACTIONS.map(r => (
                <button key={r.label} onClick={() => handleReact(r)} title={r.label}
                  className={`text-[26px] hover:scale-150 transition-transform duration-150 cursor-pointer ${myReaction === r.label ? 'scale-125' : ''}`}>
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment */}
        <button onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-green-50 transition-colors">
          <FaRegComment className="text-green-600 text-lg" />
          <div className="text-left leading-tight">
            <p className="font-bold text-[11px] text-green-700">Comment</p>
            <p className="text-[10px] text-green-500">মন্তব্য</p>
          </div>
        </button>

        {/* Share */}
        <button onClick={() => { sharePost(post.id); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-green-50 transition-colors">
          <FaShare className="text-green-600 text-lg" />
          <div className="text-left leading-tight">
            <p className="font-bold text-[11px] text-green-700">Share</p>
            <p className="text-[10px] text-green-500">শেয়ার</p>
          </div>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-3">
          <hr className="border-green-100 mb-3" />
          {commentsList.map(c => (
            <div key={c.id} className="flex items-start gap-2 mb-2">
              <img src={c.user.avatar} alt={c.user.name} className="w-8 h-8 rounded-full object-cover border-2 border-green-300 flex-shrink-0" />
              <div className="bg-green-50 rounded-2xl px-3 py-2 border border-green-100 flex-1">
                <p className="font-bold text-[13px] text-green-800">{c.user.name}</p>
                <p className="text-[14px] text-gray-700">{c.text}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{c.time}</p>
              </div>
            </div>
          ))}
          {currentUser && (
            <form onSubmit={handleComment} className="flex items-center gap-2 mt-2">
              <img src={currentUser.avatar} alt="me" className="w-8 h-8 rounded-full object-cover border-2 border-green-400 flex-shrink-0" />
              <div className="flex-1 relative">
                <input type="text" value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Write a comment / মন্তব্য লিখুন... 🤲"
                  className="w-full bg-green-50 border border-green-200 rounded-full px-4 py-2 text-[14px] placeholder-green-400 outline-none focus:border-green-400 pr-10" />
                <button type="submit" disabled={!comment.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 text-[18px] disabled:opacity-40">🕌</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
