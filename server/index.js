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

//  Step 1: Check or Generate `SESSION_SECRET`
const envFilePath = ".env";

if (!process.env.SESSION_SECRET) {
    const generatedSecret = crypto.randomBytes(32).toString("hex");
    fs.appendFileSync(envFilePath, `\nSESSION_SECRET=${generatedSecret}\n`);
    console.log("✅ Generated new SESSION_SECRET and saved to .env:", generatedSecret);
    process.env.SESSION_SECRET = generatedSecret; 
}

const SESSION_SECRET = process.env.SESSION_SECRET;
console.log("🔑 Using SESSION_SECRET:", SESSION_SECRET);

//  Step 2: Fix `express-mysql-session` Import & Setup
const MySQLStore = mysqlSession(session);

const dbOptions = {
    host: process.env.DB_HOST || "10.0.2.220",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "danadb",
    port: process.env.DB_PORT || 3306
};

const sessionStore = new MySQLStore(dbOptions, mysql.createPool(dbOptions));

app.use(cors({
    origin: "*", // Allow all origins for open source
    credentials: true
}));
app.use(express.json());

//  Step 3: Use Express-Session Middleware
app.use(session({
    key: "user_sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: false,      // Should be true in production (HTTPS)
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 86400000   // 1 day in milliseconds
    }
}));

//  Step 4: MySQL Connection Pool
const pool = mysql.createPool({
    ...dbOptions,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    });

// Step 5: Middleware to Check User Session
function sessionAuth(req, res, next) {
    if (req.session.user) {
        next(); 
    } else {
        return res.status(401).json({ error: "Unauthorized, please log in" });
    }
}

// Step 6: Fix Nodemailer SMTP Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com", 
    port: process.env.SMTP_PORT || 587, 
    secure: false, 
    auth: {
        user: process.env.SMTP_USER || "your-email@gmail.com",
        pass: process.env.SMTP_PASS || "your-app-password"
    }
});

//  Step 7: API Routes (Login, Logout, Registration, Protected Routes)

// Root Route
app.get("/", (req, res) => {
    res.json({ message: "Hi! Connected to DB" });
});

//  Registration Route
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

// Login Route (Creates a Session)
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

// Logout Route (Destroys Session)
app.post("/Logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Failed to log out" });
        res.clearCookie("user_sid");
        return res.json({ message: "Logged out successfully" });
    });
});

// Fetch Challans (Protected Route)
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

//  Forgot Password Route
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
// Start the server


//customer data fetching api
app.get('/api/customers', (req, res) => {
    const query = 'SELECT customer_exisitng_id, customer_name, city FROM client_master';
  
    pool.query(query, (err, rows) => {
      if (err) {
        console.error('Error fetching customers:', err);
        return res.status(500).json({ error: 'Failed to fetch customers' });
      }
      res.json(rows); // ✅ rows is defined only inside this callback
    });
  });
 // api to add new client in db
  app.post('/api/clients', async (req, res) => {
    const {
      customer_id, customer_exisitng_id, customer_name, previous_account_number,
      address_1, address_2, gstin, market_code, city, postal_code, region_id,
      region_name, country_id, country_name, cst_no, lst_no, pan_no
    } = req.body;
  
    const sql = `INSERT INTO client_master 
    (customer_id, customer_exisitng_id, customer_name, previous_account_number,
     address_1, address_2, gstin, market_code, city, postal_code, region_id,
     region_name, country_id, country_name, cst_no, lst_no, pan_no) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    pool.query(sql, [
      customer_id, customer_exisitng_id, customer_name, previous_account_number,
      address_1, address_2, gstin, market_code, city, postal_code, region_id,
      region_name, country_id, country_name, cst_no, lst_no, pan_no
    ], (err, result) => {
      if (err) {
        console.error('Insert Error:', err);
        return res.status(500).send('Database error');
      }
      res.send('Client inserted successfully');
    });
  });
  
  // api to take client data via import
app.post("/api/clients/bulk", (req, res) => {
    const clients = req.body.clients;
  
    if (!Array.isArray(clients)) {
      return res.status(400).json({ message: "Invalid input" });
    }
  
    const sql = `
      INSERT INTO client_master (customer_name, city, customer_exisitng_id)
      VALUES ?
    `;
  
    const values = clients.map(c => [c.customer_name, c.city, c.customer_exisitng_id]);
  
    pool.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Bulk insert error:", err);
        return res.status(500).json({ message: "Database insert error" });
      }
      res.json({ message: "Clients imported", inserted: result.affectedRows });
    });
  });
  

  //to take data of clients into client card
  // API endpoint to get client details
app.get('/api/clients/:id', async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM client_master WHERE customer_id = ?`,
        [req.params.id]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching client:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
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


  app.get("/api/user", (req, res) => {
    console.log('Session:', req.session); // Debug logging
    console.log('Cookies:', req.cookies); // Debug logging
    
    if (!req.session.user) {
        console.log('No user in session'); // Debug logging
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.session.user.user_id;

    const sql = `SELECT first_name FROM users WHERE user_id = ?`;
    pool.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const { first_name } = results[0];
        return res.status(200).json({ first_name });
    });
});
//adding new user
app.post('/api/users/add', async (req, res) => {
    const { first_name, last_name, user_name, password, role } = req.body;
  
    if (!first_name || !last_name || !user_name || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const query = `
        INSERT INTO users (first_name, last_name, user_name, password, role)
        VALUES (?, ?, ?, ?, ?)
      `;
      pool.query(query, [first_name, last_name, user_name, hashedPassword, role], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
  
        const newUser = {
          id: result.insertId,
          first_name,
          last_name,
          user_name,
          role
        };
        res.status(201).json(newUser);
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });


//defect detection api

// Get all defects with pagination and filtering
app.get("/api/defects", sessionAuth, (req, res) => {
    const { page = 1, limit = 10, search = '', client = 'All' } = req.query;
    const offset = (page - 1) * limit;

    // Base query
    let query = `
        SELECT d.defect_id, d.pallet_id, d.description, d.defect_date, 
               c.customer_name as client, d.unit, d.challan_id
        FROM defects d
        LEFT JOIN customer_master c ON d.client_id = c.customer_id
        WHERE 1=1
    `;

    const params = [];

    // Add search filter
    if (search) {
        query += ` AND (d.pallet_id LIKE ? OR d.description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    // Add client filter
    if (client && client !== 'All') {
        query += ` AND c.customer_name = ?`;
        params.push(client);
    }

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    // Get total count for pagination
    let countQuery = `
        SELECT COUNT(*) as total 
        FROM defects d
        LEFT JOIN customer_master c ON d.client_id = c.customer_id
        WHERE 1=1
    `;
    
    const countParams = [...params.slice(0, -2)]; // Remove pagination params

    if (search) {
        countQuery += ` AND (d.pallet_id LIKE ? OR d.description LIKE ?)`;
    }

    if (client && client !== 'All') {
        countQuery += ` AND c.customer_name = ?`;
    }

    pool.query(countQuery, countParams, (countErr, countResults) => {
        if (countErr) {
            console.error("Count query error:", countErr);
            return res.status(500).json({ error: "Database error" });
        }

        pool.query(query, params, (err, results) => {
            if (err) {
                console.error("Defects query error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({
                defects: results,
                total: countResults[0].total,
                page: parseInt(page),
                limit: parseInt(limit)
            });
        });
    });
});

// Get unique clients for filter dropdown
app.get("/api/defects/clients", sessionAuth, (req, res) => {
    const query = `
        SELECT DISTINCT c.customer_name as client 
        FROM defects d
        JOIN customer_master c ON d.client_id = c.customer_id
        ORDER BY c.customer_name
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Clients query error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const clients = results.map(row => row.client);
        res.json(["All", ...clients]);
    });
});

// Get single defect by ID
app.get("/api/defects/:id", sessionAuth, (req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT d.*, c.customer_name as client 
        FROM defects d
        LEFT JOIN customer_master c ON d.client_id = c.customer_id
        WHERE d.defect_id = ?
    `;

    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error("Defect query error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Defect not found" });
        }

        res.json(results[0]);
    });
});

// Create new defect
app.post("/api/defects", sessionAuth, (req, res) => {
    const { pallet_id, description, defect_date, client_id, unit, challan_id } = req.body;
    
    if (!pallet_id || !description || !defect_date || !client_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
        INSERT INTO defects 
        (pallet_id, description, defect_date, client_id, unit, challan_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    pool.query(query, 
        [pallet_id, description, defect_date, client_id, unit || 'EA', challan_id || null], 
        (err, result) => {
            if (err) {
                console.error("Defect creation error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.status(201).json({ 
                message: "Defect created successfully",
                defect_id: result.insertId 
            });
        }
    );
});

// Update defect
app.put("/api/defects/:id", sessionAuth, (req, res) => {
    const { id } = req.params;
    const { pallet_id, description, defect_date, client_id, unit, challan_id } = req.body;
    
    if (!pallet_id || !description || !defect_date || !client_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
        UPDATE defects 
        SET pallet_id = ?, description = ?, defect_date = ?, 
            client_id = ?, unit = ?, challan_id = ?
        WHERE defect_id = ?
    `;

    pool.query(query, 
        [pallet_id, description, defect_date, client_id, unit || 'EA', challan_id || null, id], 
        (err, result) => {
            if (err) {
                console.error("Defect update error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Defect not found" });
            }

            res.json({ message: "Defect updated successfully" });
        }
    );
});

// Delete defect
app.delete("/api/defects/:id", sessionAuth, (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM defects WHERE defect_id = ?`;

    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error("Defect deletion error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Defect not found" });
        }

        res.json({ message: "Defect deleted successfully" });
    });
});




// Fetch only specific fields for TransactionTracking page
app.get("/transaction/challans", (req, res) => {
    const query = `
        SELECT 
            vendor_name as client, 
            DATE_FORMAT(issue_date, '%d/%m/%Y') AS date, 
            material_code AS materialCode, 
            challan_no AS challanId, 
            status 
        FROM challans
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching challans:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});


// Get all challans
app.get('/defect/challans', (req, res) => {
    pool.query(
        'SELECT vendor_name AS client, expected_return_date AS `Date of Return`, challan_no AS `Challan ID`, pallet_count AS unit FROM challans',
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(rows);
        }
    );
});



// POST route to add a new inventory item
app.post('/api/inventory/add', (req, res) => {
    const {
      plant,
      material_number,
      material_description,
      storage_location,
      unrestricted,
      base_unit_of_measure,
      value_unrestricted,
    } = req.body;
  
    const query = `
      INSERT INTO inventory 
      (plant, material_number, material_description, storage_location, unrestricted, base_unit_of_measure, value_unrestricted)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    pool.query(
      query,
      [
        plant,
        material_number,
        material_description,
        storage_location,
        unrestricted,
        base_unit_of_measure,
        value_unrestricted,
      ],
      (err, result) => {
        if (err) {
          console.error('Error adding item:', err);
          return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({
          id: result.insertId,
          ...req.body,
        });
      }
    );
  });

//   app specific api

// Get all first names
app.get('/api/firstNames', (req, res) => {
    const query = `SELECT first_name FROM users`;
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        const firstNames = results.map(row => row.first_name); // Ensure `row.first_name` matches the column name
        res.status(200).json({ firstNames });
    });
});

// Get basic challan details with Open status
app.get('/api/challans/dispatch', (req, res) => {
    const query = `
        SELECT 
            vendor_name,
            challan_no,
            pallet_count
        FROM challans
        WHERE status = 'Open'
        ORDER BY challan_id 
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});


// Get open challan details by challan number
app.get('/api/getopenChallanDetails/:challanNo', (req, res) => {
    const challanNo = req.params.challanNo;
    
    const query = `
        SELECT 
            challan_no,
            vendor_name, vendor_address, vendor_code, gstin_no, pan_no,
            challan_date, issue_date, vehicle_no, transporter,
            emp_code, emp_name,
            material_code, material_description, hsn_code, pallet_count,
            expected_return_date
            FROM challans
            WHERE challan_no = ? AND status = 'Open'
    `;

    pool.query(query, [challanNo], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Challan not found or not open' });
        }

        const challan = results[0];
        res.json({
            challan_no: challan.challan_no,
            vendor: {
                name: challan.vendor_name,
                address: challan.vendor_address,
                code: challan.vendor_code,
                gstin: challan.gstin_no,
                pan: challan.pan_no
            },
            challan_info: {
                date: challan.challan_date,
                issue_date: challan.issue_date,
                vehicle_no: challan.vehicle_no,
                transporter: challan.transporter
            },
            employee: {
                code: challan.emp_code,
                name: challan.emp_name
            },
            material: {
                code: challan.material_code,
                description: challan.material_description,
                hsn_code: challan.hsn_code.toString(),
                pallet_count: challan.pallet_count.toString()
            },
            expected_return_date: challan.expected_return_date || 'N/A'
        });
    });
});

// Get basic challan details with In-transit status
app.get('/api/challans/return', (req, res) => {
    const query = `
        SELECT 
            vendor_name,
            challan_no,
            pallet_count
        FROM challans
        WHERE status = 'In-transit'
        ORDER BY challan_id 
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Get in-transit challan details by challan number
app.get('/api/getin-transitChallanDetails/:challanNo', (req, res) => {
    const challanNo = req.params.challanNo;

    const query = `
        SELECT 
            challan_no,
            vendor_name, vendor_address, vendor_code, gstin_no, pan_no,
            challan_date, issue_date, vehicle_no, transporter,
            emp_code, emp_name,
            material_code, material_description, hsn_code, pallet_count,
            expected_return_date
        FROM challans
        WHERE challan_no = ? AND status = 'In-transit'
    `;

    pool.query(query, [challanNo], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Challan not found or not open' });
        }

        const challan = results[0];
        res.json({
            challan_no: challan.challan_no,
            vendor: {
                name: challan.vendor_name,
                address: challan.vendor_address,
                code: challan.vendor_code,
                gstin: challan.gstin_no,
                pan: challan.pan_no
            },
            challan_info: {
                date: challan.challan_date,
                issue_date: challan.issue_date,
                vehicle_no: challan.vehicle_no,
                transporter: challan.transporter
            },
            employee: {
                code: challan.emp_code,
                name: challan.emp_name
            },
            material: {
                code: challan.material_code,
                description: challan.material_description,
                hsn_code: challan.hsn_code.toString(),
                pallet_count: challan.pallet_count.toString()
            },
            expected_return_date: challan.expected_return_date || 'N/A'
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});