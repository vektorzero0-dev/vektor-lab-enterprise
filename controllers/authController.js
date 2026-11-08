const db = require('../database/db');

exports.renderLogin = (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.render('index', { error: null });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    // Sengaja rentan SQL Injection pada input username
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.get(query, (err, user) => {
        if (err || !user) {
            return res.render('index', { error: 'Gagal Autentikasi: Kredensial salah.' });
        }
        
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        res.redirect('/dashboard');
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};
