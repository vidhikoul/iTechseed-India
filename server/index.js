import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();
const port = 8800;

app.use(cors());
app.use(express.json());

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

// ✅ Root Route
app.get("/", (req, res) => {
    res.json({ message: "Hi! Connected to DB" });
});

// ✅ Fetch Challans
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

// ✅ Register User
app.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        // ✅ Hash the Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Check if User Already Exists
        const checkUserQuery = "SELECT * FROM users WHERE email = ?";
        pool.query(checkUserQuery, [email], (err, results) => {
            if (err) {
                console.error("Error checking user:", err);
                return res.status(500).json({ error: "Database error", details: err });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "User already exists" });
            }

            // ✅ Insert New User
            const insertQuery = `
                INSERT INTO users (email, first_name, last_name, password, role, created_at)
                VALUES (?, ?, ?, ?, ?, NOW());
            `;

            pool.query(insertQuery, [email, firstName, lastName, hashedPassword, role], (err, result) => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).json({ error: "Database error", details: err });
                }
                res.status(201).json({ message: "User registered successfully!" });
            });
        });

    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: "Server error while processing registration" });
    }
});

// ✅ Start the Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
