import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Post from '../components/Post';

function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ name: user.name, bio: user.bio || '', location: user.location || '' });
  const h = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="card p-6 w-full max-w-[440px] rounded-2xl shadow-2xl fade-in">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-[17px] text-green-700">Edit Profile</h3>
            <p className="text-[12px] text-green-500">প্রোফাইল সম্পাদনা করুন</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-green-50 flex items-center justify-center text-[20px] text-gray-500">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-green-700 mb-1">Name · নাম</label>
            <input name="name" value={form.name} onChange={h} className="input-base" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-green-700 mb-1">Bio · বায়ো</label>
            <textarea name="bio" value={form.bio} onChange={h} rows={3} className="input-base resize-none" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-green-700 mb-1">Location · অবস্থান</label>
            <input name="location" value={form.location} onChange={h} className="input-base" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-green-200 text-green-700 font-bold text-[14px] hover:bg-green-50">Cancel · বাতিল</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-green-700 text-white font-bold text-[14px] hover:bg-green-800">Save · সংরক্ষণ</button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { userId } = useParams();
  const {
    currentUser, allUsers, posts, updateProfile, savedPosts,
    isFriend, hasSentRequest, hasReceivedRequest,
    sendFriendRequest, cancelFriendRequest, acceptFriend, removeFriend,
  } = useApp();
  const [tab, setTab] = useState('posts');
  const [editing, setEditing] = useState(false);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  if (!currentUser) return <div className="card p-8 text-center text-green-600">লগইন প্রয়োজন।</div>;

  const profileUserId = userId ? parseInt(userId) : currentUser.id;
  const isOwnProfile = profileUserId === currentUser.id;
  const profileUser = isOwnProfile ? currentUser : allUsers.find(u => u.id === profileUserId);

  if (!profileUser) return (
    <div className="card p-8 text-center text-green-600">
      <p className="text-[40px] mb-3">👤</p>
      <p className="font-bold text-[16px]">ব্যবহারকারী পাওয়া যায়নি।</p>
    </div>
  );

  const handleImageChange = (field, file) => {
    if (!file) return;
    const maxW = field === 'coverPhoto' ? 1200 : 400;
    const maxH = field === 'coverPhoto' ? 400  : 400;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      try {
        updateProfile({ [field]: canvas.toDataURL('image/jpeg', 0.75) });
      } catch {
        alert('Image too large. Please choose a smaller image.');
      }
    };
    img.src = url;
  };

  const userPosts = posts.filter(p => p.user.id === profileUser.id);
  const saved = posts.filter(p => savedPosts.includes(p.id));
  const friends = allUsers.filter(u => (profileUser.friendIds || []).includes(u.id));

  const tabs = [
    { key: 'posts', label: `Posts · পোস্ট (${userPosts.length})` },
    ...(isOwnProfile ? [{ key: 'saved', label: `Saved · সংরক্ষিত (${saved.length})` }] : []),
    { key: 'friends', label: `Friends · বন্ধু (${friends.length})` },
    { key: 'about', label: 'About · পরিচয়' },
  ];

  const FriendButton = () => {
    if (isFriend(profileUser.id)) return (
      <button
        onClick={() => removeFriend(profileUser.id)}
        className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold text-[13px] hover:bg-red-50 hover:text-red-600 transition-colors leading-tight"
        title="Click to unfriend / বন্ধুত্ব বাতিল করতে ক্লিক করুন"
      >
        <p>👥 Friends ✓</p>
        <p className="text-[11px] opacity-80">বন্ধু</p>
      </button>
    );
    if (hasSentRequest(profileUser.id)) return (
      <button
        onClick={() => cancelFriendRequest(profileUser.id)}
        className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-bold text-[13px] hover:bg-yellow-200 transition-colors leading-tight"
      >
        <p>⏳ Pending</p>
        <p className="text-[11px] opacity-80">অনুরোধ পাঠানো</p>
      </button>
    );
    if (hasReceivedRequest(profileUser.id)) return (
      <button
        onClick={() => acceptFriend(profileUser.id)}
        className="px-4 py-2 rounded-xl bg-green-700 text-white font-bold text-[13px] hover:bg-green-800 transition-colors leading-tight"
      >
        <p>✓ Accept Request</p>
        <p className="text-[11px] opacity-80">অনুরোধ গ্রহণ করুন</p>
      </button>
    );
    return (
      <button
        onClick={() => sendFriendRequest(profileUser.id)}
        className="px-4 py-2 rounded-xl bg-green-700 text-white font-bold text-[13px] hover:bg-green-800 transition-colors leading-tight"
      >
        <p>+ Add Friend</p>
        <p className="text-[11px] opacity-80">বন্ধু যোগ করুন</p>
      </button>
    );
  };

  return (
    <div className="fade-in">
      {editing && <EditProfileModal user={profileUser} onClose={() => setEditing(false)} onSave={updateProfile} />}

      {/* Hidden file inputs */}
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleImageChange('avatar', e.target.files[0])} />
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleImageChange('coverPhoto', e.target.files[0])} />

      {/* Cover */}
      <div className="relative rounded-b-xl overflow-hidden mb-0 shadow-md group">
        <img src={profileUser.coverPhoto || `https://picsum.photos/seed/${profileUser.username}/900/280`}
          alt="cover" className="w-full h-[220px] sm:h-[280px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {isOwnProfile && (
          <button
            onClick={() => coverInputRef.current.click()}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white font-bold text-[12px] px-3 py-2 rounded-xl shadow transition-all backdrop-blur-sm border border-white/20">
            <span className="text-[16px]">📷</span>
            <div className="text-left leading-tight">
              <p className="text-[12px] font-bold">Change Cover</p>
              <p className="text-[10px] opacity-80">কভার ছবি পরিবর্তন</p>
            </div>
          </button>
        )}
      </div>

      {/* Avatar + Info */}
      <div className="card rounded-t-none px-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">

          {/* Avatar with change button */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 group">
            <img src={profileUser.avatar} alt={profileUser.name}
              className="w-full h-full rounded-full border-4 border-white object-cover shadow-lg" />
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
            {isOwnProfile && (
              <button
                onClick={() => avatarInputRef.current.click()}
                className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[22px]">📷</span>
                <span className="text-white text-[10px] font-bold mt-0.5">Change</span>
              </button>
            )}
          </div>

          <div className="pb-2 flex-1">
            <h1 className="text-[22px] font-extrabold text-green-800">{profileUser.name}</h1>
            {profileUser.title && <p className="text-green-600 text-[13px] font-medium">{profileUser.title}</p>}
            <p className="text-gray-500 text-[13px] mt-1">👥 {profileUser.friends || 0} বন্ধু</p>
          </div>

          <div className="flex gap-2 pb-2">
            {isOwnProfile ? (
              <button onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl bg-green-700 text-white font-bold text-[13px] hover:bg-green-800 leading-tight">
                <p>✏️ Edit Profile</p>
                <p className="text-[11px] opacity-80">সম্পাদনা</p>
              </button>
            ) : (
              <FriendButton />
            )}
          </div>
        </div>

        {profileUser.bio && (
          <p className="text-[14px] text-gray-600 mt-3 pt-3 border-t border-green-100 whitespace-pre-line">{profileUser.bio}</p>
        )}

        <div className="flex flex-wrap gap-4 mt-3 text-[13px] text-gray-500">
          {profileUser.location && <span>📍 {profileUser.location}</span>}
          {profileUser.joinDate && <span>📅 যোগদান: {profileUser.joinDate}</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="card mt-2 flex overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 min-w-[80px] py-3 font-bold text-[12px] border-b-2 transition-colors ${
              tab === t.key ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:bg-green-50'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-3 space-y-3">
        {tab === 'posts' && (
          userPosts.length === 0
            ? <div className="card p-8 text-center text-green-600">🕌 এখনো কোনো পোস্ট নেই।</div>
            : userPosts.map(p => <Post key={p.id} post={p} />)
        )}
        {tab === 'saved' && isOwnProfile && (
          saved.length === 0
            ? <div className="card p-8 text-center text-green-600">🔖 কোনো সংরক্ষিত পোস্ট নেই।</div>
            : saved.map(p => <Post key={p.id} post={p} />)
        )}
        {tab === 'friends' && (
          friends.length === 0
            ? <div className="card p-8 text-center text-green-600">👥 এখনো কোনো বন্ধু নেই।</div>
            : (
              <div className="card p-4">
                <h3 className="font-bold text-[15px] text-green-700 mb-3">Friends · বন্ধু তালিকা</h3>
                <div className="grid grid-cols-3 gap-3">
                  {friends.map(f => (
                    <Link key={f.id} to={`/profile/${f.id}`}
                      className="border border-green-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow text-center">
                      <img src={f.avatar} alt={f.name} className="w-full h-[90px] object-cover" />
                      <div className="p-2">
                        <p className="font-bold text-[12px] text-green-800 truncate">{f.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{f.title || 'Muslim'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
        )}
        {tab === 'about' && (
          <div className="card p-5 space-y-4">
            <h3 className="font-bold text-[16px] text-green-700 border-b border-green-100 pb-2">About · পরিচয় তথ্য</h3>
            <div className="space-y-3 text-[14px]">
              <div className="flex gap-3"><span className="text-[18px]">👤</span><div><p className="text-gray-500 text-[12px]">Name · নাম</p><p className="font-semibold">{profileUser.name}</p></div></div>
              <div className="flex gap-3"><span className="text-[18px]">🏷️</span><div><p className="text-gray-500 text-[12px]">Username</p><p className="font-semibold">@{profileUser.username}</p></div></div>
              {profileUser.location && <div className="flex gap-3"><span className="text-[18px]">📍</span><div><p className="text-gray-500 text-[12px]">Location · অবস্থান</p><p className="font-semibold">{profileUser.location}</p></div></div>}
              {profileUser.joinDate && <div className="flex gap-3"><span className="text-[18px]">📅</span><div><p className="text-gray-500 text-[12px]">Joined · যোগদান</p><p className="font-semibold">{profileUser.joinDate}</p></div></div>}
              <div className="flex gap-3"><span className="text-[18px]">👥</span><div><p className="text-gray-500 text-[12px]">Friends · বন্ধু</p><p className="font-semibold">{profileUser.friends || 0} জন</p></div></div>
              {profileUser.bio && <div className="flex gap-3"><span className="text-[18px]">📝</span><div><p className="text-gray-500 text-[12px]">Bio · বায়ো</p><p className="font-semibold whitespace-pre-line">{profileUser.bio}</p></div></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
