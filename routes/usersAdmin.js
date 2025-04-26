const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const bcrypt = require('bcrypt');


//pobierz wszystkich uzytkowników

router.get('/', auth, isAdmin, async (req, res) =>{
   try{
       const [users] = await pool.query('SELECT id, username, role FROM users');
       res.json(users);
   } catch (err) {
       console.error(err);
       res.status(500).json({message: 'Błąd pobierania użytkowników'});
   }
});

// Usun użytkownika
router.delete('/:id', auth, isAdmin, async (req, res) => {
    const userId = req.params.id;

    try {
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'Użytkownik został usunięty.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd usuwania użytkownika' });
    }
});

// Dodaj nowego użytkownika lub admina
router.post('/create', auth, isAdmin, async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: "Brak wymaganych danych." });
    }

    if (role !== 'user' && role !== 'admin') {
        return res.status(400).json({ message: "Nieprawidłowa rola użytkownika." });
    }

    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Użytkownik o takiej nazwie już istnieje." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
        res.json({ message: "✅ Użytkownik został dodany." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd podczas tworzenia użytkownika." });
    }
});

module.exports = router;