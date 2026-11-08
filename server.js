const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();
const db = new sqlite3.Database('./vektorlab.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, owner TEXT, content TEXT)");
    
    // Akun default & Flag rahasia
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (1, 'admin', 'admin123', 'admin')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (2, 'zeeo', 'zeeo2026', 'user')");
    db.run("INSERT OR IGNORE INTO notes (id, owner, content) VALUES (1, 'admin', 'FLAG{GitHub_Cloud_VektorLab_2026}')");
});

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'github-cloud-secret',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.send(`
        <div style="font-family:monospace; background:#030712; color:#38bdf8; padding:30px; max-width:400px; margin:50px auto; border:1px solid #1e293b; border-radius:8px;">
            <h2>⚡ VektorLab [Cloud Edition]</h2>
            <form action="/login" method="POST">
                <label>Username:</label><br>
                <input type="text" name="username" style="width:100%; padding:8px; margin:8px 0; background:#020617; border:1px solid #334155; color:#fff;" required><br>
                <label>Password:</label><br>
                <input type="password" name="password" style="width:100%; padding:8px; margin:8px 0; background:#020617; border:1px solid #334155; color:#fff;" required><br><br>
                <button type="submit" style="width:100%; background:#0284c7; color:#fff; padding:10px; border:none; font-weight:bold; cursor:pointer;">Login</button>
            </form>
        </div>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Sengaja dibuat rentan SQL Injection untuk bahan latihan pentest
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.get(query, (err, user) => {
        if (err || !user) return res.send("<div style='background:#030712; color:#ef4444; padding:20px; font-family:monospace;'>Login Gagal! <a href='/' style='color:#38bdf8;'>Kembali</a></div>");
        req.session.user = user.username;
        req.session.role = user.role;
        res.redirect('/dashboard');
    });
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    db.all("SELECT content FROM notes WHERE owner='admin'", (err, rows) => {
        res.send(`
            <div style="font-family:monospace; background:#030712; color:#38bdf8; padding:30px; max-width:600px; margin:50px auto; border:1px solid #1e293b; border-radius:8px;">
                <h2>Selamat Datang, ${req.session.user}!</h2>
                <p>Role Akses: <b style="color:#4ade80;">${req.session.role}</b></p>
                <hr style="border-color:#334155;">
                ${req.session.role === 'admin' ? `<h3 style="color:#facc15;">Flag Rahasia: ${rows[0].content}</h3>` : '<p style="color:#94a3b8;"><i>Anda masuk sebagai user biasa. Flag rahasia disembunyikan. Coba teknik bypass!</i></p>'}
                <br><a href="/" style="color:#ef4444;">[ Logout / Keluar ]</a>
            </div>
        `);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
