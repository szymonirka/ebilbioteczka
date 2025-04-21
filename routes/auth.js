const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = []; // baza danych tymczasowa

// rejestracja

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find(u => u.username === username);
    if(existingUser) {
    return res.status(400).json({message: "Użytkownik już istnieje"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {id: Date.now(), username, password: hashedPassword};
    users.push(user); //na koniec tablicy

    res.status(201).json({message: "Rejestracja zakończona sukcesem"});

});


//logowanie

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'tajny_klucz', { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;

