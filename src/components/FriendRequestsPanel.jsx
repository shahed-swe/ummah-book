import { useState } from 'react';
import { FaTimes, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function FriendRequestsPanel({ onClose }) {
  const {
    currentUser, allUsers,
    acceptFriend, cancelFriendRequest,
    hasSentRequest,
  } = useApp();

  const [tab, setTab] = useState('received'); // 'received' | 'sent'
  const [dismissed, setDismissed] = useState([]);

  if (!currentUser) return null;

  const received = (currentUser.receivedRequests || [])
    .filter(id => !dismissed.includes(id))
    .map(id => allUsers.find(u => u.id === id))
    .filter(Boolean);

  const sent = (currentUser.sentRequests || [])
    .map(id => allUsers.find(u => u.id === id))
    .filter(Boolean);

  const handleDecline = (userId) => {
    cancelFriendRequest(userId); // removes from both sides
    setDismissed(prev => [...prev, userId]);
  };

  return (
    <div className="absolute right-0 top-12 w-[360px] bg-white rounded-2xl shadow-2xl border border-green-100 z-50 overflow-hidden fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-green-100">
        <div>
          <h3 className="text-[18px] font-bold text-green-800">Friend Requests</h3>
          <p className="text-[12px] text-green-500">বন্ধু অনুরোধ</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-green-50 flex items-center justify-center">
          <FaTimes className="text-gray-500 text-sm" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-green-100">
        <button onClick={() => setTab('received')}
          className={`flex-1 py-2.5 text-[13px] font-bold transition-colors relative ${
            tab === 'received' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500 hover:bg-green-50'
          }`}>
          Received · পাওয়া
          {received.length > 0 && (
            <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{received.length}</span>
          )}
        </button>
        <button onClick={() => setTab('sent')}
          className={`flex-1 py-2.5 text-[13px] font-bold transition-colors ${
            tab === 'sent' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500 hover:bg-green-50'
          }`}>
          Sent · পাঠানো
          {sent.length > 0 && (
            <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full px-1.5 py-0.5">{sent.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[420px] overflow-y-auto">
        {tab === 'received' && (
          <>
            {received.length === 0 ? (
              <div className="py-10 text-center text-green-600">
                <FaUserPlus className="text-[32px] mx-auto mb-2 text-green-300" />
                <p className="font-bold text-[14px]">No pending requests</p>
                <p className="text-[12px] text-green-400 mt-1">কোনো অনুরোধ নেই</p>
              </div>
            ) : (
              received.map(user => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-green-50">
                  <Link to={`/profile/${user.id}`} onClick={onClose} className="flex-shrink-0">
                    <img src={user.avatar} alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-300" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${user.id}`} onClick={onClose}>
                      <p className="font-bold text-[14px] text-green-900 hover:underline truncate">{user.name}</p>
                    </Link>
                    <p className="text-[11px] text-gray-500 truncate">{user.title || 'Muslim'}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => acceptFriend(user.id)}
                        className="flex-1 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold text-[12px] transition-colors flex items-center justify-center gap-1">
                        <FaUserCheck className="text-[11px]" />
                        <span>Confirm · গ্রহণ</span>
                      </button>
                      <button onClick={() => handleDecline(user.id)}
                        className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[12px] transition-colors">
                        Delete · বাতিল
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {tab === 'sent' && (
          <>
            {sent.length === 0 ? (
              <div className="py-10 text-center text-green-600">
                <FaUserPlus className="text-[32px] mx-auto mb-2 text-green-300" />
                <p className="font-bold text-[14px]">No sent requests</p>
                <p className="text-[12px] text-green-400 mt-1">কোনো পাঠানো অনুরোধ নেই</p>
              </div>
            ) : (
              sent.map(user => (
                <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-green-50">
                  <Link to={`/profile/${user.id}`} onClick={onClose} className="flex-shrink-0">
                    <img src={user.avatar} alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-300" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/profile/${user.id}`} onClick={onClose}>
                      <p className="font-bold text-[14px] text-green-900 hover:underline truncate">{user.name}</p>
                    </Link>
                    <p className="text-[11px] text-gray-500 truncate">{user.title || 'Muslim'}</p>
                    <p className="text-[11px] text-yellow-600 font-semibold mt-1">⏳ Pending · অপেক্ষায় আছে</p>
                    <button onClick={() => cancelFriendRequest(user.id)}
                      className="mt-1.5 w-full py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold text-[12px] transition-colors">
                      Cancel Request · বাতিল করুন
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
