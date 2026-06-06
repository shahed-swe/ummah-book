const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/events
router.get('/', auth, async (req, res) => {
  try {
    const events = await db.query('SELECT * FROM events ORDER BY id');
    const responses = await db.query(
      'SELECT event_id, response_type FROM event_responses WHERE user_id=$1', [req.userId]
    );
    const responseMap = {};
    responses.rows.forEach(r => { responseMap[r.event_id] = r.response_type; });

    res.json(events.rows.map(e => ({
      id: e.id,
      title: e.title,
      location: e.location,
      date: e.event_date,
      time: e.event_time,
      emoji: e.emoji,
      color: e.color,
      going: e.going_count,
      interested: e.interested_count,
      type: e.type,
      status: responseMap[e.id] || null,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/events/:id/respond
router.post('/:id/respond', auth, async (req, res) => {
  try {
    const eid = parseInt(req.params.id);
    const { responseType } = req.body; // 'going', 'interested', or null (remove)

    const existing = await db.query(
      'SELECT response_type FROM event_responses WHERE event_id=$1 AND user_id=$2',
      [eid, req.userId]
    );
    const prev = existing.rows[0]?.response_type;

    // Remove previous response count
    if (prev === 'going') {
      await db.query('UPDATE events SET going_count=GREATEST(0,going_count-1) WHERE id=$1', [eid]);
    } else if (prev === 'interested') {
      await db.query('UPDATE events SET interested_count=GREATEST(0,interested_count-1) WHERE id=$1', [eid]);
    }

    if (!responseType || responseType === prev) {
      // Toggle off
      await db.query('DELETE FROM event_responses WHERE event_id=$1 AND user_id=$2', [eid, req.userId]);
      return res.json({ status: null });
    }

    // Upsert new response
    await db.query(
      `INSERT INTO event_responses (event_id, user_id, response_type) VALUES ($1,$2,$3)
       ON CONFLICT (event_id, user_id) DO UPDATE SET response_type=$3`,
      [eid, req.userId, responseType]
    );

    if (responseType === 'going') {
      await db.query('UPDATE events SET going_count=going_count+1 WHERE id=$1', [eid]);
    } else if (responseType === 'interested') {
      await db.query('UPDATE events SET interested_count=interested_count+1 WHERE id=$1', [eid]);
    }

    res.json({ status: responseType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
