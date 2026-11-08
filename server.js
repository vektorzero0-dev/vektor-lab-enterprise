const express = require('express');
const session = require('express-session');
const path = require('path');
const webRoutes = require('./routes/webRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'enterprise-security-vault-key-88!',
    resave: false,
    saveUninitialized: true
}));

app.use('/', webRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`VektorLab Enterprise berjalan di port ${PORT}`);
});
