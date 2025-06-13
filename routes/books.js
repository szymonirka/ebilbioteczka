const express = require('express');
const router = express.Router();
const pool = require('../db');

// pobieranie wszystkich kasiazk
router.get('/', async (req, res) => {
    const { title, author, category } = req.query;
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
    if (category) {
        sql += ' AND category = ?';
        params.push(category);
    }


    try {
        const [books] = await pool.query(sql, params);
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd pobierania książek' });
    }
});

// pobierz 3 ostatnio dodane ksiazki
router.get('/latest', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, title, author FROM books ORDER BY id DESC LIMIT 5'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd pobierania nowości' });
    }
});

// szczegoly danej ksiazki
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

