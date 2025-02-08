import express from "express";
import mysql from "mysql2";

const app = express();
const port = 8800;

// ✅ Use a connection pool instead of a single connection
const pool = mysql.createPool({
    host: "10.0.2.220", // Replace with your actual DB host
    // host: "10.0.0.2", // Uncomment if using an IP
    user: "root",
    password: "root",
    database: "danadb",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10, // Limits the number of open connections
    queueLimit: 0
});

// ✅ Root Route
app.get("/", (req, res) => {
    res.json({ message: "Hi! Connected to DB" });
});

// ✅ Route to fetch challans with proper error handling
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

// ✅ Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
