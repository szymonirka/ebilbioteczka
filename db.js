const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '192.168.0.3',
    user: 'root',
    password: 'KanTask123!',
    database: 'ebiblioteczka'
});

module.exports = pool;