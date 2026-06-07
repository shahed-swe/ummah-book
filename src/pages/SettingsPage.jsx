import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaLock, FaEye, FaEyeSlash, FaBell, FaPalette,
  FaUser, FaCheck, FaTimes, FaMoon, FaShieldAlt,
  FaUserEdit, FaGlobe, FaUserFriends, FaHeart,
  FaComment, FaUserPlus, FaNewspaper, FaEnvelope, FaExclamationTriangle,
  FaRss, FaCircle, FaBan, FaLifeRing, FaMobileAlt,
  FaHistory, FaChevronRight, FaSearch, FaSun, FaFont,
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';

// ─── Translations ────────────────────────────────────────────────────────────
const TR = {
  bn: {
    pageTitle: 'সেটিংস ও গোপনীয়তা',
    account: 'অ্যাকাউন্ট', security: 'নিরাপত্তা', privacy: 'গোপনীয়তা',
    notif: 'নোটিফিকেশন', appear: 'থিম', language: 'ভাষা',
    feed: 'ফিড পছন্দ', active: 'সক্রিয় অবস্থা', blocking: 'ব্লক তালিকা', help: 'সাহায্য',
    save: 'পরিবর্তন সংরক্ষণ করুন', cancel: 'বাতিল',
    // account
    accountInfo: 'অ্যাকাউন্ট তথ্য', name: 'নাম', username: 'ইউজারনেম',
    joinDate: 'যোগদানের তারিখ', islamicRole: 'ইসলামিক ভূমিকা', location: 'অবস্থান',
    editProfile: 'প্রোফাইল সম্পাদনা করুন',
    deactivate: 'অ্যাকাউন্ট নিষ্ক্রিয়করণ',
    deactivateDesc: 'আপনার অ্যাকাউন্ট নিষ্ক্রিয় করলে প্রোফাইল ও পোস্ট অন্যদের কাছে দেখা যাবে না। যেকোনো সময় লগইন করলে পুনরায় সক্রিয় হবে।',
    deactivateBtn: 'অ্যাকাউন্ট নিষ্ক্রিয় করুন',
    deactivateConfirm: 'আপনি কি নিশ্চিত?',
    deactivateWarning: 'এই পদক্ষেপটি আপনাকে লগআউট করবে।',
    confirmDeactivate: 'হ্যাঁ, নিষ্ক্রিয় করুন',
    // security
    changePassword: 'পাসওয়ার্ড পরিবর্তন',
    currentPw: 'বর্তমান পাসওয়ার্ড', newPw: 'নতুন পাসওয়ার্ড', confirmPw: 'নিশ্চিত পাসওয়ার্ড',
    currentPwPh: 'আপনার বর্তমান পাসওয়ার্ড লিখুন',
    newPwPh: 'নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)',
    confirmPwPh: 'পাসওয়ার্ড আবার লিখুন',
    pwStrengthLabel: 'পাসওয়ার্ড শক্তি',
    pwMatch: 'পাসওয়ার্ড মিলেছে', pwNoMatch: 'পাসওয়ার্ড মিলছে না',
    pwTipsTitle: '💡 শক্তিশালী পাসওয়ার্ডের টিপস:',
    pwTips: ['কমপক্ষে ৮–১০ অক্ষর ব্যবহার করুন', 'বড় ও ছোট হাতের অক্ষর মিশিয়ে দিন', 'সংখ্যা ও বিশেষ চিহ্ন যোগ করুন (!@#$%)', 'নিজের নাম বা জন্মতারিখ ব্যবহার করবেন না'],
    changePwBtn: 'পাসওয়ার্ড পরিবর্তন করুন',
    twoFactor: 'দুই-ধাপ যাচাইকরণ', twoFactorSub: 'অ্যাকাউন্টকে আরও সুরক্ষিত রাখুন',
    loginActivity: 'লগইন কার্যকলাপ', loginActivitySub: 'সাম্প্রতিক লগইন সেশন দেখুন',
    comingSoon: 'শীঘ্রই আসছে',
    // privacy
    privacyTitle: 'গোপনীয়তা সেটিংস',
    defaultPostAudience: 'ডিফল্ট পোস্ট দর্শক', defaultPostAudienceSub: 'নতুন পোস্টের ডিফল্ট প্রাইভেসি',
    profileVisibility: 'প্রোফাইল দৃশ্যমানতা', profileVisibilitySub: 'কে আপনার প্রোফাইল দেখতে পাবে',
    friendReqWho: 'বন্ধু অনুরোধ', friendReqWhoSub: 'কে বন্ধু অনুরোধ পাঠাতে পারবে',
    friendListWho: 'বন্ধু তালিকা', friendListWhoSub: 'কে বন্ধু তালিকা দেখতে পাবে',
    storyPrivacy: 'গল্পের দর্শক', storyPrivacySub: 'কে আপনার গল্প দেখতে পাবে',
    everyone: '🌍 সবাই', friendsOnly: '👥 বন্ধুরা', onlyMe: '🔒 শুধু আমি', fof: '👥 বন্ধুর বন্ধুরা',
    // notif
    notifTitle: 'নোটিফিকেশন পছন্দ',
    notifLikes: 'লাইক ও রিঅ্যাকশন', notifLikesSub: 'কেউ পোস্টে রিঅ্যাক্ট করলে',
    notifComments: 'মন্তব্য', notifCommentsSub: 'কেউ পোস্টে মন্তব্য করলে',
    notifFriendReqs: 'বন্ধু অনুরোধ', notifFriendReqsSub: 'নতুন বন্ধু অনুরোধ পেলে',
    notifMentions: 'উল্লেখ ও ট্যাগ', notifMentionsSub: 'কেউ ট্যাগ বা উল্লেখ করলে',
    notifPosts: 'বন্ধুদের পোস্ট', notifPostsSub: 'বন্ধুরা নতুন পোস্ট দিলে',
    notifMessages: 'বার্তা ও চ্যাট', notifMessagesSub: 'নতুন বার্তা পেলে',
    emailNotif: 'ইমেইল নোটিফিকেশন', emailNotifSub: 'গুরুত্বপূর্ণ আপডেট ইমেইলে পাবেন',
    // appear
    appearTitle: 'থিম ও ডিসপ্লে',
    darkMode: 'ডার্ক মোড', darkModeOn: '✅ চালু আছে', darkModeOff: '⬜ বন্ধ আছে',
    fontSize: 'ফন্ট সাইজ', fontSmall: 'ছোট', fontNormal: 'স্বাভাবিক', fontLarge: 'বড়',
    compactMode: 'কম্প্যাক্ট মোড', compactModeSub: 'পোস্টগুলো ছোট করে দেখুন',
    // language
    langTitle: 'ভাষা নির্বাচন', langSub: 'আপনার পছন্দের ভাষায় UmmahBook ব্যবহার করুন',
    langBangla: 'বাংলা', langEnglish: 'English',
    langBanglaSub: 'বাংলাদেশ, পশ্চিমবঙ্গ', langEnglishSub: 'United States, United Kingdom',
    langSelected: '✅ নির্বাচিত',
    // feed
    feedTitle: 'ফিড পছন্দ', feedSub: 'আপনি কোন ধরনের পোস্ট দেখতে চান তা বেছে নিন',
    feedQuran: 'কুরআন আয়াত', feedQuranSub: 'কুরআনের আয়াত ও তাফসির',
    feedHadith: 'হাদিস', feedHadithSub: 'সহীহ হাদিস ও ব্যাখ্যা',
    feedDua: 'দুআ ও যিকর', feedDuaSub: 'দৈনন্দিন দুআ ও যিকর',
    feedReminder: 'ইসলামিক রিমাইন্ডার', feedReminderSub: 'অনুপ্রেরণামূলক পোস্ট',
    feedGroup: 'গ্রুপ পোস্ট', feedGroupSub: 'আপনার গ্রুপের পোস্ট',
    feedEvent: 'ইভেন্ট', feedEventSub: 'ইসলামিক ইভেন্ট আপডেট',
    // active
    activeTitle: 'সক্রিয় অবস্থা',
    activeShow: 'অনলাইন দেখান', activeShowSub: 'আপনি অনলাইনে থাকলে বন্ধুরা দেখতে পাবে',
    activeLastSeen: 'শেষ সক্রিয় সময়', activeLastSeenSub: 'কখন অ্যাক্টিভ ছিলেন তা দেখানো হবে',
    activeReadReceipts: 'পঠিত রসিদ', activeReadReceiptsSub: 'বার্তা পড়লে অপর পক্ষ জানতে পারবে',
    // blocking
    blockTitle: 'ব্লক তালিকা', blockSub: 'যাদের ব্লক করেছেন তারা আপনার প্রোফাইল বা পোস্ট দেখতে পারবে না',
    blockSearchPh: 'কাউকে ব্লক করতে নাম লিখুন...',
    blockBtn: 'ব্লক করুন', unblockBtn: 'আনব্লক করুন', noBlocked: 'আপনি কাউকে ব্লক করেননি',
    // help
    helpTitle: 'সাহায্য ও সহায়তা',
    faq: 'সাধারণ প্রশ্নাবলি', faqSub: 'সাধারণ প্রশ্নের উত্তর পান',
    reportProblem: 'সমস্যা রিপোর্ট করুন', reportProblemSub: 'বাগ বা সমস্যা জানান',
    contactUs: 'যোগাযোগ করুন', contactUsSub: 'আমাদের সাথে যোগাযোগ করুন',
    privacyPolicy: 'গোপনীয়তা নীতি', privacyPolicySub: 'আমাদের গোপনীয়তা নীতি পড়ুন',
    terms: 'সেবার শর্তাবলি', termsSub: 'আমাদের সেবার শর্ত পড়ুন',
    about: 'অ্যাপ সম্পর্কে', aboutSub: 'UmmahBook © 2025 · জাযাকাল্লাহু খায়রান',
    // toast
    toastSaved: 'পরিবর্তন সংরক্ষণ হয়েছে! ✅',
    toastPwChanged: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! ✅',
    toastLangChanged: 'ভাষা পরিবর্তন হয়েছে! ✅',
    toastFillAll: 'সব ঘর পূরণ করুন!', toastPwMin6: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে!',
    toastPwNoMatch: 'নিশ্চিত পাসওয়ার্ড মিলছে না!', toastPwSame: 'নতুন পাসওয়ার্ড পুরনোটার মতো হতে পারবে না!',
    pwStrengths: ['', 'দুর্বল', 'মোটামুটি', 'ভালো', 'শক্তিশালী', 'অত্যন্ত শক্তিশালী'],
    toastBlocked: 'ব্লক করা হয়েছে!', toastUnblocked: 'আনব্লক করা হয়েছে!',
  },
  en: {
    pageTitle: 'Settings & Privacy',
    account: 'Account', security: 'Security', privacy: 'Privacy',
    notif: 'Notifications', appear: 'Appearance', language: 'Language',
    feed: 'Feed', active: 'Active Status', blocking: 'Blocking', help: 'Help & Support',
    save: 'Save Changes', cancel: 'Cancel',
    // account
    accountInfo: 'Account Information', name: 'Name', username: 'Username',
    joinDate: 'Joined', islamicRole: 'Islamic Role', location: 'Location',
    editProfile: 'Edit Profile',
    deactivate: 'Deactivate Account',
    deactivateDesc: 'Deactivating your account will hide your profile and posts from others. You can reactivate anytime by logging back in.',
    deactivateBtn: 'Deactivate Account',
    deactivateConfirm: 'Are you sure?',
    deactivateWarning: 'This will log you out and deactivate your account.',
    confirmDeactivate: 'Yes, Deactivate',
    // security
    changePassword: 'Change Password',
    currentPw: 'Current Password', newPw: 'New Password', confirmPw: 'Confirm Password',
    currentPwPh: 'Enter your current password',
    newPwPh: 'New password (min. 6 characters)',
    confirmPwPh: 'Re-enter your new password',
    pwStrengthLabel: 'Password Strength',
    pwMatch: 'Passwords match', pwNoMatch: 'Passwords do not match',
    pwTipsTitle: '💡 Tips for a strong password:',
    pwTips: ['At least 8–10 characters', 'Mix uppercase & lowercase letters', 'Add numbers & special characters (!@#$%)', 'Avoid using your name or birth date'],
    changePwBtn: 'Change Password',
    twoFactor: 'Two-Factor Authentication', twoFactorSub: 'Keep your account extra secure',
    loginActivity: 'Login Activity', loginActivitySub: 'View recent login sessions',
    comingSoon: 'Coming Soon',
    // privacy
    privacyTitle: 'Privacy Settings',
    defaultPostAudience: 'Default Post Audience', defaultPostAudienceSub: 'Default privacy for new posts',
    profileVisibility: 'Profile Visibility', profileVisibilitySub: 'Who can see your profile',
    friendReqWho: 'Friend Requests', friendReqWhoSub: 'Who can send you friend requests',
    friendListWho: 'Friend List', friendListWhoSub: 'Who can see your friend list',
    storyPrivacy: 'Story Audience', storyPrivacySub: 'Who can see your stories',
    everyone: '🌍 Everyone', friendsOnly: '👥 Friends only', onlyMe: '🔒 Only me', fof: '👥 Friends of friends',
    // notif
    notifTitle: 'Notification Preferences',
    notifLikes: 'Likes & Reactions', notifLikesSub: 'When someone reacts to your post',
    notifComments: 'Comments', notifCommentsSub: 'When someone comments on your post',
    notifFriendReqs: 'Friend Requests', notifFriendReqsSub: 'When you receive a friend request',
    notifMentions: 'Mentions & Tags', notifMentionsSub: 'When someone mentions or tags you',
    notifPosts: "Friends' Posts", notifPostsSub: 'When your friends share new posts',
    notifMessages: 'Messages & Chat', notifMessagesSub: 'When you receive new messages',
    emailNotif: 'Email Notifications', emailNotifSub: 'Receive important updates by email',
    // appear
    appearTitle: 'Appearance',
    darkMode: 'Dark Mode', darkModeOn: '✅ Enabled', darkModeOff: '⬜ Disabled',
    fontSize: 'Font Size', fontSmall: 'Small', fontNormal: 'Normal', fontLarge: 'Large',
    compactMode: 'Compact Mode', compactModeSub: 'View posts in a smaller format',
    // language
    langTitle: 'Choose Language', langSub: 'Use UmmahBook in your preferred language',
    langBangla: 'বাংলা (Bangla)', langEnglish: 'English',
    langBanglaSub: 'Bangladesh, West Bengal', langEnglishSub: 'United States, United Kingdom',
    langSelected: '✅ Selected',
    // feed
    feedTitle: 'Feed Preferences', feedSub: 'Choose what type of content you want to see',
    feedQuran: 'Quran Verses', feedQuranSub: 'Quranic verses and tafsir',
    feedHadith: 'Hadith', feedHadithSub: 'Authentic hadith and explanation',
    feedDua: "Du'a & Dhikr", feedDuaSub: "Daily du'a and remembrance",
    feedReminder: 'Islamic Reminders', feedReminderSub: 'Inspirational Islamic posts',
    feedGroup: 'Group Posts', feedGroupSub: 'Posts from your groups',
    feedEvent: 'Events', feedEventSub: 'Islamic event updates',
    // active
    activeTitle: 'Active Status',
    activeShow: 'Show When Online', activeShowSub: 'Friends can see when you are online',
    activeLastSeen: 'Last Active Time', activeLastSeenSub: 'Show when you were last active',
    activeReadReceipts: 'Read Receipts', activeReadReceiptsSub: 'Let others know when you read their messages',
    // blocking
    blockTitle: 'Blocking', blockSub: 'Blocked users cannot see your profile or posts',
    blockSearchPh: 'Search to block someone...',
    blockBtn: 'Block', unblockBtn: 'Unblock', noBlocked: "You haven't blocked anyone",
    // help
    helpTitle: 'Help & Support',
    faq: 'FAQ', faqSub: 'Get answers to common questions',
    reportProblem: 'Report a Problem', reportProblemSub: 'Report bugs or issues',
    contactUs: 'Contact Us', contactUsSub: 'Get in touch with us',
    privacyPolicy: 'Privacy Policy', privacyPolicySub: 'Read our privacy policy',
    terms: 'Terms of Service', termsSub: 'Read our terms of service',
    about: 'About App', aboutSub: 'UmmahBook © 2025 · JazakAllahu Khayran',
    // toast
    toastSaved: 'Changes saved! ✅',
    toastPwChanged: 'Password changed successfully! ✅',
    toastLangChanged: 'Language changed! ✅',
    toastFillAll: 'Please fill all fields!', toastPwMin6: 'New password must be at least 6 characters!',
    toastPwNoMatch: 'Passwords do not match!', toastPwSame: 'New password cannot be the same as old one!',
    pwStrengths: ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'],
    toastBlocked: 'User blocked!', toastUnblocked: 'User unblocked!',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pwStrength(pw, t) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-600'];
  return { score, label: t.pwStrengths[Math.min(score, 5)], color: colors[Math.min(score, 5)] };
}

const iCls =
  'w-full bg-gray-50 dark:bg-[#142d18] border border-gray-200 dark:border-[#1a4a20] rounded-xl ' +
  'px-4 py-2.5 text-[14px] text-gray-900 dark:text-[#e8f5e9] placeholder-gray-400 ' +
  'dark:placeholder-[#4a7a50] focus:outline-none focus:border-green-500 dark:focus:border-[#4ade80] transition-colors';

// ─── Shared UI ────────────────────────────────────────────────────────────────
const Toggle = ({ on, onToggle }) => (
  <button onClick={onToggle}
    className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 flex-shrink-0 ${on ? 'bg-green-600' : 'bg-gray-200 dark:bg-[#1a4a20]'}`}>
    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl p-5 mb-4 shadow-sm ${className}`}>
    {children}
  </div>
);

const SecHeader = ({ icon: Icon, title, sub }) => (
  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-green-100 dark:border-[#1a4a20]">
    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-[#142d18] flex items-center justify-center flex-shrink-0">
      <Icon className="text-green-700 dark:text-[#6abf69] text-[16px]" />
    </div>
    <div>
      <h2 className="font-bold text-[16px] text-gray-900 dark:text-[#e8f5e9]">{title}</h2>
      {sub && <p className="text-[12px] text-gray-500 dark:text-[#4a7a50]">{sub}</p>}
    </div>
  </div>
);

const ToggleRow = ({ icon: Icon, label, sub, on, onToggle }) => (
  <div className="py-3.5 flex items-center justify-between gap-3 border-b border-gray-100 dark:border-[#1a4a20] last:border-0">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-[#142d18] flex items-center justify-center flex-shrink-0">
        <Icon className="text-green-600 dark:text-[#6abf69] text-[13px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-gray-800 dark:text-[#e8f5e9]">{label}</p>
        {sub && <p className="text-[12px] text-gray-500 dark:text-[#4a7a50] truncate">{sub}</p>}
      </div>
    </div>
    <Toggle on={on} onToggle={onToggle} />
  </div>
);

const LinkRow = ({ icon: Icon, label, sub, badge }) => (
  <div className="py-3.5 flex items-center justify-between gap-3 border-b border-gray-100 dark:border-[#1a4a20] last:border-0 cursor-pointer hover:bg-green-50 dark:hover:bg-[#142d18] rounded-xl px-2 -mx-2 transition-colors">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-[#142d18] flex items-center justify-center flex-shrink-0">
        <Icon className="text-green-600 dark:text-[#6abf69] text-[13px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-gray-800 dark:text-[#e8f5e9]">{label}</p>
        {sub && <p className="text-[12px] text-gray-500 dark:text-[#4a7a50]">{sub}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {badge && <span className="text-[11px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">{badge}</span>}
      <FaChevronRight className="text-gray-400 text-[11px]" />
    </div>
  </div>
);

const SaveBtn = ({ onClick, children, loading }) => (
  <button onClick={onClick} disabled={loading}
    className="mt-4 w-full py-3 rounded-xl bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-[15px] transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
    {loading
      ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
      : <><FaCheck className="text-[13px]" /> {children}</>
    }
  </button>
);

// ─── Account ──────────────────────────────────────────────────────────────────
function AccountSection({ t, user, navigate }) {
  const { logout } = useApp();
  const nav = useNavigate();
  const [showDeactivate, setShowDeactivate] = useState(false);

  return (
    <>
      <Card>
        <SecHeader icon={FaUser} title={t.accountInfo} />
        <div className="space-y-0 divide-y divide-gray-50 dark:divide-[#1a4a20]/50">
          {[
            [t.name,        user.name],
            [t.username,    `@${user.username}`],
            [t.joinDate,    user.joinDate || '—'],
            [t.islamicRole, user.islamicRole || '—'],
            [t.location,    user.location   || '—'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-3">
              <span className="text-[13px] text-gray-500 dark:text-[#4a7a50]">{label}</span>
              <span className="text-[14px] font-semibold text-gray-800 dark:text-[#e8f5e9] truncate max-w-[55%] text-right">{value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/profile')}
          className="mt-4 w-full py-2.5 rounded-xl border-2 border-green-600 dark:border-[#1a4a20] text-green-700 dark:text-[#6abf69] font-semibold text-[14px] hover:bg-green-50 dark:hover:bg-[#142d18] transition-colors flex items-center justify-center gap-2">
          <FaUserEdit /> {t.editProfile}
        </button>
      </Card>

      <Card>
        <SecHeader icon={FaExclamationTriangle} title={t.deactivate} />
        <p className="text-[13px] text-gray-500 dark:text-[#4a7a50] mb-4 leading-relaxed">{t.deactivateDesc}</p>
        {!showDeactivate ? (
          <button onClick={() => setShowDeactivate(true)}
            className="w-full py-2.5 rounded-xl bg-red-50 dark:bg-[#2d1414] border border-red-200 dark:border-red-900 text-red-600 font-semibold text-[14px] hover:bg-red-100 dark:hover:bg-[#3d1a1a] transition-colors">
            {t.deactivateBtn}
          </button>
        ) : (
          <div className="bg-red-50 dark:bg-[#2d1414] border border-red-200 dark:border-red-900 rounded-xl p-4">
            <p className="text-[13px] text-red-700 dark:text-red-400 font-bold mb-1 flex items-center gap-2">
              <FaExclamationTriangle /> {t.deactivateConfirm}
            </p>
            <p className="text-[12px] text-red-600 dark:text-red-300 mb-4">{t.deactivateWarning}</p>
            <div className="flex gap-2">
              <button onClick={() => { logout(); nav('/login'); }}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-[13px] hover:bg-red-700 transition-colors">
                {t.confirmDeactivate}
              </button>
              <button onClick={() => setShowDeactivate(false)}
                className="flex-1 py-2 rounded-xl bg-gray-100 dark:bg-[#142d18] text-gray-700 dark:text-[#6abf69] font-bold text-[13px] hover:bg-gray-200 dark:hover:bg-[#1a4a20] transition-colors">
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

// ─── Security ─────────────────────────────────────────────────────────────────
function SecuritySection({ t, showToast }) {
  const { changePassword } = useApp();
  const [cur, setCur] = useState('');
  const [nw,  setNw]  = useState('');
  const [cnf, setCnf] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNw,  setShowNw]  = useState(false);
  const [showCnf, setShowCnf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const str = pwStrength(nw, t);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cur || !nw || !cnf) return showToast(t.toastFillAll, false);
    if (nw.length < 6) return showToast(t.toastPwMin6, false);
    if (nw !== cnf) return showToast(t.toastPwNoMatch, false);
    if (nw === cur) return showToast(t.toastPwSame, false);
    setLoading(true);
    setTimeout(() => {
      const res = changePassword(cur, nw);
      setLoading(false);
      if (res.ok) { showToast(t.toastPwChanged); setCur(''); setNw(''); setCnf(''); }
      else showToast(res.msg, false);
    }, 400);
  };

  const PwField = ({ label, val, setVal, show, setShow, placeholder }) => (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-gray-700 dark:text-[#c8e6c9] mb-1.5">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={val} onChange={e => setVal(e.target.value)}
          placeholder={placeholder} className={`${iCls} pr-11`} />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#4a7a50] hover:text-green-600 dark:hover:text-[#4ade80] transition-colors p-1">
          {show ? <FaEyeSlash className="text-[15px]" /> : <FaEye className="text-[15px]" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <SecHeader icon={FaLock} title={t.changePassword} />
        <form onSubmit={handleSubmit} autoComplete="off">
          <PwField label={t.currentPw} val={cur} setVal={setCur} show={showCur} setShow={setShowCur} placeholder={t.currentPwPh} />
          <PwField label={t.newPw}     val={nw}  setVal={setNw}  show={showNw}  setShow={setShowNw}  placeholder={t.newPwPh} />
          {nw && (
            <div className="mb-4 -mt-2">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= str.score ? str.color : 'bg-gray-200 dark:bg-[#1a4a20]'}`} />
                ))}
              </div>
              <p className={`text-[11px] font-semibold ${str.score <= 1 ? 'text-red-500' : str.score <= 2 ? 'text-yellow-500' : str.score <= 3 ? 'text-blue-500' : 'text-green-500'}`}>
                {str.label && `${t.pwStrengthLabel}: ${str.label}`}
              </p>
            </div>
          )}
          <PwField label={t.confirmPw} val={cnf} setVal={setCnf} show={showCnf} setShow={setShowCnf} placeholder={t.confirmPwPh} />
          {nw && cnf && (
            <p className={`text-[12px] font-semibold -mt-2 mb-4 flex items-center gap-1.5 ${nw === cnf ? 'text-green-600 dark:text-[#4ade80]' : 'text-red-500'}`}>
              {nw === cnf ? <><FaCheck className="text-[11px]" /> {t.pwMatch}</> : <><FaTimes className="text-[11px]" /> {t.pwNoMatch}</>}
            </p>
          )}
          <div className="bg-green-50 dark:bg-[#142d18] rounded-xl p-3.5 mb-5">
            <p className="text-[12px] font-bold text-green-700 dark:text-[#6abf69] mb-2">{t.pwTipsTitle}</p>
            <ul className="space-y-1 text-[12px] text-green-600 dark:text-[#4a7a50] list-disc list-inside">
              {t.pwTips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-[15px] transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><FaLock className="text-[13px]" /> {t.changePwBtn}</>
            }
          </button>
        </form>
      </Card>

      <Card>
        <SecHeader icon={FaMobileAlt} title={t.twoFactor} sub={t.twoFactorSub} />
        <ToggleRow icon={FaMobileAlt} label={t.twoFactor} sub={t.twoFactorSub} on={twoFA} onToggle={() => setTwoFA(v => !v)} />
        <LinkRow icon={FaHistory} label={t.loginActivity} sub={t.loginActivitySub} badge={t.comingSoon} />
      </Card>
    </>
  );
}

// ─── Privacy ──────────────────────────────────────────────────────────────────
function PrivacySection({ t, showToast }) {
  const { currentUser, updateProfile } = useApp();
  const priv = currentUser?.privacySettings || {};
  const [defaultPost,   setDefaultPost]   = useState(priv.defaultPostPrivacy      || 'public');
  const [whoProfile,    setWhoProfile]    = useState(priv.whoCanSeeProfile        || 'public');
  const [whoFriendReq,  setWhoFriendReq]  = useState(priv.whoCanSendFriendRequest || 'everyone');
  const [whoFriendList, setWhoFriendList] = useState(priv.whoCanSeeFriendList     || 'friends');
  const [whoStory,      setWhoStory]      = useState(priv.whoCanSeeStory          || 'public');

  const save = () => {
    updateProfile({ privacySettings: { defaultPostPrivacy: defaultPost, whoCanSeeProfile: whoProfile, whoCanSendFriendRequest: whoFriendReq, whoCanSeeFriendList: whoFriendList, whoCanSeeStory: whoStory } });
    showToast(t.toastSaved);
  };

  const SelRow = ({ icon: Icon, label, sub, val, setVal, options }) => (
    <div className="py-3.5 border-b border-gray-100 dark:border-[#1a4a20] last:border-0">
      <div className="flex items-start gap-3 mb-2.5">
        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-[#142d18] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="text-green-600 dark:text-[#6abf69] text-[13px]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-800 dark:text-[#e8f5e9]">{label}</p>
          <p className="text-[12px] text-gray-500 dark:text-[#4a7a50]">{sub}</p>
        </div>
      </div>
      <div className="relative ml-11">
        <select value={val} onChange={e => setVal(e.target.value)}
          className={`${iCls} pr-8 cursor-pointer`}
          style={{ appearance: 'none', WebkitAppearance: 'none' }}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );

  return (
    <Card>
      <SecHeader icon={FaShieldAlt} title={t.privacyTitle} />
      <SelRow icon={FaNewspaper} label={t.defaultPostAudience} sub={t.defaultPostAudienceSub} val={defaultPost} setVal={setDefaultPost}
        options={[{ value: 'public', label: t.everyone }, { value: 'friends', label: t.friendsOnly }]} />
      <SelRow icon={FaGlobe} label={t.profileVisibility} sub={t.profileVisibilitySub} val={whoProfile} setVal={setWhoProfile}
        options={[{ value: 'public', label: t.everyone }, { value: 'friends', label: t.friendsOnly }]} />
      <SelRow icon={FaUserPlus} label={t.friendReqWho} sub={t.friendReqWhoSub} val={whoFriendReq} setVal={setWhoFriendReq}
        options={[{ value: 'everyone', label: t.everyone }, { value: 'fof', label: t.fof }]} />
      <SelRow icon={FaUserFriends} label={t.friendListWho} sub={t.friendListWhoSub} val={whoFriendList} setVal={setWhoFriendList}
        options={[{ value: 'public', label: t.everyone }, { value: 'friends', label: t.friendsOnly }, { value: 'only_me', label: t.onlyMe }]} />
      <SelRow icon={FaCircle} label={t.storyPrivacy} sub={t.storyPrivacySub} val={whoStory} setVal={setWhoStory}
        options={[{ value: 'public', label: t.everyone }, { value: 'friends', label: t.friendsOnly }, { value: 'only_me', label: t.onlyMe }]} />
      <SaveBtn onClick={save}>{t.save}</SaveBtn>
    </Card>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function NotifSection({ t, showToast }) {
  const { currentUser, updateProfile } = useApp();
  const ns = currentUser?.notifSettings || {};
  const [s, setS] = useState({
    likes:      ns.likes      ?? true,
    comments:   ns.comments   ?? true,
    friendReqs: ns.friendReqs ?? true,
    mentions:   ns.mentions   ?? true,
    posts:      ns.posts      ?? false,
    messages:   ns.messages   ?? true,
    email:      ns.email      ?? false,
  });
  const toggle = (key) => setS(prev => ({ ...prev, [key]: !prev[key] }));
  const save = () => { updateProfile({ notifSettings: s }); showToast(t.toastSaved); };

  const rows = [
    { key: 'likes',      Icon: FaHeart,      label: t.notifLikes,      sub: t.notifLikesSub },
    { key: 'comments',   Icon: FaComment,    label: t.notifComments,   sub: t.notifCommentsSub },
    { key: 'friendReqs', Icon: FaUserPlus,   label: t.notifFriendReqs, sub: t.notifFriendReqsSub },
    { key: 'mentions',   Icon: FaEnvelope,   label: t.notifMentions,   sub: t.notifMentionsSub },
    { key: 'posts',      Icon: FaNewspaper,  label: t.notifPosts,      sub: t.notifPostsSub },
    { key: 'messages',   Icon: FaBell,       label: t.notifMessages,   sub: t.notifMessagesSub },
    { key: 'email',      Icon: FaEnvelope,   label: t.emailNotif,      sub: t.emailNotifSub },
  ];

  return (
    <Card>
      <SecHeader icon={FaBell} title={t.notifTitle} />
      <div className="divide-y divide-gray-100 dark:divide-[#1a4a20]">
        {rows.map(({ key, Icon, label, sub }) => (
          <ToggleRow key={key} icon={Icon} label={label} sub={sub} on={s[key]} onToggle={() => toggle(key)} />
        ))}
      </div>
      <SaveBtn onClick={save}>{t.save}</SaveBtn>
    </Card>
  );
}

// ─── Appearance ───────────────────────────────────────────────────────────────
function AppearSection({ t, darkMode, setDarkMode, showToast }) {
  const { currentUser, updateProfile } = useApp();
  const ap = currentUser?.appearSettings || {};
  const [fontSize, setFontSize] = useState(ap.fontSize || 'normal');
  const [compact,  setCompact]  = useState(ap.compact  ?? false);

  const save = () => { updateProfile({ appearSettings: { fontSize, compact } }); showToast(t.toastSaved); };

  return (
    <>
      <Card>
        <SecHeader icon={FaPalette} title={t.appearTitle} />
        {/* Dark mode */}
        <ToggleRow icon={FaMoon} label={t.darkMode}
          sub={darkMode ? t.darkModeOn : t.darkModeOff}
          on={darkMode} onToggle={() => setDarkMode(!darkMode)} />
        {/* Compact */}
        <ToggleRow icon={FaRss} label={t.compactMode} sub={t.compactModeSub} on={compact} onToggle={() => setCompact(v => !v)} />

        {/* Preview cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl overflow-hidden border border-[#1a4a20]">
            <div className="bg-[#0a1a0d] px-3 pt-3 pb-1">
              <p className="text-[11px] text-green-400 font-bold mb-2">🌙 Dark</p>
            </div>
            <div className="bg-[#0f2313] p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-700 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-[#e8f5e9]/30 rounded" />
                  <div className="h-1.5 w-10 bg-[#4a7a50]/50 rounded" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-[#c8e6c9]/15 rounded" />
                <div className="h-1.5 w-4/5 bg-[#c8e6c9]/15 rounded" />
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-green-200">
            <div className="bg-green-50 px-3 pt-3 pb-1">
              <p className="text-[11px] text-green-800 font-bold mb-2">☀️ Light</p>
            </div>
            <div className="bg-white p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-600 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-gray-700/40 rounded" />
                  <div className="h-1.5 w-10 bg-gray-400/50 rounded" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-gray-200 rounded" />
                <div className="h-1.5 w-4/5 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SecHeader icon={FaFont} title={t.fontSize} />
        <div className="flex gap-2">
          {[['small', t.fontSmall, 'text-[12px]'], ['normal', t.fontNormal, 'text-[14px]'], ['large', t.fontLarge, 'text-[17px]']].map(([val, label, cls]) => (
            <button key={val} onClick={() => setFontSize(val)}
              className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${fontSize === val ? 'border-green-600 bg-green-50 dark:bg-[#142d18] text-green-700 dark:text-[#4ade80]' : 'border-gray-200 dark:border-[#1a4a20] text-gray-500 dark:text-[#4a7a50] hover:border-green-300'}`}>
              <span className={cls}>{label}</span>
            </button>
          ))}
        </div>
        <SaveBtn onClick={save}>{t.save}</SaveBtn>
      </Card>
    </>
  );
}

// ─── Language ─────────────────────────────────────────────────────────────────
function LanguageSection({ t, lang, setLang, showToast }) {
  const [selected, setSelected] = useState(lang);

  const save = () => {
    setLang(selected);
    showToast(t.toastLangChanged);
  };

  const LangCard = ({ value, title, sub, flag }) => (
    <button onClick={() => setSelected(value)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
        selected === value
          ? 'border-green-600 bg-green-50 dark:bg-[#142d18]'
          : 'border-gray-200 dark:border-[#1a4a20] hover:border-green-300 dark:hover:border-green-700'
      }`}>
      <span className="text-[36px]">{flag}</span>
      <div className="flex-1">
        <p className={`font-bold text-[16px] ${selected === value ? 'text-green-700 dark:text-[#4ade80]' : 'text-gray-800 dark:text-[#e8f5e9]'}`}>{title}</p>
        <p className="text-[12px] text-gray-500 dark:text-[#4a7a50] mt-0.5">{sub}</p>
      </div>
      {selected === value && (
        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
          <FaCheck className="text-white text-[10px]" />
        </div>
      )}
    </button>
  );

  return (
    <Card>
      <SecHeader icon={FaGlobe} title={t.langTitle} sub={t.langSub} />
      <div className="space-y-3 mb-2">
        <LangCard value="bn" title={t.langBangla} sub={t.langBanglaSub} flag="🇧🇩" />
        <LangCard value="en" title={t.langEnglish} sub={t.langEnglishSub} flag="🇬🇧" />
      </div>
      <SaveBtn onClick={save}>{t.save}</SaveBtn>
    </Card>
  );
}

// ─── Feed Preferences ─────────────────────────────────────────────────────────
function FeedSection({ t, showToast }) {
  const { currentUser, updateProfile } = useApp();
  const fp = currentUser?.feedPrefs || {};
  const [s, setS] = useState({
    quran:    fp.quran    ?? true,
    hadith:   fp.hadith   ?? true,
    dua:      fp.dua      ?? true,
    reminder: fp.reminder ?? true,
    group:    fp.group    ?? true,
    event:    fp.event    ?? true,
  });
  const toggle = (key) => setS(prev => ({ ...prev, [key]: !prev[key] }));
  const save = () => { updateProfile({ feedPrefs: s }); showToast(t.toastSaved); };

  const rows = [
    { key: 'quran',    Icon: FaGlobe,      label: t.feedQuran,    sub: t.feedQuranSub,    emoji: '📖' },
    { key: 'hadith',   Icon: FaNewspaper,  label: t.feedHadith,   sub: t.feedHadithSub,   emoji: '📜' },
    { key: 'dua',      Icon: FaHeart,      label: t.feedDua,      sub: t.feedDuaSub,      emoji: '🤲' },
    { key: 'reminder', Icon: FaBell,       label: t.feedReminder, sub: t.feedReminderSub, emoji: '🌙' },
    { key: 'group',    Icon: FaUserFriends,label: t.feedGroup,    sub: t.feedGroupSub,    emoji: '👥' },
    { key: 'event',    Icon: FaBell,       label: t.feedEvent,    sub: t.feedEventSub,    emoji: '🕌' },
  ];

  return (
    <Card>
      <SecHeader icon={FaRss} title={t.feedTitle} sub={t.feedSub} />
      <div className="divide-y divide-gray-100 dark:divide-[#1a4a20]">
        {rows.map(({ key, Icon, label, sub, emoji }) => (
          <div key={key} className="py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-[#142d18] flex items-center justify-center flex-shrink-0 text-[16px]">
                {emoji}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-gray-800 dark:text-[#e8f5e9]">{label}</p>
                <p className="text-[12px] text-gray-500 dark:text-[#4a7a50] truncate">{sub}</p>
              </div>
            </div>
            <Toggle on={s[key]} onToggle={() => toggle(key)} />
          </div>
        ))}
      </div>
      <SaveBtn onClick={save}>{t.save}</SaveBtn>
    </Card>
  );
}

// ─── Active Status ────────────────────────────────────────────────────────────
function ActiveSection({ t, showToast }) {
  const { currentUser, updateProfile } = useApp();
  const as = currentUser?.activeStatus || {};
  const [s, setS] = useState({
    showOnline:   as.showOnline   ?? true,
    showLastSeen: as.showLastSeen ?? true,
    readReceipts: as.readReceipts ?? true,
  });
  const toggle = (key) => setS(prev => ({ ...prev, [key]: !prev[key] }));
  const save = () => { updateProfile({ activeStatus: s }); showToast(t.toastSaved); };

  return (
    <Card>
      <SecHeader icon={FaCircle} title={t.activeTitle} />
      <ToggleRow icon={FaCircle}   label={t.activeShow}         sub={t.activeShowSub}         on={s.showOnline}   onToggle={() => toggle('showOnline')} />
      <ToggleRow icon={FaHistory}  label={t.activeLastSeen}     sub={t.activeLastSeenSub}     on={s.showLastSeen} onToggle={() => toggle('showLastSeen')} />
      <ToggleRow icon={FaCheck}    label={t.activeReadReceipts} sub={t.activeReadReceiptsSub} on={s.readReceipts} onToggle={() => toggle('readReceipts')} />
      <SaveBtn onClick={save}>{t.save}</SaveBtn>
    </Card>
  );
}

// ─── Blocking ─────────────────────────────────────────────────────────────────
function BlockingSection({ t, showToast }) {
  const { currentUser, updateProfile, allUsers } = useApp();
  const [query, setQuery] = useState('');
  const blockedIds = currentUser?.blockedIds || [];

  const block = (userId) => {
    if (blockedIds.includes(userId)) return;
    updateProfile({ blockedIds: [...blockedIds, userId] });
    showToast(t.toastBlocked);
    setQuery('');
  };
  const unblock = (userId) => {
    updateProfile({ blockedIds: blockedIds.filter(id => id !== userId) });
    showToast(t.toastUnblocked);
  };

  const blockedUsers = allUsers.filter(u => blockedIds.includes(u.id));
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return allUsers.filter(u =>
      u.id !== currentUser?.id &&
      !blockedIds.includes(u.id) &&
      (u.name.toLowerCase().includes(query.toLowerCase()) ||
       u.username.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5);
  }, [query, allUsers, blockedIds, currentUser]);

  return (
    <Card>
      <SecHeader icon={FaBan} title={t.blockTitle} sub={t.blockSub} />
      {/* Search to block */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder={t.blockSearchPh}
          className={`${iCls} pl-9`} />
      </div>
      {searchResults.length > 0 && (
        <div className="mb-4 border border-green-100 dark:border-[#1a4a20] rounded-xl overflow-hidden">
          {searchResults.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 dark:hover:bg-[#142d18] border-b border-gray-100 dark:border-[#1a4a20] last:border-0">
              <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px] text-gray-800 dark:text-[#e8f5e9] truncate">{u.name}</p>
                <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">@{u.username}</p>
              </div>
              <button onClick={() => block(u.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[12px] font-semibold hover:bg-red-200 transition-colors">
                {t.blockBtn}
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Blocked list */}
      {blockedUsers.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#142d18] flex items-center justify-center mx-auto mb-3">
            <FaBan className="text-gray-400 text-[24px]" />
          </div>
          <p className="text-[14px] text-gray-500 dark:text-[#4a7a50]">{t.noBlocked}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blockedUsers.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-[#142d18] rounded-xl">
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 opacity-60" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px] text-gray-700 dark:text-[#c8e6c9] truncate">{u.name}</p>
                <p className="text-[11px] text-gray-500 dark:text-[#4a7a50]">@{u.username}</p>
              </div>
              <button onClick={() => unblock(u.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-[#1a4a20] text-green-700 dark:text-[#6abf69] text-[12px] font-semibold hover:bg-green-200 transition-colors">
                {t.unblockBtn}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── Help & Support ───────────────────────────────────────────────────────────
function HelpSection({ t }) {
  const rows = [
    { icon: FaLifeRing,          label: t.faq,           sub: t.faqSub },
    { icon: FaExclamationTriangle, label: t.reportProblem, sub: t.reportProblemSub },
    { icon: FaEnvelope,          label: t.contactUs,     sub: t.contactUsSub },
    { icon: FaShieldAlt,         label: t.privacyPolicy, sub: t.privacyPolicySub },
    { icon: FaGlobe,             label: t.terms,         sub: t.termsSub },
  ];
  return (
    <>
      <Card>
        <SecHeader icon={FaLifeRing} title={t.helpTitle} />
        {rows.map(({ icon, label, sub }) => (
          <LinkRow key={label} icon={icon} label={label} sub={sub} />
        ))}
      </Card>
      <Card>
        <div className="text-center py-4">
          <p className="text-[28px] mb-2">☪️</p>
          <p className="font-bold text-[16px] text-green-700 dark:text-[#6abf69]">UmmahBook</p>
          <p className="text-[12px] text-gray-500 dark:text-[#4a7a50] mt-1">{t.aboutSub}</p>
          <p className="text-[12px] text-green-500 mt-2 arabic">وَاللَّهُ يَهْدِي مَنْ يَشَاءُ</p>
        </div>
      </Card>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { currentUser, darkMode, setDarkMode, lang, setLang } = useApp();
  const navigate = useNavigate();
  const [tab,   setTab]   = useState('account');
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  if (!currentUser) return null;

  const t = TR[lang] || TR.bn;

  const tabs = [
    { key: 'account',  label: t.account,   Icon: FaUser },
    { key: 'security', label: t.security,  Icon: FaLock },
    { key: 'privacy',  label: t.privacy,   Icon: FaShieldAlt },
    { key: 'notif',    label: t.notif,     Icon: FaBell },
    { key: 'appear',   label: t.appear,    Icon: FaPalette },
    { key: 'language', label: t.language,  Icon: FaGlobe },
    { key: 'feed',     label: t.feed,      Icon: FaRss },
    { key: 'active',   label: t.active,    Icon: FaCircle },
    { key: 'blocking', label: t.blocking,  Icon: FaBan },
    { key: 'help',     label: t.help,      Icon: FaLifeRing },
  ];

  const NavBtn = ({ k, label, Icon }) => (
    <button onClick={() => setTab(k)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all mb-0.5 text-left ${
        tab === k
          ? 'bg-green-700 text-white shadow-sm'
          : 'text-gray-700 dark:text-[#c8e6c9] hover:bg-green-50 dark:hover:bg-[#142d18]'
      }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tab === k ? 'bg-white/20' : 'bg-green-100 dark:bg-[#1a4a20]'}`}>
        <Icon className={`text-[13px] ${tab === k ? 'text-white' : 'text-green-700 dark:text-[#6abf69]'}`} />
      </div>
      {label}
    </button>
  );

  const TabBtn = ({ k, label, Icon }) => (
    <button onClick={() => setTab(k)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
        tab === k
          ? 'bg-green-700 text-white shadow-sm'
          : 'bg-white dark:bg-[#0f2313] text-gray-600 dark:text-[#4a7a50] border border-green-100 dark:border-[#1a4a20] hover:bg-green-50 dark:hover:bg-[#142d18]'
      }`}>
      <Icon className="text-[11px]" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-[72px] left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl shadow-2xl text-white text-[14px] font-semibold flex items-center gap-2 fade-in ${toast.ok ? 'bg-green-700' : 'bg-red-600'}`}>
          {toast.ok ? <FaCheck className="text-[12px]" /> : <FaTimes className="text-[12px]" />}
          {toast.msg}
        </div>
      )}

      <div className="flex gap-4 items-start">

        {/* ── Desktop Left Sidebar ── */}
        <div className="hidden md:block w-[260px] flex-shrink-0 sticky top-[72px]">
          {/* Header inside sidebar */}
          <div className="flex items-center gap-3 mb-3 px-1">
            <button onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-green-100 dark:bg-[#142d18] hover:bg-green-200 dark:hover:bg-[#1a4a20] flex items-center justify-center transition-colors flex-shrink-0">
              <FaArrowLeft className="text-green-700 dark:text-[#6abf69] text-sm" />
            </button>
            <div>
              <h1 className="text-[17px] font-bold text-gray-900 dark:text-[#e8f5e9] leading-tight">{t.pageTitle}</h1>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0f2313] border border-green-100 dark:border-[#1a4a20] rounded-2xl shadow-sm p-2">
            {tabs.map(({ key, label, Icon }) => <NavBtn key={key} k={key} label={label} Icon={Icon} />)}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-green-100 dark:bg-[#142d18] hover:bg-green-200 dark:hover:bg-[#1a4a20] flex items-center justify-center transition-colors flex-shrink-0">
              <FaArrowLeft className="text-green-700 dark:text-[#6abf69] text-sm" />
            </button>
            <h1 className="text-[18px] font-bold text-gray-900 dark:text-[#e8f5e9]">{t.pageTitle}</h1>
          </div>

          {/* Mobile Tab Row */}
          <div className="md:hidden flex gap-1.5 overflow-x-auto pb-1 mb-4">
            {tabs.map(({ key, label, Icon }) => <TabBtn key={key} k={key} label={label} Icon={Icon} />)}
          </div>

          {/* Sections */}
          {tab === 'account'  && <AccountSection  t={t} user={currentUser} navigate={navigate} />}
          {tab === 'security' && <SecuritySection t={t} showToast={showToast} />}
          {tab === 'privacy'  && <PrivacySection  t={t} showToast={showToast} />}
          {tab === 'notif'    && <NotifSection    t={t} showToast={showToast} />}
          {tab === 'appear'   && <AppearSection   t={t} darkMode={darkMode} setDarkMode={setDarkMode} showToast={showToast} />}
          {tab === 'language' && <LanguageSection t={t} lang={lang} setLang={setLang} showToast={showToast} />}
          {tab === 'feed'     && <FeedSection     t={t} showToast={showToast} />}
          {tab === 'active'   && <ActiveSection   t={t} showToast={showToast} />}
          {tab === 'blocking' && <BlockingSection t={t} showToast={showToast} />}
          {tab === 'help'     && <HelpSection     t={t} />}
        </div>
      </div>
    </div>
  );
}
