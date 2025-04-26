function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Dostęp tylko dla administratorów.' });
    }
    next();
}

module.exports = isAdmin;
