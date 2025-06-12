const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');

//Konfiguracja multer (upload plików)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


// Dodaj książkę
router.post('/', auth, isAdmin, upload.single('pdf'), async (req, res) => {
    const { title, author, content, category } = req.body;
    const pdfPath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        await pool.query(
            'INSERT INTO books (title, author, content, category, pdf_path) VALUES (?, ?, ?, ?, ?)',
            [title, author, content, category, pdfPath]
        );
        res.json({ message: 'Książka została dodana.' });
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
        res.json({ message: 'Książka została usunięta.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas usuwania książki.' });
    }
});

// Edytuj książkę
router.put('/:id', auth, isAdmin, upload.single('pdf'), async (req, res) => {
    const { title, author, category, content } = req.body; // ⬅️ dodano `content`
    const pdfPath = req.file ? `/uploads/${req.file.filename}` : null;
    const bookId = req.params.id;

    try {
        if (pdfPath) {
            await pool.query(
                'UPDATE books SET title = ?, author = ?, category = ?, content = ?, pdf_path = ? WHERE id = ?',
                [title, author, category, content, pdfPath, bookId]
            );
        } else {
            await pool.query(
                'UPDATE books SET title = ?, author = ?, category = ?, content = ? WHERE id = ?',
                [title, author, category, content, bookId]
            );
        }
        res.json({ message: 'Książka została zaktualizowana.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas aktualizacji książki.' });
    }
});


// Pobierz wszystkie książki
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const [books] = await pool.query('SELECT id, title, author, category FROM books');
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd pobierania książek.' });
    }
});

module.exports = router;
