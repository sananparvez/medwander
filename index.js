const express = require('express');
const mysql = require('mysql2');
const xlsx = require('xlsx');
const cors = require('cors');

const app = express();

// Middleware
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',  // Will use 'db' from docker-compose env vars
  user: process.env.DB_USER || 'sanan',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'medwander'
});

// Create database tables if they don't exist
db.execute(`
  CREATE TABLE IF NOT EXISTS form_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    form_type ENUM('A', 'B') NOT NULL,
    name VARCHAR(255) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Submit form data
app.post('/api/submit-form', async (req, res) => {
  const { formType, name, countryCode, phoneNumber } = req.body;

  try {
    await db.promise().execute(
      'INSERT INTO form_submissions (form_type, name, country_code, phone_number) VALUES (?, ?, ?, ?)',
      [formType, name, countryCode, phoneNumber]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all submissions
app.get('/api/submissions', async (_req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM form_submissions ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync with Excel
app.post('/api/sync-excel', async (_req, res) => {
  try {
    const [rows] = awaitquery('SELECT * FROM form_submissions');

    // Create workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, 'Submissions');

    // Save to file
    xlsx.writeFile(wb, 'submissions.xlsx');

    res.json({ success: true, message: 'Excel file updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

