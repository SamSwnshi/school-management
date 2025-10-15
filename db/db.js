const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function checkConnection(){
    let connection;
    try {
        connection = await pool.getConnection()
        await connection.query("SELECT 1")
        console.log('✅ Database connection successful!');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed! Check credentials and server status.');
        console.error('Error details:', error.message);
          process.exit(1);
    }
}

checkConnection();
module.exports = pool;