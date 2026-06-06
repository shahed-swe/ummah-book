export const currentUser = {
  name: 'Shahaly Talukder',
  avatar: 'https://i.pravatar.cc/150?img=11',
  title: 'Muslim · Bangladesh',
};

export const stories = [
  { id: 1, name: 'Abdullah Al-Faruk', avatar: 'https://i.pravatar.cc/150?img=3', bg: 'https://picsum.photos/seed/mosque1/200/350', label: 'Quran Recitation' },
  { id: 2, name: 'Fatima Begum', avatar: 'https://i.pravatar.cc/150?img=5', bg: 'https://picsum.photos/seed/islamic2/200/350', label: 'Islamic Reminder' },
  { id: 3, name: 'Umar Farooq', avatar: 'https://i.pravatar.cc/150?img=8', bg: 'https://picsum.photos/seed/masjid3/200/350', label: 'Hadith of Day' },
  { id: 4, name: 'Ayesha Siddiqua', avatar: 'https://i.pravatar.cc/150?img=9', bg: 'https://picsum.photos/seed/dua4/200/350', label: "Dua & Dhikr" },
];

export const posts = [
  {
    id: 1,
    user: { name: 'Abdullah Al-Faruk', avatar: 'https://i.pravatar.cc/150?img=3' },
    time: '২ ঘন্টা আগে',
    privacy: 'public',
    type: 'quran',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    content: '📖 সূরা আত-তালাক (৬৫:২-৩)\n\n"যে আল্লাহকে ভয় করে, আল্লাহ তার জন্য পথ বের করে দেন এবং তাকে এমন উৎস থেকে রিযিক দেন যা সে কল্পনাও করেনি।"\n\nসুবহানাল্লাহ! আল্লাহর উপর ভরসা রাখুন। 🌿',
    image: null,
    likes: 842,
    comments: 97,
    shares: 234,
    reactions: ['❤️', '🤲', '👍'],
  },
  {
    id: 2,
    user: { name: 'Fatima Begum', avatar: 'https://i.pravatar.cc/150?img=5' },
    time: '৪ ঘন্টা আগে',
    privacy: 'public',
    type: 'hadith',
    arabic: null,
    content: '📜 হাদিস শরীফ\n\nরাসূলুল্লাহ ﷺ বলেছেন:\n"তোমাদের মধ্যে সে ব্যক্তি সর্বোত্তম যে কুরআন শেখে এবং অন্যকে শেখায়।"\n\n— সহীহ বুখারী ৫০২৭\n\nআজই কুরআন তেলাওয়াত শুরু করুন। আল্লাহ আমাদের সবাইকে কুরআনের আলো দান করুন। 🤲',
    image: 'https://picsum.photos/seed/quran1/600/350',
    likes: 1243,
    comments: 156,
    shares: 389,
    reactions: ['❤️', '🤲', '😊'],
  },
  {
    id: 3,
    user: { name: 'Umar Farooq', avatar: 'https://i.pravatar.cc/150?img=8' },
    time: '৬ ঘন্টা আগে',
    privacy: 'public',
    type: 'reminder',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    content: '🌙 আজকের স্মরণীয় আয়াত\n\nসূরা আল-ইনশিরাহ (৯৪:৬)\n"নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।"\n\nহে মুমিন! কখনো হতাশ হবেন না। প্রতিটি কঠিন সময়ের পরে আল্লাহর রহমতে সহজ সময় আসবেই। আল্লাহর উপর পূর্ণ ভরসা রাখুন। আমিন 🤲\n\n#IslamicReminder #Quran #Alhamdulillah',
    image: null,
    likes: 2156,
    comments: 203,
    shares: 567,
    reactions: ['❤️', '🤲', '😢'],
  },
  {
    id: 4,
    user: { name: 'Ayesha Siddiqua', avatar: 'https://i.pravatar.cc/150?img=9' },
    time: '৮ ঘন্টা আগে',
    privacy: 'friends',
    type: 'dua',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    content: '🤲 আজকের দোয়া\n\n"রাব্বানা আতিনা ফিদ্দুনইয়া হাসানাতাও ওয়াফিল আখিরাতি হাসানাতাও ওয়াকিনা আযাবান্নার"\n\n"হে আমাদের রব! আমাদের দুনিয়াতে কল্যাণ দাও এবং আখিরাতেও কল্যাণ দাও এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করো।"\n\n— সূরা বাকারা: ২০১\n\nআমিন! শেয়ার করুন, সদকায়ে জারিয়া হবে ইনশাআল্লাহ। 💚',
    image: 'https://picsum.photos/seed/mosque5/600/350',
    likes: 3421,
    comments: 412,
    shares: 891,
    reactions: ['❤️', '🤲', '😊'],
  },
];

export const contacts = [
  { id: 1, name: 'Abdullah Al-Faruk', avatar: 'https://i.pravatar.cc/150?img=3', online: true },
  { id: 2, name: 'Fatima Begum', avatar: 'https://i.pravatar.cc/150?img=5', online: true },
  { id: 3, name: 'Umar Farooq', avatar: 'https://i.pravatar.cc/150?img=8', online: false },
  { id: 4, name: 'Ayesha Siddiqua', avatar: 'https://i.pravatar.cc/150?img=9', online: true },
  { id: 5, name: 'Ibrahim Khalil', avatar: 'https://i.pravatar.cc/150?img=12', online: true },
  { id: 6, name: 'Khadija Rahman', avatar: 'https://i.pravatar.cc/150?img=16', online: false },
  { id: 7, name: 'Yusuf Al-Islam', avatar: 'https://i.pravatar.cc/150?img=20', online: true },
  { id: 8, name: 'Maryam Akhter', avatar: 'https://i.pravatar.cc/150?img=25', online: true },
];

export const prayerTimes = [
  { name: 'Fajr', time: '04:32', icon: '🌅' },
  { name: 'Dhuhr', time: '12:05', icon: '☀️' },
  { name: 'Asr', time: '15:42', icon: '🌤️' },
  { name: 'Maghrib', time: '18:21', icon: '🌇' },
  { name: 'Isha', time: '19:47', icon: '🌙' },
];
