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

async function buildPosts(rows, userId) {
  if (!rows.length) return [];
  const ids = rows.map(r => r.id);

  const [reactions, comments, saved] = await Promise.all([
    db.query(`SELECT * FROM post_reactions WHERE post_id = ANY($1)`, [ids]),
    db.query(`
      SELECT c.*, u.name as user_name, u.avatar as user_avatar
      FROM comments c JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ANY($1) ORDER BY c.created_at ASC`, [ids]),
    userId
      ? db.query(`SELECT post_id FROM saved_posts WHERE user_id=$1 AND post_id = ANY($2)`, [userId, ids])
      : { rows: [] },
  ]);

  const reactionMap = {};
  reactions.rows.forEach(r => {
    if (!reactionMap[r.post_id]) reactionMap[r.post_id] = {};
    reactionMap[r.post_id][r.user_id] = r.reaction;
  });

  const commentMap = {};
  comments.rows.forEach(c => {
    if (!commentMap[c.post_id]) commentMap[c.post_id] = [];
    commentMap[c.post_id].push({
      id: c.id,
      user: { name: c.user_name, avatar: c.user_avatar },
      text: c.text,
      time: timeAgo(c.created_at),
    });
  });

  const savedSet = new Set(saved.rows.map(r => r.post_id));

  return rows.map(p => ({
    id: p.id,
    user: { id: p.user_id, name: p.user_name, avatar: p.user_avatar },
    time: timeAgo(p.created_at),
    privacy: p.privacy,
    type: p.type,
    arabic: p.arabic,
    content: p.content,
    image: p.image,
    likes: p.likes_count,
    comments: p.comments_count,
    shares: p.shares_count,
    reactions: [],
    userReactions: reactionMap[p.id] || {},
    commentsList: commentMap[p.id] || [],
    savedBy: savedSet.has(p.id) ? [userId] : [],
  }));
}

// GET /api/posts
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.name as user_name, u.avatar as user_avatar
      FROM posts p JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC LIMIT 50
    `);
    const posts = await buildPosts(result.rows, req.userId);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/posts
router.post('/', auth, async (req, res) => {
  try {
    const { content, arabic, image, type, privacy } = req.body;
    if (!content) return res.status(400).json({ msg: 'Content required' });

    const user = await db.query('SELECT * FROM users WHERE id=$1', [req.userId]);
    const u = user.rows[0];

    const result = await db.query(`
      INSERT INTO posts (user_id, content, arabic, image, type, privacy)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [req.userId, content, arabic || null, image || null, type || 'regular', privacy || 'public']);

    const post = result.rows[0];
    res.status(201).json({
      id: post.id,
      user: { id: u.id, name: u.name, avatar: u.avatar },
      time: 'এইমাত্র',
      privacy: post.privacy,
      type: post.type,
      arabic: post.arabic,
      content: post.content,
      image: post.image,
      likes: 0, comments: 0, shares: 0,
      reactions: [], userReactions: {}, commentsList: [], savedBy: [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await db.query('SELECT user_id FROM posts WHERE id=$1', [req.params.id]);
    if (!post.rows.length) return res.status(404).json({ msg: 'Post not found' });
    if (post.rows[0].user_id !== req.userId)
      return res.status(403).json({ msg: 'Unauthorized' });

    await db.query('DELETE FROM posts WHERE id=$1', [req.params.id]);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/posts/:id/react
router.post('/:id/react', auth, async (req, res) => {
  try {
    const { reaction } = req.body;
    const postId = parseInt(req.params.id);
    const userId = req.userId;

    const existing = await db.query(
      'SELECT * FROM post_reactions WHERE post_id=$1 AND user_id=$2', [postId, userId]
    );

    if (existing.rows.length && existing.rows[0].reaction === reaction) {
      await db.query('DELETE FROM post_reactions WHERE post_id=$1 AND user_id=$2', [postId, userId]);
      await db.query('UPDATE posts SET likes_count = GREATEST(0, likes_count-1) WHERE id=$1', [postId]);
      return res.json({ action: 'removed' });
    }

    if (existing.rows.length) {
      await db.query(
        'UPDATE post_reactions SET reaction=$1 WHERE post_id=$2 AND user_id=$3',
        [reaction, postId, userId]
      );
    } else {
      await db.query(
        'INSERT INTO post_reactions (post_id, user_id, reaction) VALUES ($1,$2,$3)',
        [postId, userId, reaction]
      );
      await db.query('UPDATE posts SET likes_count = likes_count+1 WHERE id=$1', [postId]);
    }
    res.json({ action: 'reacted', reaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/posts/:id/comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Text required' });

    const user = await db.query('SELECT name, avatar FROM users WHERE id=$1', [req.userId]);
    const u = user.rows[0];

    const result = await db.query(
      'INSERT INTO comments (post_id, user_id, text) VALUES ($1,$2,$3) RETURNING *',
      [req.params.id, req.userId, text]
    );
    await db.query('UPDATE posts SET comments_count=comments_count+1 WHERE id=$1', [req.params.id]);

    const c = result.rows[0];
    res.status(201).json({
      id: c.id,
      user: { name: u.name, avatar: u.avatar },
      text: c.text,
      time: 'এইমাত্র',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/posts/:id/share
router.post('/:id/share', auth, async (req, res) => {
  try {
    await db.query('UPDATE posts SET shares_count=shares_count+1 WHERE id=$1', [req.params.id]);
    res.json({ msg: 'Shared' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/posts/:id/save
router.post('/:id/save', auth, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const existing = await db.query(
      'SELECT 1 FROM saved_posts WHERE user_id=$1 AND post_id=$2', [req.userId, postId]
    );
    if (existing.rows.length) {
      await db.query('DELETE FROM saved_posts WHERE user_id=$1 AND post_id=$2', [req.userId, postId]);
      return res.json({ saved: false });
    }
    await db.query('INSERT INTO saved_posts (user_id, post_id) VALUES ($1,$2)', [req.userId, postId]);
    res.json({ saved: true });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
