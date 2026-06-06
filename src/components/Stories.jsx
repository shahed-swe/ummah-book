import { FaPlus } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { initialStories } from '../data/initialData';

export default function Stories() {
  const { currentUser } = useApp();

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>

        {/* Create Story */}
        <div className="relative flex-shrink-0 w-[112px] h-[195px] rounded-xl overflow-hidden cursor-pointer shadow-sm group border border-green-200 card">
          <div className="w-full bg-gradient-to-b from-green-600 to-green-800 flex items-center justify-center" style={{ height: '140px' }}>
            {currentUser
              ? <img src={currentUser.avatar} alt="me" className="w-full h-full object-cover" />
              : <span className="text-[50px]">☪️</span>
            }
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-white h-[60px] flex flex-col items-center justify-end pb-2 pt-4">
            <div className="absolute top-[-18px] w-[36px] h-[36px] rounded-full bg-green-600 flex items-center justify-center border-4 border-white">
              <FaPlus className="text-white text-xs" />
            </div>
            <span className="text-[11px] font-bold text-green-800 text-center">স্টোরি তৈরি</span>
          </div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>

        {/* Friend Stories */}
        {initialStories.map((story) => (
          <div key={story.id} className="relative flex-shrink-0 w-[112px] h-[195px] rounded-xl overflow-hidden cursor-pointer shadow-sm group border border-green-100">
            <img src={story.bg} alt={story.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 story-gradient" />

            <div className="absolute top-3 left-3 w-[38px] h-[38px] rounded-full border-4 border-green-500 overflow-hidden">
              <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
            </div>

            <div className="absolute top-3 right-1 bg-green-600/80 rounded-full px-1.5 py-0.5">
              <span className="text-white text-[9px] font-bold">☪️</span>
            </div>

            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-[10px] text-green-300 font-medium">{story.label}</p>
              <p className="text-white text-[11px] font-bold leading-tight drop-shadow">{story.name}</p>
            </div>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
