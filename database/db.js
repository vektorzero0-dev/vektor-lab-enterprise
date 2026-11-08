const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../enterprise_lab.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database error:', err.message);
    else console.log('Database Enterprise terhubung.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username TEXT UNIQUE, 
        password TEXT, 
        role TEXT, 
        salary INTEGER,
        department TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        author TEXT, 
        content TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS corporate_secrets (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        classification TEXT, 
        flag TEXT
    )`);

    // Default Seed Data
    db.run("INSERT OR IGNORE INTO users (id, username, password, role, salary, department) VALUES (1, 'admin', 'SuperAdmin2026!', 'admin', 150000, 'Executive')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role, salary, department) VALUES (2, 'zeeo', 'zeeoSecurePass', 'security_analyst', 85000, 'Cyber Security')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role, salary, department) VALUES (3, 'siti', 'siti1234', 'employee', 45000, 'HR')");
    
    db.run("INSERT OR IGNORE INTO corporate_secrets (id, classification, flag) VALUES (1, 'TOP SECRET', 'FLAG{Enterprise_FullFeature_Pentest_2026}')");
    db.run("INSERT OR IGNORE INTO notes (id, author, content) VALUES (1, 'zeeo', 'Catatan audit mingguan: Cek rate limit API.')");
});

module.exports = db;
