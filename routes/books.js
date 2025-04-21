const express = require('express');
const router = express.Router();
const pool = require('../db');

// Pobierz wszystkie książki (z opcjonalnym filtrowaniem)
router.get('/', async (req, res) => {
    const { title, author } = req.query;
    let sql = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (title) {
        sql += ' AND title LIKE ?';
        params.push(`%${title}%`);
    }

    if (author) {
        sql += ' AND author LIKE ?';
        params.push(`%${author}%`);
    }

    try {
        const [books] = await pool.query(sql, params);
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd pobierania książek' });
    }
});

// Szczegóły książki
router.get('/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
        const book = rows[0];
        if (!book) return res.status(404).json({ message: 'Książka nie znaleziona' });

        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd pobierania szczegółów książki' });
    }
});

module.exports = router;
