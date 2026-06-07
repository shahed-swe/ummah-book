import { createContext, useContext, useState, useEffect } from 'react';
import { demoUsers, initialPosts, initialNotifications } from '../data/initialData';
import { hadithCollection } from '../data/hadithData';

const AppContext = createContext();
const STORAGE_V = 'ub_v9';

function getDefaultAvatar(name) {
  const words = name.trim().split(/\s+/);
  const a = (words[0]?.[0] || '').toUpperCase();
  const b = (words[1]?.[0] || '').toUpperCase();
  const initials = a + b || '?';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1a5c2a"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="38" font-weight="bold" fill="white" font-family="Arial,sans-serif">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function saveImg(key, dataUrl) {
  try { localStorage.setItem(key, dataUrl); } catch { /* quota full */ }
}
function loadImg(key) {
  return localStorage.getItem(key) || null;
}

function freshUsers() {
  return demoUsers.map(u => ({
    ...u, friendIds: u.friendIds || [], sentRequests: u.sentRequests || [], receivedRequests: u.receivedRequests || [],
  }));
}

function stripImages(users) {
  return users.map(u => ({
    ...u,
    avatar:     u.avatar?.startsWith('data:image/jpeg')     ? null : u.avatar,
    coverPhoto: u.coverPhoto?.startsWith('data:image/jpeg') ? null : u.coverPhoto,
  }));
}

function mergeImages(users) {
  return users.map(u => ({
    ...u,
    avatar:     loadImg(`ub_img_a_${u.id}`) || u.avatar,
    coverPhoto: loadImg(`ub_img_c_${u.id}`) || u.coverPhoto,
  }));
}

export function AppProvider({ children }) {

  // ── Users ────────────────────────────────────────────────────────────────
  const [allUsers, setAllUsers] = useState(() => {
    try {
      if (!localStorage.getItem(STORAGE_V)) {
        ['ub_users','ub_user','ub_userid','ub_token','ub_posts','ub_saved','ub_groups','ub_events']
          .forEach(k => localStorage.removeItem(k));
        localStorage.setItem(STORAGE_V, '1');
        return mergeImages(freshUsers());
      }
      const stored = JSON.parse(localStorage.getItem('ub_users'));
      if (stored?.length && stored.some(u => u.password)) {
        return mergeImages(stored.map(u => ({
          ...u, friendIds: u.friendIds || [], sentRequests: u.sentRequests || [], receivedRequests: u.receivedRequests || [],
        })));
      }
    } catch {}
    return mergeImages(freshUsers());
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      if (!localStorage.getItem(STORAGE_V)) return null;
      const id = JSON.parse(localStorage.getItem('ub_userid'));
      if (id) return id;
      return JSON.parse(localStorage.getItem('ub_user'))?.id || null;
    } catch { return null; }
  });

  const currentUser = currentUserId ? (allUsers.find(u => u.id === currentUserId) || null) : null;

  // ── Posts ────────────────────────────────────────────────────────────────
  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ub_posts')) || initialPosts; } catch { return initialPosts; }
  });

  // ── Notifications (per-user) ─────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);

  // ── Prefs ────────────────────────────────────────────────────────────────
  const [darkMode,   setDarkMode]   = useState(() => localStorage.getItem('ub_dark') === 'true');
  const [lang,       setLang]       = useState(() => localStorage.getItem('ub_lang') || 'bn');
  const [savedPosts, setSavedPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ub_saved')) || []; } catch { return []; }
  });

  const ONLINE_IDS = new Set([2, 4, 6, 7, 9, 10]);
  const contacts = allUsers
    .filter(u => u.id !== currentUser?.id)
    .map(u => ({ ...u, online: ONLINE_IDS.has(u.id) }));

  const [chatRequest, setChatRequest] = useState(null);
  const openChat = (user) => setChatRequest(user);

  // ── Persistence effects ──────────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('ub_users', JSON.stringify(stripImages(allUsers))); } catch {}
  }, [allUsers]);

  useEffect(() => {
    if (currentUserId != null) localStorage.setItem('ub_userid', JSON.stringify(currentUserId));
    else localStorage.removeItem('ub_userid');
  }, [currentUserId]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('ub_user', JSON.stringify(currentUser));
    else localStorage.removeItem('ub_user');
  }, [currentUserId, allUsers]);

  useEffect(() => { localStorage.setItem('ub_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('ub_dark', darkMode); }, [darkMode]);
  useEffect(() => { localStorage.setItem('ub_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('ub_saved', JSON.stringify(savedPosts)); }, [savedPosts]);
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkMode]);

  // ── Daily hadith auto-post ────────────────────────────────────────────────
  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem('ub_hadith_date') === todayKey) return;
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const h = hadithCollection[dayOfYear % hadithCollection.length];
    const botUser = { id: 3, name: 'UmmahBook Daily', avatar: 'https://i.pravatar.cc/150?img=68' };
    const todayLabel = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const newPost = {
      id: Date.now(), user: botUser, time: todayLabel, privacy: 'public', type: 'hadith',
      arabic: h.arabic, content: `${h.text}\n\n📚 ${h.source}\n🏷️ বিষয়: ${h.topic}`,
      image: null, likes: 0, comments: 0, shares: 0,
      reactions: [], userReactions: {}, commentsList: [], savedBy: [], isAutoPost: true,
    };
    setPosts(prev => [newPost, ...prev.filter(p => !p.isAutoPost || p.time !== todayLabel)]);
    localStorage.setItem('ub_hadith_date', todayKey);
  }, []);

  // ── Load notifications per user ───────────────────────────────────────────
  useEffect(() => {
    if (!currentUserId) { setNotifications([]); return; }
    try {
      const key = `ub_notif_${currentUserId}`;
      const stored = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(stored) && stored.length > 0) {
        setNotifications(stored);
      } else {
        // Pre-load demo notifications for all users on first login
        setNotifications(initialNotifications);
      }
    } catch {
      setNotifications(initialNotifications);
    }
  }, [currentUserId]);

  // ── Save notifications per user ──────────────────────────────────────────
  useEffect(() => {
    if (currentUserId != null) {
      localStorage.setItem(`ub_notif_${currentUserId}`, JSON.stringify(notifications.slice(0, 50)));
    }
  }, [notifications, currentUserId]);

  // ── Auth ─────────────────────────────────────────────────────────────────
  const login = (username, password) => {
    const user = allUsers.find(u => u.username === username && u.password === password);
    if (user) { setCurrentUserId(user.id); return { ok: true }; }
    return { ok: false, msg: 'ভুল username বা password!' };
  };

  const register = ({ name, username, password }) => {
    if (allUsers.find(u => u.username === username))
      return { ok: false, msg: 'এই username ইতিমধ্যে আছে!' };
    const newUser = {
      id: Date.now(), username, password, name,
      avatar: getDefaultAvatar(name), coverPhoto: null,
      bio: '', location: '', joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      friends: 0, title: '', friendIds: [], sentRequests: [], receivedRequests: [],
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return { ok: true };
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem('ub_user');
    localStorage.removeItem('ub_userid');
  };

  const updateProfile = (updates) => {
    if (updates.avatar?.startsWith('data:image/jpeg'))     saveImg(`ub_img_a_${currentUserId}`, updates.avatar);
    if (updates.coverPhoto?.startsWith('data:image/jpeg')) saveImg(`ub_img_c_${currentUserId}`, updates.coverPhoto);
    setAllUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, ...updates } : u));
  };

  const changePassword = (currentPw, newPw) => {
    if (!currentUser) return { ok: false, msg: 'লগইন করা নেই!' };
    if (currentUser.password !== currentPw) return { ok: false, msg: 'বর্তমান পাসওয়ার্ড ভুল!' };
    if (newPw.length < 6) return { ok: false, msg: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে!' };
    setAllUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, password: newPw } : u));
    return { ok: true };
  };

  // ── Notification helpers ─────────────────────────────────────────────────
  // Store a notification in a specific user's bucket (localStorage + state if same user)
  const addNotifToUser = (targetUserId, notif) => {
    const newNotif = {
      id: Date.now() + Math.floor(Math.random() * 9999),
      ...notif,
      read: false,
      timestamp: Date.now(),
    };
    try {
      const key = `ub_notif_${targetUserId}`;
      const existing = JSON.parse(localStorage.getItem(key)) || [];
      // Deduplicate: skip if same actor + type within 10 seconds
      const isDup = existing.some(n =>
        n.type === notif.type && n.actorId === notif.actorId &&
        Date.now() - (n.timestamp || 0) < 10000
      );
      if (!isDup) {
        localStorage.setItem(key, JSON.stringify([newNotif, ...existing].slice(0, 50)));
        // Update state immediately if target is current user
        if (targetUserId === currentUserId) {
          setNotifications(prev => {
            const dup = prev.some(n =>
              n.type === notif.type && n.actorId === notif.actorId &&
              Date.now() - (n.timestamp || 0) < 10000
            );
            return dup ? prev : [newNotif, ...prev].slice(0, 50);
          });
        }
      }
    } catch {}
  };

  const markRead     = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif  = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markAllRead  = ()   => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount  = notifications.filter(n => !n.read).length;

  // ── Friend system ────────────────────────────────────────────────────────
  const sendFriendRequest = (toUserId) => {
    if (!currentUser) return;
    if ((currentUser.friendIds || []).includes(toUserId)) return;
    if ((currentUser.sentRequests || []).includes(toUserId)) return;
    if ((currentUser.receivedRequests || []).includes(toUserId)) return;
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) return { ...u, sentRequests: [...(u.sentRequests || []), toUserId] };
      if (u.id === toUserId) return { ...u, receivedRequests: [...(u.receivedRequests || []), currentUserId] };
      return u;
    }));
    addNotifToUser(toUserId, {
      type: 'friend_request',
      actorId: currentUserId,
      actorAvatar: currentUser.avatar,
      actorName: currentUser.name,
      emoji: '👥',
      data: {},
    });
  };

  const cancelFriendRequest = (toUserId) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) return { ...u, sentRequests: (u.sentRequests || []).filter(id => id !== toUserId) };
      if (u.id === toUserId) return { ...u, receivedRequests: (u.receivedRequests || []).filter(id => id !== currentUserId) };
      return u;
    }));
  };

  const declineFriendRequest = (fromUserId) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) return { ...u, receivedRequests: (u.receivedRequests || []).filter(id => id !== fromUserId) };
      if (u.id === fromUserId) return { ...u, sentRequests: (u.sentRequests || []).filter(id => id !== currentUserId) };
      return u;
    }));
  };

  const acceptFriend = (fromUserId) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) return {
        ...u, friendIds: [...(u.friendIds || []), fromUserId],
        receivedRequests: (u.receivedRequests || []).filter(id => id !== fromUserId),
        friends: (u.friends || 0) + 1,
      };
      if (u.id === fromUserId) return {
        ...u, friendIds: [...(u.friendIds || []), currentUserId],
        sentRequests: (u.sentRequests || []).filter(id => id !== currentUserId),
        friends: (u.friends || 0) + 1,
      };
      return u;
    }));
    // Notify the person whose request was accepted
    if (currentUser) {
      addNotifToUser(fromUserId, {
        type: 'friend_accept',
        actorId: currentUserId,
        actorAvatar: currentUser.avatar,
        actorName: currentUser.name,
        emoji: '✅',
        data: {},
      });
    }
  };

  const removeFriend = (userId) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) return { ...u, friendIds: (u.friendIds || []).filter(id => id !== userId),   friends: Math.max(0, (u.friends || 0) - 1) };
      if (u.id === userId)        return { ...u, friendIds: (u.friendIds || []).filter(id => id !== currentUserId), friends: Math.max(0, (u.friends || 0) - 1) };
      return u;
    }));
  };

  const isFriend          = (userId) => (currentUser?.friendIds     || []).includes(userId);
  const hasSentRequest    = (userId) => (currentUser?.sentRequests  || []).includes(userId);
  const hasReceivedRequest= (userId) => (currentUser?.receivedRequests || []).includes(userId);
  const getUserById       = (id)     => allUsers.find(u => u.id === parseInt(id));

  // ── Posts ────────────────────────────────────────────────────────────────
  const addPost = ({ content, image, type, arabic, privacy }) => {
    setPosts(prev => [{
      id: Date.now(),
      user: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
      time: 'এইমাত্র', privacy: privacy || 'public', type: type || 'regular', arabic: arabic || null,
      content, image: image || null, likes: 0, comments: 0, shares: 0,
      reactions: [], userReactions: {}, commentsList: [], savedBy: [],
    }, ...prev]);
  };

  const deletePost = (postId) => setPosts(prev => prev.filter(p => p.id !== postId));

  const toggleLike = (postId, reaction) => {
    const post = posts.find(p => p.id === postId);
    if (!post || !currentUser) return;
    const prevReaction = (post.userReactions || {})[currentUser.id];
    // Notify post owner when a new reaction is added (not on toggle-off, not on own posts)
    if (!prevReaction && post.user.id !== currentUserId) {
      addNotifToUser(post.user.id, {
        type: 'like',
        actorId: currentUserId,
        actorAvatar: currentUser.avatar,
        actorName: currentUser.name,
        emoji: reaction.emoji,
        data: { postId, reaction: reaction.label },
      });
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const userReactions = { ...(p.userReactions || {}) };
      const prev_r = userReactions[currentUser.id];
      if (prev_r === reaction.label) {
        delete userReactions[currentUser.id];
        return { ...p, likes: Math.max(0, p.likes - 1), userReactions };
      }
      userReactions[currentUser.id] = reaction.label;
      return { ...p, likes: p.likes + (prev_r ? 0 : 1), userReactions };
    }));
  };

  const addComment = (postId, text) => {
    const post = posts.find(p => p.id === postId);
    if (post && post.user.id !== currentUserId && currentUser) {
      addNotifToUser(post.user.id, {
        type: 'comment',
        actorId: currentUserId,
        actorAvatar: currentUser.avatar,
        actorName: currentUser.name,
        emoji: '💬',
        data: { postId, commentText: text.substring(0, 60) },
      });
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p, comments: p.comments + 1,
        commentsList: [...(p.commentsList || []), {
          id: Date.now(), user: { name: currentUser.name, avatar: currentUser.avatar }, text, time: 'এইমাত্র',
        }],
      };
    }));
  };

  const sharePost  = (postId) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, shares: p.shares + 1 } : p));
  const toggleSave = (postId) => setSavedPosts(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);

  const pendingRequestsCount = (currentUser?.receivedRequests || []).length;

  return (
    <AppContext.Provider value={{
      currentUser, authLoading: false, login, logout, register, updateProfile, changePassword,
      lang, setLang,
      posts, addPost, deletePost, toggleLike, addComment, sharePost,
      savedPosts, toggleSave,
      notifications, markAllRead, markRead, deleteNotif, unreadCount,
      darkMode, setDarkMode,
      contacts, allUsers,
      sendFriendRequest, cancelFriendRequest, declineFriendRequest, acceptFriend, removeFriend,
      isFriend, hasSentRequest, hasReceivedRequest, getUserById,
      pendingRequestsCount,
      chatRequest, setChatRequest, openChat,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
