const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mysql = require("mysql2/promise");

async function migrate() {
    const migrationsDir = path.join(__dirname, "../migrations");
    let connection;

    try {
        if (process.env.DB_HOST && process.env.DB_HOST.includes('aiven.io')) {
            connection = await mysql.createConnection({
                uri: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: true },
                multipleStatements: true
            });
            console.log("Connected to Aiven MySQL server.");
        } else {
            connection = await mysql.createConnection({
                host: process.env.DB_HOST || "localhost",
                user: process.env.DB_USER || "root",
                password: process.env.DB_PASSWORD || "",
                multipleStatements: true
            });
            console.log("Connected to Local MySQL server.");
        }

        const dbName = process.env.DB_NAME || "insight_spark";

        // Create DB if not exists (Only for local, Aiven usually gives a pre-made DB)
        if (!process.env.DATABASE_URL) {
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
            await connection.query(`USE \`${dbName}\``);
        }

        // Ensure Migrations Table Exists
        await connection.query(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Get executed migrations
        const [rows] = await connection.query("SELECT name FROM _migrations");
        const executedMigrations = new Set(rows.map(r => r.name));

        // Read migration files
        const files = fs.readdirSync(migrationsDir).sort();

        for (const file of files) {
            if (file.endsWith(".sql")) {
                if (executedMigrations.has(file)) {
                    console.log(`Skipping already executed: ${file}`);
                    continue;
                }

                console.log(`Running migration: ${file}`);
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, "utf8");

                try {
                    await connection.query("BEGIN"); // Start Transaction
                    await connection.query(sql);
                    await connection.query("INSERT INTO _migrations (name) VALUES (?)", [file]);
                    await connection.query("COMMIT"); // Commit Transaction
                    console.log(`Completed: ${file}`);
                } catch (migrationErr) {
                    await connection.query("ROLLBACK");
                    throw new Error(`Migration ${file} failed: ${migrationErr.message}`);
                }
            }
        }

        console.log("All migrations executed successfully!");

    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}

migrate();
