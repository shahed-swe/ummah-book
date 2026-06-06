import { createContext, useContext, useState, useEffect } from 'react';
import { demoUsers, initialPosts, initialNotifications, initialContacts } from '../data/initialData';
import { hadithCollection } from '../data/hadithData';

const AppContext = createContext();
const STORAGE_V = 'ub_v6';

function freshUsers() {
  return demoUsers.map(u => ({
    ...u, friendIds: u.friendIds || [], sentRequests: u.sentRequests || [], receivedRequests: u.receivedRequests || [],
  }));
}

export function AppProvider({ children }) {
  const [allUsers, setAllUsers] = useState(() => {
    try {
      // Clear stale data from previous backend/API versions
      if (!localStorage.getItem(STORAGE_V)) {
        ['ub_users','ub_user','ub_userid','ub_token','ub_posts','ub_saved','ub_groups','ub_events'].forEach(k => localStorage.removeItem(k));
        localStorage.setItem(STORAGE_V, '1');
        return freshUsers();
      }
      const stored = JSON.parse(localStorage.getItem('ub_users'));
      // Only use stored users if they have password field (not from API version)
      if (stored?.length && stored.some(u => u.password)) {
        return stored.map(u => ({
          ...u, friendIds: u.friendIds || [], sentRequests: u.sentRequests || [], receivedRequests: u.receivedRequests || [],
        }));
      }
    } catch {}
    return freshUsers();
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      if (!localStorage.getItem(STORAGE_V)) return null;
      const id = JSON.parse(localStorage.getItem('ub_userid'));
      if (id) return id;
      const user = JSON.parse(localStorage.getItem('ub_user'));
      return user?.id || null;
    } catch { return null; }
  });

  const currentUser = currentUserId ? (allUsers.find(u => u.id === currentUserId) || null) : null;

  const [posts, setPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ub_posts')) || initialPosts; } catch { return initialPosts; }
  });
  const [notifications, setNotifications] = useState(initialNotifications);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ub_dark') === 'true');
  const [savedPosts, setSavedPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ub_saved')) || []; } catch { return []; }
  });
  const [contacts] = useState(initialContacts);

  useEffect(() => {
    try { localStorage.setItem('ub_users', JSON.stringify(allUsers)); }
    catch { /* localStorage quota exceeded — images too large, ignore */ }
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

  // Daily hadith auto-post
  useEffect(() => {
    const todayKey = new Date().toISOString().slice(0, 10); // "2025-06-06"
    const lastPosted = localStorage.getItem('ub_hadith_date');
    if (lastPosted === todayKey) return;

    // Pick today's hadith deterministically by day-of-year
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const h = hadithCollection[dayOfYear % hadithCollection.length];

    // Bot user — system account (admin id:3)
    const botUser = { id: 3, name: 'UmmahBook Daily', avatar: 'https://i.pravatar.cc/150?img=68' };
    const todayLabel = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    const newPost = {
      id: Date.now(),
      user: botUser,
      time: todayLabel,
      privacy: 'public',
      type: 'hadith',
      arabic: h.arabic,
      content: `${h.text}\n\n📚 ${h.source}\n🏷️ বিষয়: ${h.topic}`,
      image: null,
      likes: 0, comments: 0, shares: 0,
      reactions: [], userReactions: {}, commentsList: [], savedBy: [],
      isAutoPost: true,
    };

    setPosts(prev => {
      // Remove previous auto-post if any from today to avoid duplicates on re-render
      const filtered = prev.filter(p => !p.isAutoPost || p.time !== todayLabel);
      return [newPost, ...filtered];
    });
    localStorage.setItem('ub_hadith_date', todayKey);
  }, []);
  useEffect(() => { localStorage.setItem('ub_dark', darkMode); }, [darkMode]);
  useEffect(() => { localStorage.setItem('ub_saved', JSON.stringify(savedPosts)); }, [savedPosts]);
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkMode]);

  // Auth
  const login = (username, password) => {
    const user = allUsers.find(u => u.username === username && u.password === password);
    if (user) { setCurrentUserId(user.id); return { ok: true }; }
    return { ok: false, msg: 'ভুল username বা password!' };
  };

  const register = ({ name, username, password }) => {
    const exists = allUsers.find(u => u.username === username);
    if (exists) return { ok: false, msg: 'এই username ইতিমধ্যে আছে!' };
    const newUser = {
      id: Date.now(), username, password, name,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`,
      coverPhoto: `https://picsum.photos/seed/${username}/900/300`,
      bio: 'Muslim · Bangladesh 🇧🇩', location: 'Bangladesh',
      joinDate: 'June 2025', friends: 0, title: 'Muslim · Bangladesh',
      friendIds: [], sentRequests: [], receivedRequests: [],
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
    setAllUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, ...updates } : u));
  };

  // Friend system
  const sendFriendRequest = (toUserId) => {
    // Guard: skip if already friend, already sent, or already received
    if (!currentUser) return;
    if ((currentUser.friendIds || []).includes(toUserId)) return;
    if ((currentUser.sentRequests || []).includes(toUserId)) return;
    if ((currentUser.receivedRequests || []).includes(toUserId)) return;
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) return { ...u, sentRequests: [...(u.sentRequests || []), toUserId] };
      if (u.id === toUserId) return { ...u, receivedRequests: [...(u.receivedRequests || []), currentUserId] };
      return u;
    }));
  };

  // Called by the SENDER to cancel their own outgoing request
  const cancelFriendRequest = (toUserId) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) return { ...u, sentRequests: (u.sentRequests || []).filter(id => id !== toUserId) };
      if (u.id === toUserId) return { ...u, receivedRequests: (u.receivedRequests || []).filter(id => id !== currentUserId) };
      return u;
    }));
  };

  // Called by the RECEIVER to decline/reject an incoming request
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
  };

  const removeFriend = (userId) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUserId) return { ...u, friendIds: (u.friendIds || []).filter(id => id !== userId), friends: Math.max(0, (u.friends || 0) - 1) };
      if (u.id === userId) return { ...u, friendIds: (u.friendIds || []).filter(id => id !== currentUserId), friends: Math.max(0, (u.friends || 0) - 1) };
      return u;
    }));
  };

  const isFriend = (userId) => (currentUser?.friendIds || []).includes(userId);
  const hasSentRequest = (userId) => (currentUser?.sentRequests || []).includes(userId);
  const hasReceivedRequest = (userId) => (currentUser?.receivedRequests || []).includes(userId);
  const getUserById = (id) => allUsers.find(u => u.id === parseInt(id));

  // Posts
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
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const userReactions = { ...(p.userReactions || {}) };
      const prevReaction = userReactions[currentUser.id];
      if (prevReaction === reaction.label) {
        delete userReactions[currentUser.id];
        return { ...p, likes: Math.max(0, p.likes - 1), userReactions };
      }
      userReactions[currentUser.id] = reaction.label;
      return { ...p, likes: p.likes + (prevReaction ? 0 : 1), userReactions };
    }));
  };

  const addComment = (postId, text) => {
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

  const sharePost = (postId) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, shares: p.shares + 1 } : p));

  const toggleSave = (postId) => setSavedPosts(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingRequestsCount = (currentUser?.receivedRequests || []).length;

  return (
    <AppContext.Provider value={{
      currentUser, authLoading: false, login, logout, register, updateProfile,
      posts, addPost, deletePost, toggleLike, addComment, sharePost,
      savedPosts, toggleSave,
      notifications, markAllRead, unreadCount,
      darkMode, setDarkMode,
      contacts, allUsers,
      sendFriendRequest, cancelFriendRequest, declineFriendRequest, acceptFriend, removeFriend,
      isFriend, hasSentRequest, hasReceivedRequest, getUserById,
      pendingRequestsCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
