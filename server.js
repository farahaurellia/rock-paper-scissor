require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/save-result', (req, res) => {
  const { playerChoice, computerChoice, result } = req.body;
  const query = `INSERT INTO game_results (player_choice, computer_choice, result) VALUES (?, ?, ?)`;
  db.query(query, [playerChoice, computerChoice, result], (err) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Result saved' });
  });
});

app.get('/api/history', (req, res) => {
  db.query(`SELECT * FROM game_results ORDER BY created_at DESC LIMIT 20`, (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
