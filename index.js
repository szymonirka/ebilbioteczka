const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const booksRouter = require('./routes/books');
const favoritesRouter = require('./routes/favorites');
const userRoutes = require('./routes/users');
const booksAdminRouter = require('./routes/booksAdmin');
const usersAdminRouter = require('./routes/usersAdmin');

// Routing
app.use('/api/auth', authRoutes);            // Rejestracja i logowanie
app.use('/api/favorites', favoritesRouter);  // Ulubione książki

app.use('/api/books', booksRouter);           // Zwykły użytkownik – czytanie książek
app.use('/api/admin/books', booksAdminRouter); // Admin – zarządzanie książkami

app.use('/api/users', userRoutes);             // Zwykły użytkownik – konto
app.use('/api/admin/users', usersAdminRouter); // Admin – zarządzanie użytkownikami

// Server start
app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
