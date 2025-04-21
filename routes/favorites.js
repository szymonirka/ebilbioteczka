const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth =require('../middleware/authMiddleware');



// dodaj ksiazke
router.post('/:bookId', auth, async (req,res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;

    try {
        await pool.query('INSERT IGNORE INTO favorites (user_id, book_id) VALUES (?, ?)', [userId, bookId]);
        res.json({ message: 'Dodano do ulubionych' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas dodawania do ulubionych' });
    }
});
// pobierz ulubione ksiazki
router.get('/',auth,async (req, res) => {
    const userId = req.user.id;

    try {
        const [favorites] = await pool.query(
            `SELECT b.id, b.title, b.author
             FROM books b
                      JOIN favorites f ON b.id = f.book_id
             WHERE f.user_id = ?`,
            [userId]
        );
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Błąd pobierania ulubionych książek'});
    }
});
//usun ulubione
router.delete('/:bookId', auth, async (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;

    try {
        await pool.query('DELETE FROM favorites WHERE user_id = ? AND book_id = ?', [userId, bookId]);
        res.json({ message: 'Usunięto z ulubionych' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas usuwania z ulubionych' });
    }
});

module.exports = router;
