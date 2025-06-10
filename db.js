const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Dupa69Z_Trupa8!@#$%^',
    database: 'ebiblioteczka'
});

module.exports = pool;