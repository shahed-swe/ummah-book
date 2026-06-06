import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function FriendSuggestions() {
  const { currentUser, allUsers, isFriend, hasSentRequest, hasReceivedRequest, sendFriendRequest, cancelFriendRequest, acceptFriend } = useApp();
  const [dismissed, setDismissed] = useState([]);

  if (!currentUser) return null;

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

      <div className="grid grid-cols-3 gap-3">
        {suggestions.slice(0, 6).map((person) => (
          <div key={person.id} className="border border-green-100 rounded-xl overflow-hidden relative group hover:shadow-md transition-shadow">
            <button
              onClick={() => setDismissed(prev => [...prev, person.id])}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-100"
            >
              <FaTimes className="text-gray-500 text-[10px]" />
            </button>

            <Link to={`/profile/${person.id}`}>
              <img src={person.avatar} alt={person.name}
                className="w-full h-[100px] object-cover hover:opacity-90 transition-opacity" />
            </Link>

            <div className="p-2 text-center">
              <Link to={`/profile/${person.id}`}>
                <p className="font-bold text-[12px] text-green-900 leading-tight truncate hover:underline">{person.name}</p>
              </Link>
              <p className="text-[11px] text-gray-500 mt-0.5 truncate">{person.title || 'Muslim'}</p>

              {hasReceivedRequest(person.id) ? (
                <button
                  onClick={() => acceptFriend(person.id)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] transition-colors leading-tight">
                  <p>✓ Accept</p>
                  <p className="opacity-80">গ্রহণ করুন</p>
                </button>
              ) : hasSentRequest(person.id) ? (
                <button
                  onClick={() => cancelFriendRequest(person.id)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 font-bold text-[10px] transition-colors hover:bg-yellow-200 leading-tight">
                  <p>⏳ Pending</p>
                  <p className="opacity-80">অনুরোধ পাঠানো</p>
                </button>
              ) : (
                <button
                  onClick={() => sendFriendRequest(person.id)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold text-[10px] transition-colors leading-tight">
                  <p>+ Add Friend</p>
                  <p className="opacity-80">বন্ধু যোগ করুন</p>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
