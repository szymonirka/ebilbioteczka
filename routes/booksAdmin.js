const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Dodaj książkę
router.post('/', auth, isAdmin, async (req, res) => {
    const { title, author, content } = req.body;

    try {
        await pool.query('INSERT INTO books (title, author, content) VALUES (?, ?, ?)', [title, author, content]);
        res.json({ message: '📘 Książka została dodana.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas dodawania książki.' });
    }
});

// Usuń książkę
router.delete('/:id', auth, isAdmin, async (req, res) => {
    const bookId = req.params.id;

    try {
        await pool.query('DELETE FROM books WHERE id = ?', [bookId]);
        res.json({ message: '🗑️ Książka została usunięta.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas usuwania książki.' });
    }
});

module.exports = router;
