const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/friends/request/:userId — send friend request
router.post('/request/:userId', auth, async (req, res) => {
  try {
    const toId = parseInt(req.params.userId);
    if (toId === req.userId) return res.status(400).json({ msg: 'Cannot friend yourself' });

    const existing = await db.query(
      `SELECT * FROM friendships WHERE (from_user_id=$1 AND to_user_id=$2) OR (from_user_id=$2 AND to_user_id=$1)`,
      [req.userId, toId]
    );
    if (existing.rows.length) return res.status(400).json({ msg: 'Request already exists' });

    await db.query(
      `INSERT INTO friendships (from_user_id, to_user_id, status) VALUES ($1,$2,'pending')`,
      [req.userId, toId]
    );

    // Notification for target user
    const me = await db.query('SELECT name FROM users WHERE id=$1', [req.userId]);
    await db.query(
      `INSERT INTO notifications (user_id, from_user_id, text, emoji) VALUES ($1,$2,$3,$4)`,
      [toId, req.userId, `${me.rows[0].name} আপনাকে বন্ধু অনুরোধ পাঠিয়েছেন`, '👥']
    );

    res.json({ msg: 'Request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/friends/request/:userId — cancel/decline request
router.delete('/request/:userId', auth, async (req, res) => {
  try {
    const toId = parseInt(req.params.userId);
    await db.query(
      `DELETE FROM friendships WHERE from_user_id=$1 AND to_user_id=$2 AND status='pending'`,
      [req.userId, toId]
    );
    res.json({ msg: 'Request cancelled' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/friends/accept/:userId — accept friend request
router.post('/accept/:userId', auth, async (req, res) => {
  try {
    const fromId = parseInt(req.params.userId);
    const result = await db.query(
      `UPDATE friendships SET status='accepted' WHERE from_user_id=$1 AND to_user_id=$2 AND status='pending' RETURNING id`,
      [fromId, req.userId]
    );
    if (!result.rows.length) return res.status(404).json({ msg: 'Request not found' });

    await db.query('UPDATE users SET friends_count=friends_count+1 WHERE id=$1 OR id=$2', [req.userId, fromId]);

    const me = await db.query('SELECT name FROM users WHERE id=$1', [req.userId]);
    await db.query(
      `INSERT INTO notifications (user_id, from_user_id, text, emoji) VALUES ($1,$2,$3,$4)`,
      [fromId, req.userId, `${me.rows[0].name} আপনার বন্ধু অনুরোধ গ্রহণ করেছেন`, '✅']
    );

    res.json({ msg: 'Friend accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/friends/:userId — remove friend
router.delete('/:userId', auth, async (req, res) => {
  try {
    const otherId = parseInt(req.params.userId);
    const result = await db.query(
      `DELETE FROM friendships
       WHERE status='accepted' AND (
         (from_user_id=$1 AND to_user_id=$2) OR
         (from_user_id=$2 AND to_user_id=$1)
       ) RETURNING id`,
      [req.userId, otherId]
    );
    if (result.rows.length) {
      await db.query(
        'UPDATE users SET friends_count=GREATEST(0,friends_count-1) WHERE id=$1 OR id=$2',
        [req.userId, otherId]
      );
    }
    res.json({ msg: 'Friend removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
