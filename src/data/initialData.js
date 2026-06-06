export const demoUsers = [
  {
    id: 1, username: 'shahaly', password: '123456',
    name: 'Shahaly Talukder', avatar: 'https://i.pravatar.cc/150?img=11',
    coverPhoto: 'https://picsum.photos/seed/cover1/900/300',
    bio: '🕌 Muslim · Software Developer · Bangladesh 🇧🇩\nআলহামদুলিল্লাহ, সবকিছুর জন্য শুকরিয়া।',
    location: 'Dhaka, Bangladesh', joinDate: 'January 2022',
    friends: 1, title: 'Muslim · Bangladesh',
    friendIds: [2], sentRequests: [], receivedRequests: [],
  },
  {
    id: 2, username: 'abdullah', password: '123456',
    name: 'Abdullah Al-Faruk', avatar: 'https://i.pravatar.cc/150?img=3',
    coverPhoto: 'https://picsum.photos/seed/cover2/900/300',
    bio: '📖 Quran Teacher · Hafiz · Chittagong\nসুবহানাল্লাহ!', location: 'Chittagong, Bangladesh',
    joinDate: 'March 2021', friends: 1, title: 'Quran Teacher',
    friendIds: [1], sentRequests: [], receivedRequests: [],
  },
  {
    id: 3, username: 'admin', password: 'admin',
    name: 'UmmahBook Admin', avatar: 'https://i.pravatar.cc/150?img=50',
    coverPhoto: 'https://picsum.photos/seed/cover3/900/300',
    bio: '✅ Official UmmahBook Account', location: 'Bangladesh',
    joinDate: 'January 2020', friends: 9999, title: 'Admin',
    friendIds: [], sentRequests: [], receivedRequests: [],
  },
];

export const initialContacts = [
  { id: 1, name: 'Abdullah Al-Faruk', avatar: 'https://i.pravatar.cc/150?img=3', online: true },
  { id: 2, name: 'Fatima Begum', avatar: 'https://i.pravatar.cc/150?img=5', online: true },
  { id: 3, name: 'Umar Farooq', avatar: 'https://i.pravatar.cc/150?img=8', online: false },
  { id: 4, name: 'Ayesha Siddiqua', avatar: 'https://i.pravatar.cc/150?img=9', online: true },
  { id: 5, name: 'Ibrahim Khalil', avatar: 'https://i.pravatar.cc/150?img=12', online: true },
  { id: 6, name: 'Khadija Rahman', avatar: 'https://i.pravatar.cc/150?img=16', online: false },
  { id: 7, name: 'Yusuf Al-Islam', avatar: 'https://i.pravatar.cc/150?img=20', online: true },
  { id: 8, name: 'Maryam Akhter', avatar: 'https://i.pravatar.cc/150?img=25', online: true },
];

export const initialStories = [
  { id: 1, name: 'Abdullah Al-Faruk', avatar: 'https://i.pravatar.cc/150?img=3', bg: 'https://picsum.photos/seed/mosque1/200/350', label: 'Quran Recitation' },
  { id: 2, name: 'Fatima Begum', avatar: 'https://i.pravatar.cc/150?img=5', bg: 'https://picsum.photos/seed/islamic2/200/350', label: 'Islamic Reminder' },
  { id: 3, name: 'Umar Farooq', avatar: 'https://i.pravatar.cc/150?img=8', bg: 'https://picsum.photos/seed/masjid3/200/350', label: 'Hadith of Day' },
  { id: 4, name: 'Ayesha Siddiqua', avatar: 'https://i.pravatar.cc/150?img=9', bg: 'https://picsum.photos/seed/dua4/200/350', label: 'Dua & Dhikr' },
];

export const initialPosts = [
  {
    id: 101,
    user: { id: 2, name: 'Abdullah Al-Faruk', avatar: 'https://i.pravatar.cc/150?img=3' },
    time: '২ ঘন্টা আগে', privacy: 'public', type: 'quran',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    content: '📖 সূরা আত-তালাক (৬৫:২-৩)\n\n"যে আল্লাহকে ভয় করে, আল্লাহ তার জন্য পথ বের করে দেন এবং তাকে এমন উৎস থেকে রিযিক দেন যা সে কল্পনাও করেনি।"\n\nসুবহানাল্লাহ! আল্লাহর উপর ভরসা রাখুন। 🌿',
    image: null, likes: 842, comments: 0, shares: 234,
    reactions: ['❤️', '🤲', '👍'], userReactions: {}, commentsList: [], savedBy: [],
  },
  {
    id: 102,
    user: { id: 3, name: 'Fatima Begum', avatar: 'https://i.pravatar.cc/150?img=5' },
    time: '৪ ঘন্টা আগে', privacy: 'public', type: 'hadith', arabic: null,
    content: '📜 হাদিস শরীফ\n\nরাসূলুল্লাহ ﷺ বলেছেন:\n"তোমাদের মধ্যে সে ব্যক্তি সর্বোত্তম যে কুরআন শেখে এবং অন্যকে শেখায়।"\n\n— সহীহ বুখারী ৫০২৭\n\nআজই কুরআন তেলাওয়াত শুরু করুন। 🤲',
    image: 'https://picsum.photos/seed/quran1/600/350', likes: 1243, comments: 0, shares: 389,
    reactions: ['❤️', '🤲', '😊'], userReactions: {}, commentsList: [], savedBy: [],
  },
  {
    id: 103,
    user: { id: 2, name: 'Umar Farooq', avatar: 'https://i.pravatar.cc/150?img=8' },
    time: '৬ ঘন্টা আগে', privacy: 'public', type: 'reminder',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    content: '🌙 সূরা আল-ইনশিরাহ (৯৪:৬)\n"নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।"\n\nহে মুমিন! কখনো হতাশ হবেন না। প্রতিটি কঠিন সময়ের পরে আল্লাহর রহমতে সহজ সময় আসবেই। আমিন 🤲\n\n#IslamicReminder #Quran',
    image: null, likes: 2156, comments: 0, shares: 567,
    reactions: ['❤️', '🤲', '😢'], userReactions: {}, commentsList: [], savedBy: [],
  },
  {
    id: 104,
    user: { id: 3, name: 'Ayesha Siddiqua', avatar: 'https://i.pravatar.cc/150?img=9' },
    time: '৮ ঘন্টা আগে', privacy: 'friends', type: 'dua',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    content: '🤲 "রাব্বানা আতিনা ফিদ্দুনইয়া হাসানাতাও ওয়াফিল আখিরাতি হাসানাতাও ওয়াকিনা আযাবান্নার"\n\n"হে আমাদের রব! আমাদের দুনিয়াতে কল্যাণ দাও এবং আখিরাতেও কল্যাণ দাও এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করো।"\n\n— সূরা বাকারা: ২০১\n\nআমিন! শেয়ার করুন, সদকায়ে জারিয়া হবে ইনশাআল্লাহ। 💚',
    image: 'https://picsum.photos/seed/mosque5/600/350', likes: 3421, comments: 0, shares: 891,
    reactions: ['❤️', '🤲', '😊'], userReactions: {}, commentsList: [], savedBy: [],
  },
];

export const initialNotifications = [
  { id: 1, avatar: 'https://i.pravatar.cc/150?img=3', text: 'Abdullah Al-Faruk আপনার পোস্টে 🤲 Dua দিয়েছেন', time: '২ মিনিট আগে', read: false, emoji: '🤲' },
  { id: 2, avatar: 'https://i.pravatar.cc/150?img=5', text: 'Fatima Begum মন্তব্য করেছেন: "জাযাকাল্লাহু খায়রান"', time: '১৫ মিনিট আগে', read: false, emoji: '💬' },
  { id: 3, avatar: 'https://i.pravatar.cc/150?img=8', text: 'Umar Farooq আপনাকে "Islamic Scholars BD" গ্রুপে যোগ দেওয়ার আমন্ত্রণ জানিয়েছেন', time: '১ ঘন্টা আগে', read: false, emoji: '👥' },
  { id: 4, avatar: 'https://i.pravatar.cc/150?img=9', text: 'Ayesha Siddiqua আপনার গল্প দেখেছেন', time: '২ ঘন্টা আগে', read: true, emoji: '👁️' },
  { id: 5, avatar: 'https://i.pravatar.cc/150?img=12', text: 'Ibrahim Khalil আপনার পোস্ট শেয়ার করেছেন', time: '৩ ঘন্টা আগে', read: true, emoji: '🔁' },
  { id: 6, avatar: 'https://i.pravatar.cc/150?img=50', text: "🕌 Jumu'ah Reminder: আজ জুমার নামাজের জন্য প্রস্তুত হন।", time: '৫ ঘন্টা আগে', read: true, emoji: '🕌' },
];

export const prayerTimes = [
  { name: 'Fajr', time: '04:32', icon: '🌅' },
  { name: 'Dhuhr', time: '12:05', icon: '☀️' },
  { name: 'Asr', time: '15:42', icon: '🌤️' },
  { name: 'Maghrib', time: '18:21', icon: '🌇' },
  { name: 'Isha', time: '19:47', icon: '🌙' },
];

export const islamicGroups = [
  { id: 1, name: 'বাংলাদেশ ইসলামিক ফোরাম', img: 'https://picsum.photos/seed/isg1/80/80', members: 45200, posts: 1230, joined: false, desc: 'বাংলাদেশের সকল মুসলিমদের জন্য ইসলামিক জ্ঞান ও আলোচনার প্ল্যাটফর্ম।' },
  { id: 2, name: 'Quran Learners BD', img: 'https://picsum.photos/seed/isg2/80/80', members: 28400, posts: 876, joined: true, desc: 'কুরআন শিক্ষা ও তিলাওয়াত অনুশীলনের জন্য।' },
  { id: 3, name: 'Hadith Daily', img: 'https://picsum.photos/seed/isg3/80/80', members: 62100, posts: 3450, joined: false, desc: 'প্রতিদিন সহীহ হাদিস শেয়ার করা হয়।' },
  { id: 4, name: 'Islamic Sisters Network', img: 'https://picsum.photos/seed/isg4/80/80', members: 19800, posts: 567, joined: false, desc: 'মুসলিম বোনদের জন্য একটি বিশেষ গ্রুপ।' },
  { id: 5, name: 'Tafsir & Tafeem', img: 'https://picsum.photos/seed/isg5/80/80', members: 34500, posts: 2100, joined: true, desc: 'কুরআনের তাফসির ও তাফহীম আলোচনা।' },
  { id: 6, name: 'Muslim Youth Bangladesh', img: 'https://picsum.photos/seed/isg6/80/80', members: 88000, posts: 4200, joined: false, desc: 'বাংলাদেশী মুসলিম তরুণদের জন্য।' },
];

export const islamicEvents = [
  { id: 1, title: "জুমার খুতবা লাইভ", location: 'বায়তুল মোকাররম মসজিদ', date: '৬ জুন', time: '১২:৩০ PM', emoji: '🕌', color: 'from-green-600 to-green-800', going: 2340, interested: 5670, type: 'Live' },
  { id: 2, title: 'Quran Tafsir Class', location: 'Online · Zoom', date: '৬ জুন', time: '৮:০০ PM', emoji: '📖', color: 'from-emerald-600 to-teal-800', going: 856, interested: 1234, type: 'Online' },
  { id: 3, title: 'ঈদুল আযহা প্রস্তুতি সভা', location: 'ঢাকা Community Center', date: '৭ জুন', time: '৯:০০ AM', emoji: '🐑', color: 'from-amber-600 to-orange-700', going: 1200, interested: 3400, type: 'In-person' },
  { id: 4, title: 'Islamic Book Fair', location: 'Bashundhara, Dhaka', date: '৮ জুন', time: '১০:০০ AM', emoji: '📚', color: 'from-blue-600 to-indigo-800', going: 4500, interested: 12000, type: 'In-person' },
  { id: 5, title: 'Online Dua Session', location: 'Facebook Live', date: '৯ জুন', time: '৯:০০ PM', emoji: '🤲', color: 'from-teal-600 to-green-800', going: 678, interested: 2100, type: 'Online' },
  { id: 6, title: 'Youth Islamic Quiz', location: 'Dhaka University', date: '১০ জুন', time: '২:০০ PM', emoji: '🏆', color: 'from-yellow-600 to-amber-700', going: 320, interested: 890, type: 'In-person' },
];
