import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ub_dark') === 'true');
  const [authLoading, setAuthLoading] = useState(true);

  // Dark mode
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    localStorage.setItem('ub_dark', darkMode);
  }, [darkMode]);

  // Fetch data after login
  const fetchAppData = useCallback(async () => {
    try {
      const [postsRes, usersRes, notiRes] = await Promise.all([
        api.get('/posts'),
        api.get('/users'),
        api.get('/notifications'),
      ]);
      setPosts(postsRes.data);
      setAllUsers(usersRes.data);
      setNotifications(notiRes.data);
    } catch (err) {
      console.error('Failed to fetch app data:', err.message);
    }
  }, []);

  // Refresh current user (to get latest friendIds etc.)
  const refreshCurrentUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data.user);
      return res.data.user;
    } catch {
      return null;
    }
  }, []);

  // Initialize: check token on mount
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('ub_token');
      if (!token) { setAuthLoading(false); return; }
      try {
        const res = await api.get('/auth/me');
        setCurrentUser(res.data.user);
        await fetchAppData();
      } catch {
        localStorage.removeItem('ub_token');
      } finally {
        setAuthLoading(false);
      }
    };
    init();
  }, [fetchAppData]);

  // Auth
  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('ub_token', res.data.token);
      setCurrentUser(res.data.user);
      await fetchAppData();
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: err.response?.data?.msg || 'লগইন ব্যর্থ হয়েছে!' };
    }
  };

  const register = async ({ name, username, password }) => {
    try {
      const res = await api.post('/auth/register', { name, username, password });
      localStorage.setItem('ub_token', res.data.token);
      setCurrentUser(res.data.user);
      await fetchAppData();
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: err.response?.data?.msg || 'নিবন্ধন ব্যর্থ হয়েছে!' };
    }
  };

  const logout = () => {
    localStorage.removeItem('ub_token');
    setCurrentUser(null);
    setPosts([]);
    setAllUsers([]);
    setNotifications([]);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/users/profile', updates);
      setCurrentUser(prev => ({ ...prev, ...res.data }));
      setAllUsers(prev => prev.map(u => u.id === res.data.id ? { ...u, ...res.data } : u));
    } catch (err) {
      console.error('Profile update failed:', err.message);
    }
  };

  // Friend system
  const sendFriendRequest = async (toUserId) => {
    // Optimistic update
    setCurrentUser(prev => ({
      ...prev,
      sentRequests: [...(prev.sentRequests || []), toUserId],
    }));
    try {
      await api.post(`/friends/request/${toUserId}`);
    } catch {
      // Revert on failure
      setCurrentUser(prev => ({
        ...prev,
        sentRequests: (prev.sentRequests || []).filter(id => id !== toUserId),
      }));
    }
  };

  const cancelFriendRequest = async (toUserId) => {
    setCurrentUser(prev => ({
      ...prev,
      sentRequests: (prev.sentRequests || []).filter(id => id !== toUserId),
    }));
    try {
      await api.delete(`/friends/request/${toUserId}`);
    } catch {
      setCurrentUser(prev => ({
        ...prev,
        sentRequests: [...(prev.sentRequests || []), toUserId],
      }));
    }
  };

  const acceptFriend = async (fromUserId) => {
    try {
      await api.post(`/friends/accept/${fromUserId}`);
      await refreshCurrentUser();
      setAllUsers(prev => prev.map(u => {
        if (u.id === fromUserId) {
          return { ...u, friendIds: [...(u.friendIds || []), currentUser.id] };
        }
        return u;
      }));
    } catch (err) {
      console.error('Accept friend failed:', err.message);
    }
  };

  const removeFriend = async (userId) => {
    setCurrentUser(prev => ({
      ...prev,
      friendIds: (prev.friendIds || []).filter(id => id !== userId),
      friends: Math.max(0, (prev.friends || 0) - 1),
    }));
    try {
      await api.delete(`/friends/${userId}`);
    } catch {
      await refreshCurrentUser();
    }
  };

  const isFriend = (userId) => (currentUser?.friendIds || []).includes(userId);
  const hasSentRequest = (userId) => (currentUser?.sentRequests || []).includes(userId);
  const hasReceivedRequest = (userId) => (currentUser?.receivedRequests || []).includes(userId);
  const getUserById = (id) => allUsers.find(u => u.id === parseInt(id));

  // Posts
  const addPost = async ({ content, image, type, arabic, privacy }) => {
    try {
      const res = await api.post('/posts', { content, image, type, arabic, privacy });
      setPosts(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Add post failed:', err.message);
    }
  };

  const deletePost = async (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    try {
      await api.delete(`/posts/${postId}`);
    } catch {
      // Re-fetch on failure
      const res = await api.get('/posts');
      setPosts(res.data);
    }
  };

  const toggleLike = async (postId, reaction) => {
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const userReactions = { ...(p.userReactions || {}) };
      const prevReaction = userReactions[currentUser.id];
      if (prevReaction === reaction.label) {
        delete userReactions[currentUser.id];
        return { ...p, likes: Math.max(0, p.likes - 1), userReactions };
      }
      const likeDelta = prevReaction ? 0 : 1;
      userReactions[currentUser.id] = reaction.label;
      return { ...p, likes: p.likes + likeDelta, userReactions };
    }));
    try {
      await api.post(`/posts/${postId}/react`, { reaction: reaction.label });
    } catch (err) {
      console.error('React failed:', err.message);
    }
  };

  const addComment = async (postId, text) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: p.comments + 1,
          commentsList: [...(p.commentsList || []), res.data],
        };
      }));
    } catch (err) {
      console.error('Comment failed:', err.message);
    }
  };

  const sharePost = async (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, shares: p.shares + 1 } : p));
    try {
      await api.post(`/posts/${postId}/share`);
    } catch (err) {
      console.error('Share failed:', err.message);
    }
  };

  const toggleSave = async (postId) => {
    const isSaved = savedPosts.includes(postId);
    setSavedPosts(prev => isSaved ? prev.filter(id => id !== postId) : [...prev, postId]);
    try {
      await api.post(`/posts/${postId}/save`);
    } catch (err) {
      setSavedPosts(prev => isSaved ? [...prev, postId] : prev.filter(id => id !== postId));
    }
  };

  // Notifications
  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await api.put('/notifications/read-all');
    } catch (err) {
      console.error('Mark read failed:', err.message);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Contacts (static for now)
  const contacts = [
    { id: 1, name: 'Abdullah Al-Faruk', avatar: 'https://i.pravatar.cc/150?img=3', online: true },
    { id: 2, name: 'Fatima Begum', avatar: 'https://i.pravatar.cc/150?img=5', online: true },
    { id: 3, name: 'Umar Farooq', avatar: 'https://i.pravatar.cc/150?img=8', online: false },
    { id: 4, name: 'Ayesha Siddiqua', avatar: 'https://i.pravatar.cc/150?img=9', online: true },
  ];

  return (
    <AppContext.Provider value={{
      currentUser, authLoading, login, logout, register, updateProfile,
      posts, addPost, deletePost, toggleLike, addComment, sharePost,
      savedPosts, toggleSave,
      notifications, markAllRead, unreadCount,
      darkMode, setDarkMode,
      contacts,
      allUsers,
      sendFriendRequest, cancelFriendRequest, acceptFriend, removeFriend,
      isFriend, hasSentRequest, hasReceivedRequest, getUserById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
