const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

function getPool() {
    if (!pool) {
        if (process.env.DB_HOST && process.env.DB_HOST.includes('aiven.io')) {
            // Aiven SSL configuration
            pool = mysql.createPool({
                uri: process.env.DATABASE_URL, // Use connection string for Aiven
                ssl: {
                    rejectUnauthorized: true,
                    ca: process.env.DB_CA_CERT // Optional if needed for strict SSL
                },
                waitForConnections: true,
                connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
                queueLimit: 0,
                multipleStatements: true
            });
        } else {
            // Local Configuration
            pool = mysql.createPool({
                host: process.env.DB_HOST || "localhost",
                user: process.env.DB_USER || "root",
                password: process.env.DB_PASSWORD || "",
                database: process.env.DB_NAME || "insight_spark",
                waitForConnections: true,
                connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
                queueLimit: 0,
                multipleStatements: true
            });
        }

        pool.on('connection', (connection) => {
            // console.log('DB Connection established');
        });

        pool.on('error', (err) => {
            console.error('Unexpected DB Error:', err);
        });
    }

    return pool;
}

// Test connection
async function checkConnection() {
    try {
        const p = getPool();
        const connection = await p.getConnection();
        connection.release();
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}

module.exports = { getPool, checkConnection };
