const express = require('express');
const router = express.Router();

//tymczasowa baza
const books = [
    { id: 1, title: 'Wiedźmin', author: 'Andrzej Sapkowski' },
    { id: 2, title: 'Lalka', author: 'Bolesław Prus' }
]

//lista ksiazek

router.get('/', (req, res) => {
    const { title, author } = req.query;
    let filtered = books;

    if (title) {
        filtered = filtered.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    }

    if (author) {
        filtered = filtered.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    }

    res.json(filtered);
});


//szczególy ksiązki

router.get('/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if(!book) return res.status(404).send("Nie znaleziono książki");
    res.json(book);
})

module.exports = router;