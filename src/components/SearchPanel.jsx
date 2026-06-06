import { Link } from 'react-router-dom';
import { FaUserCheck, FaUserPlus, FaTimes } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function SearchPanel({ query, onClose }) {
  const {
    currentUser, allUsers,
    isFriend, hasSentRequest, hasReceivedRequest,
    sendFriendRequest, cancelFriendRequest, declineFriendRequest, acceptFriend,
  } = useApp();

  if (!query.trim() || !currentUser) return null;

  const q = query.toLowerCase();
  const results = allUsers.filter(u =>
    u.id !== currentUser.id &&
    (u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
  );

  return (
    <div className="absolute left-0 top-12 w-[340px] bg-white rounded-2xl shadow-2xl border border-green-100 z-50 overflow-hidden fade-in">
      <div className="px-4 py-2.5 border-b border-green-100 bg-green-50 flex items-center justify-between">
        <p className="text-[13px] font-bold text-green-700">
          Search results · "{query}"
        </p>
        <span className="text-[11px] text-gray-400">{results.length} found</span>
      </div>

      <div className="max-h-[420px] overflow-y-auto divide-y divide-green-50">
        {results.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[32px] mb-2">🔍</p>
            <p className="font-bold text-[14px] text-gray-600">No users found</p>
            <p className="text-[12px] text-gray-400 mt-1">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
          </div>
        ) : results.map(user => {
          const friend   = isFriend(user.id);
          const sent     = hasSentRequest(user.id);
          const received = hasReceivedRequest(user.id);

          return (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50/50 transition-colors">
              <Link to={`/profile/${user.id}`} onClick={onClose} className="flex-shrink-0">
                <img src={user.avatar} alt={user.name}
                  className="w-[46px] h-[46px] rounded-full object-cover border-2 border-green-200" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user.id}`} onClick={onClose}>
                  <p className="font-bold text-[14px] text-green-900 hover:underline truncate">{user.name}</p>
                </Link>
                <p className="text-[11px] text-gray-400 truncate">@{user.username} · {user.title || 'Muslim'}</p>
              </div>

              {/* Action button */}
              <div className="flex-shrink-0">
                {friend ? (
                  <span className="flex items-center gap-1 text-[11px] text-green-600 font-bold bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                    <FaUserCheck className="text-[10px]" /> Friends
                  </span>
                ) : received ? (
                  <button onClick={() => acceptFriend(user.id)}
                    className="flex items-center gap-1 text-[11px] text-white font-bold bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-lg transition-colors active:scale-95">
                    <FaUserCheck className="text-[10px]" /> Accept
                  </button>
                ) : sent ? (
                  <button onClick={() => cancelFriendRequest(user.id)}
                    className="text-[11px] text-yellow-700 font-bold bg-yellow-100 hover:bg-yellow-200 px-2.5 py-1.5 rounded-lg transition-colors">
                    ⏳ Pending
                  </button>
                ) : (
                  <button onClick={() => sendFriendRequest(user.id)}
                    className="flex items-center gap-1 text-[11px] text-white font-bold bg-green-700 hover:bg-green-800 px-2.5 py-1.5 rounded-lg transition-colors active:scale-95">
                    <FaUserPlus className="text-[10px]" /> Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
