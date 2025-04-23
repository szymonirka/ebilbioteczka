const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const {route} = require("express/lib/application");
const router = express.Router();

//zmiana hasla

router.put('/change-password', auth, async (req,res) => {
   const { newPassword } = req.body;
   const userId = req.user.id;

   try{
       const hashed = await bcrypt.hash(newPassword, 10);
       await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed,userId]);
       res.json({message: "Hasło zostało zmienione"});
   }catch(err){
       console.error(err);
       res.status(500).json({message: "Błąd przy zmianie hasła"});
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

module.exports = router;