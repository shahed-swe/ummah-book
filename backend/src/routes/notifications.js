const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'এইমাত্র';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} মিনিট আগে`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ঘন্টা আগে`;
  return `${Math.floor(h / 24)} দিন আগে`;
}

// GET /api/notifications
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT n.*, u.avatar as from_avatar
      FROM notifications n
      LEFT JOIN users u ON u.id = n.from_user_id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC LIMIT 30
    `, [req.userId]);

    const notifications = result.rows.map(n => ({
      id: n.id,
      avatar: n.from_avatar || 'https://i.pravatar.cc/150?img=50',
      text: n.text,
      time: timeAgo(n.created_at),
      read: n.read,
      emoji: n.emoji || '🔔',
    }));

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', auth, async (req, res) => {
  try {
    await db.query('UPDATE notifications SET read=true WHERE user_id=$1', [req.userId]);
    res.json({ msg: 'All read' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
