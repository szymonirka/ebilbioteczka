const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
const booksAdminRouter = require('./routes/booksAdmin');
const booksRouter = require('./routes/books');
const authRoutes = require('./routes/auth');
const favoritesRouter = require('./routes/favorites');
const userRoutes = require('./routes/users');
const usersAdminRouter = require('./routes/usersAdmin');

// Routing
app.use('/api/auth', authRoutes);            // Rejestracja i logowanie
app.use('/api/favorites', favoritesRouter);  // Ulubione książki

app.use('/api/admin/books', booksAdminRouter); // administrator ksiazki
app.use('/api/books', booksRouter); // zwykly uzytkownik ksiazki

app.use('/api/users', userRoutes);             // Zwykły użytkownik – konto
app.use('/api/admin/users', usersAdminRouter); // Admin – zarządzanie użytkownikami

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Endpoint nie istnieje.' });
}); // przekirowanie json w przypadku blednego api

// Server start
app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
