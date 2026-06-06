import { useState } from 'react';
import { FaTimes, FaUserPlus, FaUserCheck, FaUserMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function FriendRequestsPanel({ onClose }) {
  const {
    currentUser, allUsers,
    acceptFriend, declineFriendRequest, cancelFriendRequest,
  } = useApp();

  const [tab, setTab] = useState('received');

  if (!currentUser) return null;

  // People who sent ME a request
  const received = (currentUser.receivedRequests || [])
    .map(id => allUsers.find(u => u.id === id))
    .filter(Boolean);

  // People I sent a request to
  const sent = (currentUser.sentRequests || [])
    .map(id => allUsers.find(u => u.id === id))
    .filter(Boolean);

  return (
    <div className="absolute right-0 top-12 w-[360px] bg-white rounded-2xl shadow-2xl border border-green-100 z-50 overflow-hidden fade-in">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-green-100"
        style={{ background: 'linear-gradient(135deg, #1a5c2a, #2d7a3a)' }}>
        <div>
          <h3 className="text-[16px] font-bold text-white">Friend Requests</h3>
          <p className="text-[11px] text-green-300">বন্ধু অনুরোধ</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors">
          <FaTimes className="text-white text-sm" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-green-100 bg-green-50/50">
        <button onClick={() => setTab('received')}
          className={`flex-1 py-2.5 text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5 ${
            tab === 'received' ? 'text-green-700 border-b-2 border-green-700 bg-white' : 'text-gray-500 hover:bg-green-50'
          }`}>
          <FaUserPlus className="text-[11px]" />
          Received · পাওয়া
          {received.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 ml-0.5">{received.length}</span>
          )}
        </button>
        <button onClick={() => setTab('sent')}
          className={`flex-1 py-2.5 text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5 ${
            tab === 'sent' ? 'text-green-700 border-b-2 border-green-700 bg-white' : 'text-gray-500 hover:bg-green-50'
          }`}>
          <FaUserMinus className="text-[11px]" />
          Sent · পাঠানো
          {sent.length > 0 && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full px-1.5 py-0.5 ml-0.5">{sent.length}</span>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[440px] overflow-y-auto divide-y divide-green-50">

        {tab === 'received' && (
          received.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-[40px] mb-2">👥</div>
              <p className="font-bold text-[14px] text-green-700">No pending requests</p>
              <p className="text-[12px] text-gray-400 mt-1">কোনো অনুরোধ নেই</p>
            </div>
          ) : received.map(user => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50/50 transition-colors">
              <Link to={`/profile/${user.id}`} onClick={onClose} className="flex-shrink-0">
                <img src={user.avatar} alt={user.name}
                  className="w-[52px] h-[52px] rounded-full object-cover border-2 border-green-300 hover:border-green-500 transition-colors" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user.id}`} onClick={onClose}>
                  <p className="font-bold text-[14px] text-green-900 hover:underline truncate">{user.name}</p>
                </Link>
                <p className="text-[11px] text-gray-500 truncate mb-2">{user.title || 'Muslim'}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptFriend(user.id)}
                    className="flex-1 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold text-[12px] transition-all flex items-center justify-center gap-1 active:scale-95">
                    <FaUserCheck className="text-[10px]" />
                    Confirm · গ্রহণ
                  </button>
                  <button
                    onClick={() => declineFriendRequest(user.id)}
                    className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 font-bold text-[12px] transition-all active:scale-95">
                    Delete · বাতিল
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {tab === 'sent' && (
          sent.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-[40px] mb-2">📤</div>
              <p className="font-bold text-[14px] text-green-700">No sent requests</p>
              <p className="text-[12px] text-gray-400 mt-1">কোনো পাঠানো অনুরোধ নেই</p>
            </div>
          ) : sent.map(user => (
            <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-green-50/50 transition-colors">
              <Link to={`/profile/${user.id}`} onClick={onClose} className="flex-shrink-0">
                <img src={user.avatar} alt={user.name}
                  className="w-[52px] h-[52px] rounded-full object-cover border-2 border-yellow-300" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user.id}`} onClick={onClose}>
                  <p className="font-bold text-[14px] text-green-900 hover:underline truncate">{user.name}</p>
                </Link>
                <p className="text-[11px] text-gray-500 truncate">{user.title || 'Muslim'}</p>
                <p className="text-[11px] text-yellow-600 font-semibold mt-0.5 mb-2">⏳ Pending · অপেক্ষায়</p>
                <button
                  onClick={() => cancelFriendRequest(user.id)}
                  className="w-full py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold text-[12px] transition-all active:scale-95">
                  Cancel Request · বাতিল করুন
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
