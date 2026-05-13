const pool = require('./db');

const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database. Initializing tables...');

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        name VARCHAR(100),
        designation VARCHAR(100),
        email VARCHAR(100),
        avatar VARCHAR(10)
      )
    `);

    // Insert Default Admin if not exists
    const [admins] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (admins.length === 0) {
      // Note: In production, use bcrypt to hash this. For now, matching the user's "admin123"
      // We will hash it in the login logic if we want, but for matching exactly what they have:
      await connection.query(\`
        INSERT INTO users (id, username, password, role, name, designation, email, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      \`, ['ADM001', 'admin', 'admin123', 'admin', 'Dr. Rajesh Kumar', 'System Administrator', 'admin@newmorningstar.edu.in', 'RK']);
      console.log('Default admin created.');
    }

    // Students Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(50) PRIMARY KEY,
        rollNo VARCHAR(20),
        name VARCHAR(100) NOT NULL,
        class VARCHAR(20),
        section VARCHAR(10),
        fatherName VARCHAR(100),
        motherName VARCHAR(100),
        contact VARCHAR(20),
        address TEXT,
        dob DATE,
        admissionDate DATE,
        status VARCHAR(20) DEFAULT 'Active',
        gender VARCHAR(10),
        bloodGroup VARCHAR(5),
        transportRoute VARCHAR(100),
        session VARCHAR(20)
      )
    `);

    // Staff Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(50),
        designation VARCHAR(100),
        contact VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        joiningDate DATE,
        status VARCHAR(20) DEFAULT 'Active',
        gender VARCHAR(10),
        qualification TEXT,
        salary DECIMAL(10, 2)
      )
    `);

    // Attendance Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId VARCHAR(50),
        date DATE,
        status VARCHAR(10),
        session VARCHAR(20),
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Fees Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fees (
        studentId VARCHAR(50),
        session VARCHAR(20),
        total DECIMAL(10, 2),
        paid DECIMAL(10, 2),
        remaining DECIMAL(10, 2),
        lastPaymentDate DATE,
        PRIMARY KEY (studentId, session),
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialization complete.');
    connection.release();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

if (require.main === module) {
  initDb().then(() => process.exit());
}

module.exports = initDb;
