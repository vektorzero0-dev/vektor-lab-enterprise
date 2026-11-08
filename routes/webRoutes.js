const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const db = require('../database/db');

router.get('/', authController.renderLogin);
router.post('/login', authController.login);
router.get('/dashboard', dashboardController.renderDashboard);
router.post('/note', dashboardController.addNote);
router.get('/admin-console', dashboardController.renderAdmin);
router.get('/logout', authController.logout);

// Fitur IDOR (Insecure Direct Object Reference) untuk latihan audit nyata
router.get('/profile', (req, res) => {
    if (!req.session.userId) return res.redirect('/');
    
    // Parameter ID rentan diubah dari URL (misal: /profile?id=1)
    const targetId = req.query.id || req.session.userId;
    
    db.get("SELECT id, username, role, salary, department FROM users WHERE id = ?", [targetId], (err, user) => {
        if (err || !user) return res.send("Profil tidak ditemukan.");
        res.render('profile', { profileUser: user, isOwner: targetId == req.session.userId });
    });
});

module.exports = router;
