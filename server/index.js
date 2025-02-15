import express from "express";
import mysql from "mysql2";
import cors from "cors"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const cors = require("cors");
const app = express();
const port = 8800;

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON requests

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: "10.0.2.220",
    user: "root",
    password: "root",
    database: "danadb",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Root Route
app.get("/", (req, res) => {
    res.json({ message: "Hi! Connected to DB" });
});

// Fetch challans with error handling
app.get("/challans", (req, res) => {
    const query = "SELECT * FROM challans";

    pool.query(query, (err, data) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(data);
    });
});

// Registration Route
app.post("/Registration", async (req, res) => {
    const { first_name, last_name, user_name, password, role, termsAccepted } = req.body;
    if (!first_name || !last_name || !user_name || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (!termsAccepted) {
        return res.status(400).json({ error: "You must accept the terms." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); 

        const sql = `
            INSERT INTO users (first_name, last_name, user_name, password, role, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE 
                first_name = VALUES(first_name),
                last_name  = VALUES(last_name),
                user_name  = VALUES(user_name),
                password   = VALUES(password),
                role       = VALUES(role),
                created_at = VALUES(created_at);
        `;

        pool.query(sql, [first_name, last_name, user_name, hashedPassword, role], (err, result) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ error: "Database error" });
            }
            return res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
//login page api
// Secret key for JWT authentication
const SECRET_KEY = "your_secret_key";

// ✅ Login Route
app.post("/Login", (req, res) => {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `SELECT user_name, password FROM users WHERE user_name = ?`;

    pool.query(sql, [user_name], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const storedHashedPassword = results[0].password;
        const isMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ user_name }, SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({ message: "Login successful", token });
    });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
