const db = require('../database/db');

exports.renderDashboard = (req, res) => {
    if (!req.session.userId) return res.redirect('/');

    db.all("SELECT * FROM notes ORDER BY id DESC", (err, notes) => {
        res.render('dashboard', {
            username: req.session.username,
            role: req.session.role,
            notes: notes || []
        });
    });
};

exports.addNote = (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    const { content } = req.body;

    // Sengaja rentan Stored XSS jika input tidak disanitasi
    db.run("INSERT INTO notes (author, content) VALUES (?, ?)", [req.session.username, content], (err) => {
        res.redirect('/dashboard');
    });
};

exports.renderAdmin = (req, res) => {
    if (!req.session.userId || req.session.role !== 'admin') {
        return res.send("<script>alert('Akses Ditolak: Memerlukan hak akses Admin!'); window.location='/dashboard';</script>");
    }

    db.all("SELECT id, username, role, salary, department FROM users", (err, users) => {
        db.get("SELECT flag FROM corporate_secrets WHERE id = 1", (err, secret) => {
            res.render('admin', {
                users: users,
                flag: secret ? secret.flag : 'FLAG-NOT-FOUND'
            });
        });
    });
};
