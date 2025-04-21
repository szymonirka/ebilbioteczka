const express = require('express');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Witaj z Express.js!');
});

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});

const booksRouter = require('./routes/books');
app.use('/api/books',booksRouter);
app.use('/api/auth', authRoutes);