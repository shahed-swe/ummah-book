import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function FriendSuggestions() {
  const {
    currentUser, allUsers,
    isFriend, hasSentRequest, hasReceivedRequest,
    sendFriendRequest, cancelFriendRequest, declineFriendRequest, acceptFriend,
  } = useApp();
  const [dismissed, setDismissed] = useState([]);

  if (!currentUser) return null;

  // Show everyone who is not already a friend and not dismissed
  const suggestions = allUsers.filter(u =>
    u.id !== currentUser.id &&
    !isFriend(u.id) &&
    !dismissed.includes(u.id)
  );

  if (suggestions.length === 0) return null;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-bold text-green-800">People You May Know</h3>
          <p className="text-[12px] text-green-600">আপনি হয়তো চেনেন</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {suggestions.slice(0, 6).map((person) => {
          const received = hasReceivedRequest(person.id);
          const sent     = hasSentRequest(person.id);

          return (
            <div key={person.id} className="border border-green-100 rounded-xl overflow-hidden relative group hover:shadow-md transition-shadow">
              {/* Dismiss button */}
              {!received && !sent && (
                <button
                  onClick={() => setDismissed(prev => [...prev, person.id])}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm border border-gray-100">
                  <FaTimes className="text-gray-500 text-[10px]" />
                </button>
              )}

              <Link to={`/profile/${person.id}`}>
                <img src={person.avatar} alt={person.name}
                  className="w-full h-[120px] sm:h-[100px] object-cover hover:opacity-90 transition-opacity" />
              </Link>

              <div className="p-2 text-center">
                <Link to={`/profile/${person.id}`}>
                  <p className="font-bold text-[13px] text-green-900 leading-tight truncate hover:underline">{person.name}</p>
                </Link>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{person.title || 'Muslim'}</p>

                {received ? (
                  // They sent ME a request — show Accept + Decline
                  <div className="flex flex-col gap-1 mt-2">
                    <button onClick={() => acceptFriend(person.id)}
                      className="w-full py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold text-[12px] transition-colors">
                      ✓ গ্রহণ করুন
                    </button>
                    <button onClick={() => declineFriendRequest(person.id)}
                      className="w-full py-2 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold text-[12px] transition-colors">
                      বাতিল
                    </button>
                  </div>
                ) : sent ? (
                  // I sent THEM a request — show Cancel
                  <button onClick={() => cancelFriendRequest(person.id)}
                    className="w-full mt-2 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-bold text-[12px] transition-colors hover:bg-yellow-200">
                    ⏳ Pending
                  </button>
                ) : (
                  // No request — show Add Friend
                  <button onClick={() => sendFriendRequest(person.id)}
                    className="w-full mt-2 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold text-[12px] transition-colors active:scale-95">
                    + বন্ধু যোগ করুন
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
