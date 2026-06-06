const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/groups
router.get('/', auth, async (req, res) => {
  try {
    const groups = await db.query('SELECT * FROM groups ORDER BY id');
    const joined = await db.query(
      'SELECT group_id FROM group_members WHERE user_id=$1', [req.userId]
    );
    const joinedSet = new Set(joined.rows.map(r => r.group_id));

    res.json(groups.rows.map(g => ({
      id: g.id,
      name: g.name,
      img: g.img,
      members: g.members_count,
      posts: g.posts_count,
      desc: g.description,
      joined: joinedSet.has(g.id),
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/groups/:id/join
router.post('/:id/join', auth, async (req, res) => {
  try {
    const gid = parseInt(req.params.id);
    await db.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [gid, req.userId]
    );
    await db.query('UPDATE groups SET members_count=members_count+1 WHERE id=$1', [gid]);
    res.json({ joined: true });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/groups/:id/leave
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const gid = parseInt(req.params.id);
    const r = await db.query(
      'DELETE FROM group_members WHERE group_id=$1 AND user_id=$2 RETURNING group_id',
      [gid, req.userId]
    );
    if (r.rows.length) {
      await db.query('UPDATE groups SET members_count=GREATEST(0,members_count-1) WHERE id=$1', [gid]);
    }
    res.json({ joined: false });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
