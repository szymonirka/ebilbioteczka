const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // token bearer
    if (!token) return res.status(401).json({ message: "Brak tokena" });

    try {
        const user = jwt.verify(token, 'tajny_klucz');
        req.user = user; // przekazujemy usera dalej
        next();
    } catch (err) {
        return res.status(403).json({ message: "Nieprawidłowy token" });
    }
}

module.exports = authMiddleware;