const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');


// Dodaj ksiazke
router.post('/', auth, isAdmin, async (req, res) => {
    const { title, author, content } = req.body;

    try {
        await pool.query('INSERT INTO books (title, author, content) VALUES (?, ?, ?)', [title, author, content]);
        res.json({ message: 'Książka została dodana.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas dodawania książki.' });
    }
});

// Usun ksiazke
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

// multer (upload pdf do public/uploads)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// pdf ksiazka endpoint
router.post('/upload', auth, isAdmin, upload.single('pdf'), async (req, res) => {
    const { title, author, content } = req.body;
    const pdfPath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        await pool.query('INSERT INTO books (title, author, content, pdf_path) VALUES (?, ?, ?, ?)', [title, author, content, pdfPath]);
        res.json({ message: 'Książka została dodana z PDF.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas dodawania książki.' });
    }
});
//edycja ksiazki

router.put('/:id', auth, isAdmin, upload.single('pdf'), async (req, res) => {
    const { title, author } = req.body;
    const pdfPath = req.file ? `/uploads/${req.file.filename}` : null;
    const bookId = req.params.id;

    try {
        if (pdfPath) {
            await pool.query('UPDATE books SET title = ?, author = ?, pdf_path = ? WHERE id = ?', [title, author, pdfPath, bookId]);
        } else {
            await pool.query('UPDATE books SET title = ?, author = ? WHERE id = ?', [title, author, bookId]);
        }
        res.json({ message: 'Książka została zaktualizowana.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd podczas aktualizacji książki.' });
    }
});

// pobieranie wszystkich ksiazek
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const [books] = await pool.query('SELECT id, title, author FROM books');
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Błąd pobierania książek.' });
    }
});


module.exports = router;
