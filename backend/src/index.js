require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/events', require('./routes/events'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'UmmahBook API' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🕌 UmmahBook backend running on http://localhost:${PORT}`);
  console.log(`   Database: ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`);
});
