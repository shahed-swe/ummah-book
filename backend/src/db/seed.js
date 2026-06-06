require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./index');

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Check if already seeded
    const existing = await db.query('SELECT COUNT(*) FROM users');
    if (parseInt(existing.rows[0].count) > 0) {
      console.log('✅ Database already seeded. Skipping.');
      process.exit(0);
    }

    const hash123456 = await bcrypt.hash('123456', 10);
    const hashAdmin = await bcrypt.hash('admin', 10);

    // Seed users
    const user1 = await db.query(`
      INSERT INTO users (username, password_hash, name, avatar, cover_photo, bio, location, join_date, title, friends_count)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      ['shahaly', hash123456, 'Shahaly Talukder',
        'https://i.pravatar.cc/150?img=11',
        'https://picsum.photos/seed/cover1/900/300',
        '🕌 Muslim · Software Developer · Bangladesh 🇧🇩\nআলহামদুলিল্লাহ, সবকিছুর জন্য শুকরিয়া।',
        'Dhaka, Bangladesh', 'January 2022', 'Muslim · Bangladesh', 1]
    );

    const user2 = await db.query(`
      INSERT INTO users (username, password_hash, name, avatar, cover_photo, bio, location, join_date, title, friends_count)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      ['abdullah', hash123456, 'Abdullah Al-Faruk',
        'https://i.pravatar.cc/150?img=3',
        'https://picsum.photos/seed/cover2/900/300',
        '📖 Quran Teacher · Hafiz · Chittagong\nসুবহানাল্লাহ!',
        'Chittagong, Bangladesh', 'March 2021', 'Quran Teacher', 1]
    );

    const user3 = await db.query(`
      INSERT INTO users (username, password_hash, name, avatar, cover_photo, bio, location, join_date, title, friends_count)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      ['admin', hashAdmin, 'UmmahBook Admin',
        'https://i.pravatar.cc/150?img=50',
        'https://picsum.photos/seed/cover3/900/300',
        '✅ Official UmmahBook Account',
        'Bangladesh', 'January 2020', 'Admin', 0]
    );

    const uid1 = user1.rows[0].id;
    const uid2 = user2.rows[0].id;
    const uid3 = user3.rows[0].id;

    // Seed friendship (shahaly ↔ abdullah)
    await db.query(
      `INSERT INTO friendships (from_user_id, to_user_id, status) VALUES ($1,$2,'accepted')`,
      [uid1, uid2]
    );

    // Seed demo posts
    await db.query(`
      INSERT INTO posts (user_id, content, arabic, type, privacy, likes_count, comments_count, shares_count, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW() - INTERVAL '2 hours')`,
      [uid2,
        '📖 সূরা আত-তালাক (৬৫:২-৩)\n\n"যে আল্লাহকে ভয় করে, আল্লাহ তার জন্য পথ বের করে দেন এবং তাকে এমন উৎস থেকে রিযিক দেন যা সে কল্পনাও করেনি।"\n\nসুবহানাল্লাহ! আল্লাহর উপর ভরসা রাখুন। 🌿',
        'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
        'quran', 'public', 842, 0, 234]
    );

    await db.query(`
      INSERT INTO posts (user_id, content, arabic, image, type, privacy, likes_count, comments_count, shares_count, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW() - INTERVAL '4 hours')`,
      [uid3,
        '📜 হাদিস শরীফ\n\nরাসূলুল্লাহ ﷺ বলেছেন:\n"তোমাদের মধ্যে সে ব্যক্তি সর্বোত্তম যে কুরআন শেখে এবং অন্যকে শেখায়।"\n\n— সহীহ বুখারী ৫০২৭\n\nআজই কুরআন তেলাওয়াত শুরু করুন। 🤲',
        null,
        'https://picsum.photos/seed/quran1/600/350',
        'hadith', 'public', 1243, 0, 389]
    );

    await db.query(`
      INSERT INTO posts (user_id, content, arabic, type, privacy, likes_count, comments_count, shares_count, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW() - INTERVAL '6 hours')`,
      [uid2,
        '🌙 সূরা আল-ইনশিরাহ (৯৪:৬)\n"নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।"\n\nহে মুমিন! কখনো হতাশ হবেন না। প্রতিটি কঠিন সময়ের পরে আল্লাহর রহমতে সহজ সময় আসবেই। আমিন 🤲\n\n#IslamicReminder #Quran',
        'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        'reminder', 'public', 2156, 0, 567]
    );

    await db.query(`
      INSERT INTO posts (user_id, content, arabic, image, type, privacy, likes_count, comments_count, shares_count, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW() - INTERVAL '8 hours')`,
      [uid3,
        '🤲 "রাব্বানা আতিনা ফিদ্দুনইয়া হাসানাতাও ওয়াফিল আখিরাতি হাসানাতাও ওয়াকিনা আযাবান্নার"\n\n"হে আমাদের রব! আমাদের দুনিয়াতে কল্যাণ দাও এবং আখিরাতেও কল্যাণ দাও এবং আমাদের জাহান্নামের আযাব থেকে রক্ষা করো।"\n\n— সূরা বাকারা: ২০১\n\nআমিন! শেয়ার করুন, সদকায়ে জারিয়া হবে ইনশাআল্লাহ। 💚',
        'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        'https://picsum.photos/seed/mosque5/600/350',
        'dua', 'public', 3421, 0, 891]
    );

    // Seed notifications for user 1 (shahaly)
    await db.query(`
      INSERT INTO notifications (user_id, from_user_id, text, emoji, read)
      VALUES ($1,$2,$3,$4,$5)`,
      [uid1, uid2, 'Abdullah Al-Faruk আপনার পোস্টে 🤲 Dua দিয়েছেন', '🤲', false]
    );
    await db.query(`
      INSERT INTO notifications (user_id, from_user_id, text, emoji, read)
      VALUES ($1,$2,$3,$4,$5)`,
      [uid1, uid3, 'UmmahBook Admin মন্তব্য করেছেন: "জাযাকাল্লাহু খায়রান"', '💬', false]
    );

    // Seed groups
    const groupData = [
      ['বাংলাদেশ ইসলামিক ফোরাম', 'https://picsum.photos/seed/isg1/80/80', 45200, 1230, 'বাংলাদেশের সকল মুসলিমদের জন্য ইসলামিক জ্ঞান ও আলোচনার প্ল্যাটফর্ম।'],
      ['Quran Learners BD', 'https://picsum.photos/seed/isg2/80/80', 28400, 876, 'কুরআন শিক্ষা ও তিলাওয়াত অনুশীলনের জন্য।'],
      ['Hadith Daily', 'https://picsum.photos/seed/isg3/80/80', 62100, 3450, 'প্রতিদিন সহীহ হাদিস শেয়ার করা হয়।'],
      ['Islamic Sisters Network', 'https://picsum.photos/seed/isg4/80/80', 19800, 567, 'মুসলিম বোনদের জন্য একটি বিশেষ গ্রুপ।'],
      ['Tafsir & Tafeem', 'https://picsum.photos/seed/isg5/80/80', 34500, 2100, 'কুরআনের তাফসির ও তাফহীম আলোচনা।'],
      ['Muslim Youth Bangladesh', 'https://picsum.photos/seed/isg6/80/80', 88000, 4200, 'বাংলাদেশী মুসলিম তরুণদের জন্য।'],
    ];

    const groupIds = [];
    for (const g of groupData) {
      const r = await db.query(
        `INSERT INTO groups (name, img, members_count, posts_count, description) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        g
      );
      groupIds.push(r.rows[0].id);
    }

    // Seed some joined groups for user 1
    await db.query(`INSERT INTO group_members (group_id, user_id) VALUES ($1,$2)`, [groupIds[1], uid1]);
    await db.query(`INSERT INTO group_members (group_id, user_id) VALUES ($1,$2)`, [groupIds[4], uid1]);

    // Seed events
    const eventData = [
      ["জুমার খুতবা লাইভ", "বায়তুল মোকাররম মসজিদ", "৬ জুন", "১২:৩০ PM", "🕌", "from-green-600 to-green-800", 2340, 5670, "Live"],
      ["Quran Tafsir Class", "Online · Zoom", "৬ জুন", "৮:০০ PM", "📖", "from-emerald-600 to-teal-800", 856, 1234, "Online"],
      ["ঈদুল আযহা প্রস্তুতি সভা", "ঢাকা Community Center", "৭ জুন", "৯:০০ AM", "🐑", "from-amber-600 to-orange-700", 1200, 3400, "In-person"],
      ["Islamic Book Fair", "Bashundhara, Dhaka", "৮ জুন", "১০:০০ AM", "📚", "from-blue-600 to-indigo-800", 4500, 12000, "In-person"],
      ["Online Dua Session", "Facebook Live", "৯ জুন", "৯:০০ PM", "🤲", "from-teal-600 to-green-800", 678, 2100, "Online"],
      ["Youth Islamic Quiz", "Dhaka University", "১০ জুন", "২:০০ PM", "🏆", "from-yellow-600 to-amber-700", 320, 890, "In-person"],
    ];

    for (const e of eventData) {
      await db.query(
        `INSERT INTO events (title, location, event_date, event_time, emoji, color, going_count, interested_count, type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        e
      );
    }

    console.log('✅ Database seeded successfully!');
    console.log('   Users: shahaly/123456, abdullah/123456, admin/admin');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
