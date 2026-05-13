<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Auth Routes ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];
    // In a real app, use bcrypt.compare here. 
    // Matching the user's request to keep credentials same ("admin123")
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token: 'mock-jwt-token' }); // In real app, generate JWT
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- Student Routes ---
app.get('/api/students/:session', async (req, res) => {
  try {
    const [students] = await pool.query('SELECT * FROM students WHERE session = ?', [req.params.session]);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  const s = req.body;
  try {
    await pool.query(\`
      INSERT INTO students (id, rollNo, name, class, section, fatherName, motherName, contact, address, dob, admissionDate, status, gender, bloodGroup, transportRoute, session)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        name=?, class=?, section=?, fatherName=?, motherName=?, contact=?, address=?, dob=?, admissionDate=?, status=?, gender=?, bloodGroup=?, transportRoute=?
    \`, [
      s.id, s.rollNo, s.name, s.class, s.section, s.fatherName, s.motherName, s.contact, s.address, s.dob, s.admissionDate, s.status, s.gender, s.bloodGroup, s.transportRoute, s.session,
      s.name, s.class, s.section, s.fatherName, s.motherName, s.contact, s.address, s.dob, s.admissionDate, s.status, s.gender, s.bloodGroup, s.transportRoute
    ]);
    res.json({ message: 'Student saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving student', error: err.message });
  }
});

// --- Staff Routes ---
app.get('/api/staff', async (req, res) => {
  try {
    const [staff] = await pool.query('SELECT * FROM staff');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching staff', error: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('NMS School API is running...');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
=======
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // Allows parsing JSON bodies

// --- STUDENTS ENDPOINTS ---

// Get all students
app.get('/api/students', (req, res) => {
  const query = 'SELECT * FROM students';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new student
app.post('/api/students', (req, res) => {
  const { id, name, class_name, section, transport_route } = req.body;
  const query = 'INSERT INTO students (id, name, class_name, section, transport_route) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [id, name, class_name, section, transport_route], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student added successfully', studentId: id });
  });
});

// Basic Root Route
app.get('/', (req, res) => {
  res.send('Skolux ERP API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
});
