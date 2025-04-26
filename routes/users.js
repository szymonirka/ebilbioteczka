const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const isAdmin = require('../middleware/isAdmin');

//zmiana hasla

router.put('/change-password', auth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        // Pobierz aktualne hasło z bazy
        const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        const user = rows[0];

        if (!user) return res.status(404).json({ message: "Użytkownik nie istnieje" });

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(401).json({ message: "Stare hasło jest nieprawidłowe" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);
        res.json({ message: "Hasło zostało zmienione." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Błąd przy zmianie hasła." });
    }
});


router.delete('/delete', auth, async (req, res) =>{
   const userIf = req.user.id;

   try {
       await pool.query('DELETE FROM users WHERE id = ?', [userId]);
       res.json({message: "Konto zostało usunięte"});
   } catch (err){
     console.error(err);
     res.status(500).json({message: "Błąd w usuwaniu konta."});
   }
});

router.put('/change-username', auth, async (req,res) => {
    const {newUsername} = req.body;
    const userId = req.user.id;

    try{
        const [exist] = await pool.query('SELECT id FROM users WHERE username = ?', [newUsername]);
        if (exist.length > 0) {
            return res.status(400).json({message: "Ta nazwa użytkownika jest już zajęta"});
        }
        await pool.query('UPDATE users SET username = ? WHERE id = ?', [newUsername,userId]);
        res.json({message: "Nazwa użytkownia została zmienione. Zaloguj się ponownie"});

    } catch (err){
        console.error(err);
        res.status(500).json({message: "Błąd przy zmianie loginu"});
    }
});

router.post('/create-admin', auth, isAdmin, async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashed, 'admin']);
        res.json({ message: 'Nowy administrator utworzony.' });
    } catch (err) {
        res.status(500).json({ message: 'Błąd tworzenia administratora.' });
    }
});


module.exports = router;