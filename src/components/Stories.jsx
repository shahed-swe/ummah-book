import { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const STORY_DATA = [
  { label_en: 'Quran Recitation', label_bn: 'কুরআন তিলাওয়াত', bg: 'linear-gradient(160deg,#1a5c2a,#2d8a3a)', arabic: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا', emoji: '📖' },
  { label_en: 'Daily Hadith',     label_bn: 'আজকের হাদিস',    bg: 'linear-gradient(160deg,#0a3d5c,#0e6090)', arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', emoji: '📜' },
  { label_en: "Dua & Dhikr",     label_bn: "দু'আ ও যিকর",    bg: 'linear-gradient(160deg,#2d4a0a,#3d7a1a)', arabic: 'ذِكْرُ اللَّهِ', emoji: '🤲' },
  { label_en: 'Islamic Reminder', label_bn: 'ইসলামিক স্মরণ', bg: 'linear-gradient(160deg,#3d1a5c,#6a2d9a)', arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', emoji: '🌙' },
  { label_en: 'SubhanAllah',      label_bn: 'সুবহানআল্লাহ',   bg: 'linear-gradient(160deg,#5c2d0a,#a04c1a)', arabic: 'سُبْحَانَ اللَّهِ', emoji: '✨' },
  { label_en: 'Alhamdulillah',    label_bn: 'আলহামদুলিল্লাহ', bg: 'linear-gradient(160deg,#0a3d2d,#1a7a5c)', arabic: 'الْحَمْدُ لِلَّهِ', emoji: '🌿' },
];

function StoryViewer({ story, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
      onClick={onClose}>
      <div
        className="relative w-full max-w-[360px] mx-4 rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: '70vh', maxHeight: '600px', background: story.bg }}
        onClick={e => e.stopPropagation()}>

        {/* Progress bar */}
        <div className="absolute top-3 left-3 right-3 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-[story-progress_4s_linear_forwards]" style={{ width: '100%' }} />
        </div>

        {/* Header */}
        <div className="absolute top-7 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-white/20 flex items-center justify-center">
              <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white text-[13px] font-bold drop-shadow">{story.name}</p>
              <p className="text-white/70 text-[10px]">{story.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
            <FaTimes className="text-white text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="text-[56px] mb-4">{story.emoji}</span>
          <p className="arabic text-white text-[24px] leading-loose mb-3 drop-shadow-lg">{story.arabic}</p>
          <p className="text-white/80 text-[14px] leading-relaxed">{story.label}</p>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </div>
  );
}

export default function Stories() {
  const { currentUser, allUsers, lang } = useApp();
  const [activeStory, setActiveStory] = useState(null);

  const storyUsers = allUsers
    .filter(u => u.id !== currentUser?.id)
    .slice(0, 6)
    .map((u, i) => {
      const d = STORY_DATA[i % STORY_DATA.length];
      return {
        id: u.id,
        name: u.name.split(' ')[0],
        avatar: u.avatar,
        bg: d.bg,
        label: lang === 'en' ? d.label_en : d.label_bn,
        arabic: d.arabic,
        emoji: d.emoji,
      };
    });

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

        {/* Create Story */}
        <div
          className="relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer shadow-sm group border border-green-200 dark:border-[#1a4a20] bg-white dark:bg-[#0f2313]"
          style={{ width: '108px', height: '185px' }}>
          <div
            className="w-full flex items-center justify-center overflow-hidden"
            style={{ height: '128px', background: 'linear-gradient(160deg,#1a5c2a,#2d7a3a)' }}>
            {currentUser
              ? <img src={currentUser.avatar} alt="me" className="w-full h-full object-cover" />
              : <span className="text-[48px]">☪️</span>}
          </div>
          <div className="flex flex-col items-center justify-end pb-2 pt-5 bg-white dark:bg-[#0f2313]" style={{ height: '57px' }}>
            <div className="absolute bg-green-600 flex items-center justify-center border-4 border-white dark:border-[#0f2313] rounded-full"
              style={{ bottom: '42px', width: '34px', height: '34px' }}>
              <FaPlus className="text-white" style={{ fontSize: '12px' }} />
            </div>
            <span className="text-[11px] font-bold text-green-800 dark:text-green-400 text-center leading-tight">
              {lang === 'en' ? 'Create Story' : 'স্টোরি তৈরি'}
            </span>
          </div>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>

        {/* User Stories */}
        {storyUsers.map(story => (
          <div
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="relative flex-shrink-0 rounded-xl overflow-hidden cursor-pointer shadow-sm group"
            style={{ width: '108px', height: '185px', background: story.bg }}>

            {/* Avatar */}
            <div className="absolute top-3 left-3 rounded-full border-[3px] border-green-400 overflow-hidden"
              style={{ width: '38px', height: '38px' }}>
              <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
            </div>

            {/* Islamic badge */}
            <div className="absolute top-3 right-2 bg-white/20 backdrop-blur-sm rounded-full px-1.5 py-0.5">
              <span className="text-white" style={{ fontSize: '11px' }}>{story.emoji}</span>
            </div>

            {/* Arabic text center */}
            <div className="absolute inset-0 flex items-center justify-center px-2">
              <p className="arabic text-white/90 text-center leading-loose drop-shadow-lg" style={{ fontSize: '14px' }}>
                {story.arabic}
              </p>
            </div>

            {/* Bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2.5 pt-6"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}>
              <p className="text-white/80 text-center leading-tight" style={{ fontSize: '9px' }}>{story.label}</p>
              <p className="text-white font-bold text-center leading-tight drop-shadow" style={{ fontSize: '11px' }}>{story.name}</p>
            </div>

            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 transition-opacity" />
          </div>
        ))}
      </div>

      {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
    </>
  );
}
