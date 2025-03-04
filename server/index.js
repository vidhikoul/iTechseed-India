import express from "express";
import mysql from "mysql2";
import cors from "cors"; 
import bcrypt from "bcrypt";
import session from "express-session";
import mysqlSession from "express-mysql-session";  
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";  
import crypto from "crypto";  

dotenv.config();

const app = express();
const port = 8800;

// ✅ Step 1: Check or Generate `SESSION_SECRET`
const envFilePath = ".env";

if (!process.env.SESSION_SECRET) {
    const generatedSecret = crypto.randomBytes(32).toString("hex");
    fs.appendFileSync(envFilePath, `\nSESSION_SECRET=${generatedSecret}\n`);
    console.log("✅ Generated new SESSION_SECRET and saved to .env:", generatedSecret);
    process.env.SESSION_SECRET = generatedSecret; 
}

const SESSION_SECRET = process.env.SESSION_SECRET;
console.log("🔑 Using SESSION_SECRET:", SESSION_SECRET);

// ✅ Step 2: Fix `express-mysql-session` Import & Setup
const MySQLStore = mysqlSession(session);

const dbOptions = {
    host: process.env.DB_HOST || "10.0.2.220",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "danadb",
    port: process.env.DB_PORT || 3306
};

const sessionStore = new MySQLStore(dbOptions, mysql.createPool(dbOptions));

app.use(cors()); // Adjust for frontend
app.use(express.json());

// ✅ Step 3: Use Express-Session Middleware
app.use(session({
    key: "user_sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 Day
}));

// ✅ Step 4: MySQL Connection Pool
const pool = mysql.createPool({
    ...dbOptions,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Step 5: Middleware to Check User Session
function sessionAuth(req, res, next) {
    if (req.session.user) {
        next(); 
    } else {
        return res.status(401).json({ error: "Unauthorized, please log in" });
    }
}

// ✅ Step 6: Fix Nodemailer SMTP Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com", 
    port: process.env.SMTP_PORT || 587, 
    secure: false, 
    auth: {
        user: process.env.SMTP_USER || "your-email@gmail.com",
        pass: process.env.SMTP_PASS || "your-app-password"
    }
});

// ✅ Step 7: API Routes (Login, Logout, Registration, Protected Routes)

// Root Route
app.get("/", (req, res) => {
    res.json({ message: "Hi! Connected to DB" });
});

// ✅ Registration Route
app.post("/Registration", async (req, res) => {
    const { first_name, last_name, user_name, password, role, termsAccepted } = req.body;

    if (!first_name || !last_name || !user_name || !password || !termsAccepted) {
        return res.status(400).json({ error: "All fields and terms acceptance are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (first_name, last_name, user_name, password, role, created_at)
                     VALUES (?, ?, ?, ?, ?, NOW())`;

        pool.query(sql, [first_name, last_name, user_name, hashedPassword, role], (err) => {
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

// ✅ Login Route (Creates a Session)
app.post("/Login", (req, res) => {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `SELECT user_id, user_name, password FROM users WHERE user_name = ?`;

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

        req.session.user = { user_id: results[0].user_id, user_name };
        return res.status(200).json({ message: "Login successful", user: req.session.user });
    });
});

// ✅ Logout Route (Destroys Session)
app.post("/Logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Failed to log out" });
        res.clearCookie("user_sid");
        return res.json({ message: "Logged out successfully" });
    });
});

// ✅ Fetch Challans (Protected Route)
app.get("/challans", sessionAuth, (req, res) => {
    const query = "SELECT * FROM challans";

    pool.query(query, (err, data) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(data);
    });
});

// ✅ Forgot Password Route
app.post("/ForgotPassword", async (req, res) => {
    const { user_name } = req.body;

    if (!user_name) {
        return res.status(400).json({ error: "Email is required" });
    }

    const query = "SELECT user_id FROM users WHERE user_name = ?";
    pool.query(query, [user_name], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const resetLink = `http://localhost:3000/ResetPassword/${results[0].user_id}`;

        const mailOptions = {
            from: `"Support Team" <${process.env.SMTP_USER}>`,
            to: user_name,
            subject: "Password Reset Request",
            text: `Click the link below to reset your password:\n\n${resetLink}`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ Status: "Success", message: "Reset link sent successfully!" });
        } catch (error) {
            console.error("Email error:", error);
            res.status(500).json({ error: "Error sending email" });
        }
    });
});


// Get All Users
app.get('/users', (req, res) => {
    const sql = 'SELECT user_id, first_name, last_name, user_name, role FROM users';
    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

//customer master api
// app.get("/customer_master", (req, res) => {
//     const query = "SELECT customer_id, customer_exisitng_id, customer_name, market_code FROM danadb.customer_master;";
//     pool.query(query, (err, results) => {
//       if (err) {
//         console.error("Database Query Error:", err);
//         return res.status(500).json({ error: "Database error" });
//       }
//       res.json(results);
//     });
//   });
// ✅ Start the server


//inventory
app.get("/api/inventory", (req, res) => {
    const sql = `SELECT inventory_id, plant, material_number, material_description, 
                        storage_location, base_unit_of_measure, unrestricted, value_unrestricted 
                 FROM inventory`;
  
    pool.query(sql, (err, results) => {
      if (err) {
        console.error("Database Query Error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  });

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
