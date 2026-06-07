import { Link } from 'react-router-dom';
import { FaUserCheck, FaUserPlus } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function SearchPanel({ query, onClose }) {
  const { currentUser, allUsers, isFriend, hasSentRequest, hasReceivedRequest,
    sendFriendRequest, cancelFriendRequest, declineFriendRequest, acceptFriend } = useApp();

  if (!query.trim() || !currentUser) return null;

  const q       = query.toLowerCase();
  const results = allUsers.filter(u =>
    u.id !== currentUser.id &&
    (u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
  );

  return (
    <div className="absolute left-0 right-0 sm:right-auto sm:w-[340px] top-12 bg-white dark:bg-[#0f2313] rounded-2xl shadow-2xl border border-green-100 dark:border-[#1a4a20] z-50 overflow-hidden fade-in">

      <div className="px-4 py-2.5 border-b border-green-100 dark:border-[#1a4a20] bg-green-50 dark:bg-[#142d18] flex items-center justify-between">
        <p className="text-[13px] font-bold text-green-700 dark:text-[#6abf69]">
          Search results · "{query}"
        </p>
        <span className="text-[11px] text-gray-400 dark:text-[#4a7a50]">{results.length} found</span>
      </div>

      <div className="max-h-[55vh] sm:max-h-[420px] overflow-y-auto divide-y divide-green-50 dark:divide-[#142d18]">
        {results.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[32px] mb-2">🔍</p>
            <p className="font-bold text-[14px] text-gray-600 dark:text-[#6abf69]">No users found</p>
            <p className="text-[12px] text-gray-400 dark:text-[#4a7a50] mt-1">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
          </div>
        ) : results.map(user => {
          const friend   = isFriend(user.id);
          const sentReq  = hasSentRequest(user.id);
          const rcvd     = hasReceivedRequest(user.id);

          return (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50/50 dark:hover:bg-[#142d18] transition-colors">
              <Link to={`/profile/${user.id}`} onClick={onClose} className="flex-shrink-0">
                <img src={user.avatar} alt={user.name}
                  className="w-[46px] h-[46px] rounded-full object-cover border-2 border-green-200 dark:border-[#1a4a20]" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user.id}`} onClick={onClose}>
                  <p className="font-bold text-[14px] text-green-900 dark:text-[#e8f5e9] hover:underline truncate">{user.name}</p>
                </Link>
                <p className="text-[11px] text-gray-400 dark:text-[#4a7a50] truncate">@{user.username} · {user.islamicRole || 'Muslim'}</p>
              </div>

              <div className="flex-shrink-0">
                {friend ? (
                  <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-[#4ade80] font-bold bg-green-50 dark:bg-[#142d18] border border-green-200 dark:border-[#1a4a20] px-2.5 py-1 rounded-lg">
                    <FaUserCheck className="text-[10px]" /> Friends
                  </span>
                ) : rcvd ? (
                  <button onClick={() => acceptFriend(user.id)}
                    className="flex items-center gap-1 text-[11px] text-white font-bold bg-green-700 hover:bg-green-800 px-2.5 py-1.5 rounded-lg transition-colors active:scale-95">
                    <FaUserCheck className="text-[10px]" /> Accept
                  </button>
                ) : sentReq ? (
                  <button onClick={() => cancelFriendRequest(user.id)}
                    className="text-[11px] text-yellow-700 dark:text-[#fbbf24] font-bold bg-yellow-100 dark:bg-[#2d2a0f] hover:bg-yellow-200 px-2.5 py-1.5 rounded-lg transition-colors">
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
