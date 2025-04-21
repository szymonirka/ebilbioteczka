const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const port = 3000;
app.use(express.json());

//app.get('/', (req, res) => {
 //   res.send('Witaj z Express.js!');
//});

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
const authRoutes = require('./routes/auth');
const booksRouter = require('./routes/books');
app.use('/api/books',booksRouter);
app.use('/api/auth', authRoutes);