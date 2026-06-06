const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

async function formatUser(user, currentUserId) {
  const friends = await db.query(`
    SELECT CASE WHEN from_user_id=$1 THEN to_user_id ELSE from_user_id END as fid
    FROM friendships WHERE (from_user_id=$1 OR to_user_id=$1) AND status='accepted'
  `, [user.id]);

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
    sentRequests: [],
    receivedRequests: [],
  };
}

// GET /api/users — all users
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id');
    const users = await Promise.all(result.rows.map(u => formatUser(u, req.userId)));
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/users/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ msg: 'User not found' });
    const user = await formatUser(result.rows[0], req.userId);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/users/profile — update own profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, location } = req.body;
    await db.query(
      'UPDATE users SET name=$1, bio=$2, location=$3 WHERE id=$4',
      [name, bio, location, req.userId]
    );
    const result = await db.query('SELECT * FROM users WHERE id=$1', [req.userId]);
    const user = await formatUser(result.rows[0], req.userId);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
