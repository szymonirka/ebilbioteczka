const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// Rejestracja
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Użytkownik już istnieje' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'Rejestracja zakończona sukcesem' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd serwera podczas rejestracji' });
    }
});

// Logowanie
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, 'tajny_klucz', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd serwera podczas logowania' });
    }
});

module.exports = router;
