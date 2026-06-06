const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

function makeToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

async function getUserWithFriendData(userId) {
  const u = await db.query('SELECT * FROM users WHERE id=$1', [userId]);
  if (!u.rows.length) return null;
  const user = u.rows[0];

  const friends = await db.query(`
    SELECT CASE WHEN from_user_id=$1 THEN to_user_id ELSE from_user_id END as fid
    FROM friendships WHERE (from_user_id=$1 OR to_user_id=$1) AND status='accepted'
  `, [userId]);
  const sent = await db.query(
    `SELECT to_user_id FROM friendships WHERE from_user_id=$1 AND status='pending'`, [userId]
  );
  const received = await db.query(
    `SELECT from_user_id FROM friendships WHERE to_user_id=$1 AND status='pending'`, [userId]
  );

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    coverPhoto: user.cover_photo,
    bio: user.bio,
    location: user.location,
    joinDate: user.join_date,
    title: user.title,
    friends: user.friends_count,
    friendIds: friends.rows.map(r => r.fid),
    sentRequests: sent.rows.map(r => r.to_user_id),
    receivedRequests: received.rows.map(r => r.from_user_id),
  };
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: 'Username এবং password দিন।' });

    const result = await db.query('SELECT * FROM users WHERE username=$1', [username]);
    if (!result.rows.length)
      return res.status(401).json({ msg: 'ভুল username বা password!' });

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ msg: 'ভুল username বা password!' });

    const userData = await getUserWithFriendData(user.id);
    const token = makeToken(user.id);
    res.json({ token, user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password)
      return res.status(400).json({ msg: 'সব তথ্য পূরণ করুন।' });

    const exists = await db.query('SELECT id FROM users WHERE username=$1', [username]);
    if (exists.rows.length)
      return res.status(400).json({ msg: 'এই username ইতিমধ্যে আছে!' });

    const hash = await bcrypt.hash(password, 10);
    const imgNum = Math.floor(Math.random() * 60) + 1;
    const result = await db.query(`
      INSERT INTO users (username, password_hash, name, avatar, cover_photo, bio, location, join_date, title)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id
    `, [
      username, hash, name,
      `https://i.pravatar.cc/150?img=${imgNum}`,
      `https://picsum.photos/seed/${username}/900/300`,
      'Muslim · Bangladesh 🇧🇩', 'Bangladesh', 'June 2025', 'Muslim · Bangladesh',
    ]);

    const newUserId = result.rows[0].id;
    const userData = await getUserWithFriendData(newUserId);
    const token = makeToken(newUserId);
    res.status(201).json({ token, user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const userData = await getUserWithFriendData(req.userId);
    if (!userData) return res.status(404).json({ msg: 'User not found' });
    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
module.exports.getUserWithFriendData = getUserWithFriendData;
