import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";
import MSSQLStore from "connect-mssql-v2";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import sql from "mssql/msnodesqlv8.js"; // ✅ Important: use the specific driver

dotenv.config();

const app = express();
const port = 8800;

// Generate SESSION_SECRET if not present
if (!process.env.SESSION_SECRET) {
    const generatedSecret = crypto.randomBytes(32).toString("hex");
    fs.appendFileSync(".env", `\nSESSION_SECRET=${generatedSecret}\n`);
    process.env.SESSION_SECRET = generatedSecret;
    console.log("✅ Generated new SESSION_SECRET:", generatedSecret);
}
const SESSION_SECRET = process.env.SESSION_SECRET;

// MS SQL config
const sqlConfig = {
  connectionString:
    "Driver={ODBC Driver 18 for SQL Server};Server=localhost\\SQLEXPRESS;Database=DANApalletDB;Trusted_Connection=Yes;Encrypt=Yes;TrustServerCertificate=Yes;",
  driver: "msnodesqlv8"
};

// Connect and store global pool
let dbPool;
sql.connect(sqlConfig)
    .then(pool => {
        dbPool = pool;
        console.log("✅ Connected using Windows Authentication");
    })
    .catch(err => {
        console.error("❌ DB Connection Error:", err);
    });

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

const sessionStore = new MSSQLStore({ ...sqlConfig });

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 86400000,
        },
    })
);

// Nodemailer setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || "your-email@gmail.com",
        pass: process.env.SMTP_PASS || "your-app-password",
    },
});

// Auth middleware
function sessionAuth(req, res, next) {
    if (req.session.user) return next();
    return res.status(401).json({ error: "Unauthorized" });
}

// Utility to run SQL safely
const runQuery = async (query, inputs = []) => {
    const request = dbPool.request();
    inputs.forEach(({ name, type, value }) => request.input(name, type, value));
    return await request.query(query);
};

// Routes

app.get("/", (req, res) => {
    res.json({ message: "Hi! Connected to MS SQL DB" });
});

app.post("/Registration", async (req, res) => {
    const { first_name, last_name, user_name, password, role, termsAccepted } = req.body;

    if (!first_name || !last_name || !user_name || !password || !termsAccepted) {
        return res.status(400).json({ error: "All fields and terms acceptance are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const formattedRole = role === "security_guard" ? "security guard" : role;

        const sqlQuery = `
            INSERT INTO danadb.users (first_name, last_name, user_name, password, role, created_at)
            VALUES (@first_name, @last_name, @user_name, @password, @role, GETDATE())
        `;

        await runQuery(sqlQuery, [
            { name: "first_name", type: sql.VarChar, value: first_name },
            { name: "last_name", type: sql.VarChar, value: last_name },
            { name: "user_name", type: sql.VarChar, value: user_name },
            { name: "password", type: sql.VarChar, value: hashedPassword },
            { name: "role", type: sql.VarChar, value: formattedRole }
        ]);

        return res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/Login", async (req, res) => {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const sqlQuery = `
            SELECT user_id, user_name, password, role, first_name
            FROM danadb.users
            WHERE user_name = @user_name
        `;

        const result = await runQuery(sqlQuery, [
            { name: "user_name", type: sql.VarChar, value: user_name },
        ]);

        const user = result?.recordset?.[0];

        if (!user) {
            console.warn(`Login attempt failed: user '${user_name}' not found.`);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Debug log (avoid logging passwords)
        console.log("Fetched user from MSSQL:", {
            user_id: user.user_id,
            user_name: user.user_name,
            role: user.role,
            first_name: user.first_name
        });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.warn(`Login failed: password mismatch for '${user_name}'`);
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Set session
        req.session.user = {
            user_id: user.user_id,
            user_name: user.user_name,
            role: user.role,
            first_name: user.first_name,
        };

        return res.status(200).json({
            message: "Login successful",
            user: req.session.user,
            role: user.role,
            first_name: user.first_name
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});


app.post("/Logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Failed to log out" });
        res.clearCookie("user_sid");
        res.json({ message: "Logged out successfully" });
    });
});

app.post("/ForgotPassword", async (req, res) => {
    const { user_name } = req.body;
    if (!user_name) return res.status(400).json({ error: "Email is required" });

    try {
        const result = await runQuery(
            "SELECT user_id FROM users WHERE user_name = @user_name",
            [{ name: "user_name", type: sql.VarChar, value: user_name }]
        );

        if (result.recordset.length === 0)
            return res.status(404).json({ error: "User not found" });

        const resetLink = `http://localhost:3000/ResetPassword/${result.recordset[0].user_id}`;

        await transporter.sendMail({
            from: `"Support Team" <${process.env.SMTP_USER}>`,
            to: user_name,
            subject: "Password Reset Request",
            text: `Click to reset your password:\n\n${resetLink}`,
        });

        res.status(200).json({ Status: "Success", message: "Reset link sent!" });
    } catch (error) {
        console.error("Email error:", error);
        res.status(500).json({ error: "Email failed" });
    }
});

app.get('/users', async (req, res) => {
    const sqlQuery = `
        SELECT user_id, first_name, last_name, user_name, role, created_at
        FROM danadb.users
    `;

    try {
        const result = await runQuery(sqlQuery);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});


app.get("/challans", sessionAuth, async (req, res) => {
    const sqlQuery = "SELECT * FROM danadb.challans";

    try {
        const result = await runQuery(sqlQuery);
        res.json(result.recordset);
    } catch (err) {
        console.error("Database Query Error:", err);
        return res.status(500).json({ error: "Database error", details: err });
    }
});

app.get('/api/customers', async (req, res) => {
    const query = `
        SELECT customer_exisitng_id, customer_name, city
        FROM danadb.client_master
    `;

    try {
        const result = await runQuery(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching customers:', err);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

app.post('/api/clients', async (req, res) => {
    const {
        customer_id, customer_exisitng_id, customer_name, previous_account_number,
        address_1, address_2, gstin, market_code, city, postal_code, region_id,
        region_name, country_id, country_name, cst_no, lst_no, pan_no
    } = req.body;

    const sqlQuery = `
        INSERT INTO danadb.client_master (
            customer_id, customer_exisitng_id, customer_name, previous_account_number,
            address_1, address_2, gstin, market_code, city, postal_code, region_id,
            region_name, country_id, country_name, cst_no, lst_no, pan_no
        )
        VALUES (
            @customer_id, @customer_exisitng_id, @customer_name, @previous_account_number,
            @address_1, @address_2, @gstin, @market_code, @city, @postal_code, @region_id,
            @region_name, @country_id, @country_name, @cst_no, @lst_no, @pan_no
        )
    `;

    try {
        await runQuery(sqlQuery, [
            { name: "customer_id", type: sql.VarChar, value: customer_id },
            { name: "customer_exisitng_id", type: sql.VarChar, value: customer_exisitng_id },
            { name: "customer_name", type: sql.VarChar, value: customer_name },
            { name: "previous_account_number", type: sql.VarChar, value: previous_account_number },
            { name: "address_1", type: sql.VarChar, value: address_1 },
            { name: "address_2", type: sql.VarChar, value: address_2 },
            { name: "gstin", type: sql.VarChar, value: gstin },
            { name: "market_code", type: sql.VarChar, value: market_code },
            { name: "city", type: sql.VarChar, value: city },
            { name: "postal_code", type: sql.VarChar, value: postal_code },
            { name: "region_id", type: sql.VarChar, value: region_id },
            { name: "region_name", type: sql.VarChar, value: region_name },
            { name: "country_id", type: sql.VarChar, value: country_id },
            { name: "country_name", type: sql.VarChar, value: country_name },
            { name: "cst_no", type: sql.VarChar, value: cst_no },
            { name: "lst_no", type: sql.VarChar, value: lst_no },
            { name: "pan_no", type: sql.VarChar, value: pan_no }
        ]);

        res.send("Client inserted successfully");
    } catch (err) {
        console.error('Insert Error:', err);
        return res.status(500).send('Database error');
    }
});

// Fetch devices for Device Management page
app.get('/api/devices', async (req, res) => {
    const query = `
        SELECT 
            device_id, 
            device_name, 
            device_type, 
            ip_address, 
            status, 
            mac_address
        FROM danadb.device_management
    `;

    try {
        const result = await runQuery(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching devices:', err);
        return res.status(500).json({ error: 'Failed to fetch devices' });
    }
});

// delete device by ID
app.delete('/api/devices/:id', async (req, res) => {
    const { id } = req.params;
    const deviceId = parseInt(id);
  
    if (isNaN(deviceId)) {
      return res.status(400).json({ error: 'Invalid device ID' });
    }
  
    const query = `DELETE FROM danadb.device_management WHERE device_id = @id`;
  
    try {
      const pool = await sql.connect(sqlConfig);
      const result = await pool.request()
        .input('id', sql.Int, deviceId)
        .query(query);
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Device not found' });
      }
  
      res.json({ message: 'Device deleted successfully' });
    } catch (err) {
      console.error('Error deleting device:', err); // <-- Check this output
      res.status(500).json({ error: 'Failed to delete device', details: err.message });
    }
  });  

// Edit Device Details
app.put('/api/devices/:id', async (req, res) => {
    const { id } = req.params;
    const { device_name, device_type, ip_address, status, mac_address } = req.body;
  
    const query = `
      UPDATE danadb.device_management
      SET
        device_name = @device_name,
        device_type = @device_type,
        ip_address = @ip_address,
        status = @status,
        mac_address = @mac_address
      WHERE device_id = @id
    `;
  
    try {
      const pool = await sql.connect(sqlConfig);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('device_name', sql.NVarChar, device_name)
        .input('device_type', sql.NVarChar, device_type)
        .input('ip_address', sql.NVarChar, ip_address)
        .input('status', sql.NVarChar, status)
        .input('mac_address', sql.NVarChar, mac_address)
        .query(query);
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: "Device not found" });
      }
  
      res.json({ message: "Device updated successfully" });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ error: "Failed to update device" });
    }
  });

app.get('/api/devices/:id', async (req, res) => {
    const { id } = req.params;
  
    const query = `
      SELECT TOP 1 *
      FROM danadb.device_management
      WHERE device_id = @id
    `;
  
    try {
      const pool = await sql.connect(sqlConfig);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(query);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({ error: 'Device not found' });
      }
  
      res.json(result.recordset[0]);
    } catch (err) {
      console.error("Error fetching device:", err);
      res.status(500).json({ error: "Failed to fetch device" });
    }
  });

// Add new device
app.post('/api/devices', async (req, res) => {
    const { device_name, device_type, ip_address, status, mac_address } = req.body;
  
    const query = `
      INSERT INTO danadb.device_management 
      (device_name, device_type, ip_address, status, mac_address)
      VALUES (@device_name, @device_type, @ip_address, @status, @mac_address)
    `;
  
    try {
      const pool = await sql.connect(sqlConfig);
      await pool.request()
        .input('device_name', sql.VarChar, device_name)
        .input('device_type', sql.VarChar, device_type)
        .input('ip_address', sql.VarChar, ip_address)
        .input('status', sql.VarChar, status)
        .input('mac_address', sql.VarChar, mac_address)
        .query(query);
  
      res.status(201).json({ message: 'Device added successfully' });
    } catch (err) {
      console.error('Error adding device:', err);
      res.status(500).json({ error: 'Failed to add device' });
    }
  });
  

app.post("/api/clients/bulk", async (req, res) => {
    const clients = req.body.clients;

    if (!Array.isArray(clients) || clients.length === 0) {
        return res.status(400).json({ message: "Invalid or empty input" });
    }

    try {
        // Build dynamic VALUES part with parameters
        const valuesSql = clients.map((_, index) => 
            `(@customer_name${index}, @city${index}, @customer_exisitng_id${index})`
        ).join(", ");

        const sqlQuery = `
            INSERT INTO danadb.client_master (customer_name, city, customer_exisitng_id)
            VALUES ${valuesSql}
        `;

        // Build input parameter list
        const params = [];
        clients.forEach((client, index) => {
            params.push({ name: `customer_name${index}`, type: sql.VarChar, value: client.customer_name });
            params.push({ name: `city${index}`, type: sql.VarChar, value: client.city });
            params.push({ name: `customer_exisitng_id${index}`, type: sql.VarChar, value: client.customer_exisitng_id });
        });

        const result = await runQuery(sqlQuery, params);

        res.json({
            message: "Clients imported",
            inserted: result.rowsAffected?.[0] || clients.length
        });
    } catch (err) {
        console.error("Bulk insert error:", err);
        res.status(500).json({ message: "Database insert error" });
    }
});

app.get('/api/clients/:id', async (req, res) => {
    const clientId = req.params.id;

    try {
        const sqlQuery = `
            SELECT * FROM danadb.client_master
            WHERE customer_id = @customer_id
        `;

        const result = await runQuery(sqlQuery, [
            { name: 'customer_id', type: sql.VarChar, value: clientId }
        ]);

        const client = result.recordset[0];

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json(client);
    } catch (err) {
        console.error('Error fetching client:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/api/inventory", async (req, res) => {
    const sqlQuery = `
        SELECT inventory_id, plant, material_number, material_description, 
               storage_location, base_unit_of_measure, unrestricted, value_unrestricted 
        FROM danadb.inventory
    `;

    try {
        const result = await runQuery(sqlQuery);
        res.json(result.recordset);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/api/user", async (req, res) => {
    console.log('Session:', req.session); // Debug logging
    console.log('Cookies:', req.cookies); // Debug logging

    if (!req.session.user) {
        console.log('No user in session'); // Debug logging
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.session.user.user_id;

    const sqlQuery = `
        SELECT first_name FROM danadb.users
        WHERE user_id = @user_id
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'user_id', type: sql.Int, value: userId }
        ]);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const { first_name } = result.recordset[0];
        return res.status(200).json({ first_name });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
    }
});

app.post('/api/users/add', async (req, res) => {
    const { first_name, last_name, user_name, password, role } = req.body;

    if (!first_name || !last_name || !user_name || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sqlQuery = `
            INSERT INTO danadb.users (first_name, last_name, user_name, password, role)
            VALUES (@first_name, @last_name, @user_name, @password, @role);
            SELECT SCOPE_IDENTITY() AS inserted_id;
        `;

        const result = await runQuery(sqlQuery, [
            { name: "first_name", type: sql.VarChar, value: first_name },
            { name: "last_name", type: sql.VarChar, value: last_name },
            { name: "user_name", type: sql.VarChar, value: user_name },
            { name: "password", type: sql.VarChar, value: hashedPassword },
            { name: "role", type: sql.VarChar, value: role }
        ]);

        const insertedId = result.recordset[0]?.inserted_id;

        const newUser = {
            id: insertedId,
            first_name,
            last_name,
            user_name,
            role
        };

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE a user by ID
app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const pool = await sql.connect(sqlConfig);
        await pool.request()
            .input('user_id', sql.Int, userId)
            .query(`DELETE FROM [danadb].[users] WHERE user_id = @user_id`);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


app.get("/api/defects", sessionAuth, async (req, res) => {
    const { page = 1, limit = 10, search = '', client = 'All' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = `WHERE 1=1`;
    const params = [];

    // Add search filters
    if (search) {
        whereClause += ` AND (d.pallet_id LIKE @search OR d.description LIKE @search)`;
        params.push({ name: "search", type: sql.VarChar, value: `%${search}%` });
    }

    // Add client filter
    if (client && client !== 'All') {
        whereClause += ` AND c.customer_name = @client`;
        params.push({ name: "client", type: sql.VarChar, value: client });
    }

    // Total count query
    const countQuery = `
        SELECT COUNT(*) AS total
        FROM danadb.defects d
        LEFT JOIN danadb.customer_master c ON d.client_id = c.customer_id
        ${whereClause}
    `;

    // Paged data query
    const dataQuery = `
        SELECT d.defect_id, d.pallet_id, d.description, d.defect_date, 
               c.customer_name AS client, d.unit, d.challan_id
        FROM danadb.defects d
        LEFT JOIN danadb.customer_master c ON d.client_id = c.customer_id
        ${whereClause}
        ORDER BY d.defect_date DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;

    try {
        const countResult = await runQuery(countQuery, params);
        const total = countResult.recordset[0].total;

        const pagedParams = [
            ...params,
            { name: "offset", type: sql.Int, value: parseInt(offset) },
            { name: "limit", type: sql.Int, value: parseInt(limit) }
        ];

        const dataResult = await runQuery(dataQuery, pagedParams);

        res.json({
            defects: dataResult.recordset,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        console.error("Defects query error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/api/defects/clients", sessionAuth, async (req, res) => {
    const sqlQuery = `
        SELECT DISTINCT c.customer_name AS client 
        FROM danadb.defects d
        JOIN danadb.customer_master c ON d.client_id = c.customer_id
        ORDER BY c.customer_name
    `;

    try {
        const result = await runQuery(sqlQuery);
        const clients = result.recordset.map(row => row.client);
        res.json(["All", ...clients]);
    } catch (err) {
        console.error("Clients query error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/api/defects/:id", sessionAuth, async (req, res) => {
    const { id } = req.params;

    const sqlQuery = `
        SELECT d.*, c.customer_name AS client 
        FROM danadb.defects d
        LEFT JOIN danadb.customer_master c ON d.client_id = c.customer_id
        WHERE d.defect_id = @defect_id
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'defect_id', type: sql.Int, value: parseInt(id) }
        ]);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Defect not found" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Defect query error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

//Create new defect
app.post("/api/defects", sessionAuth, async (req, res) => {
    const { pallet_id, description, defect_date, client_id, unit, challan_id } = req.body;

    if (!pallet_id || !description || !defect_date || !client_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
        INSERT INTO danadb.defects 
        (pallet_id, description, defect_date, client_id, unit, challan_id)
        VALUES (@pallet_id, @description, @defect_date, @client_id, @unit, @challan_id);

        SELECT SCOPE_IDENTITY() AS defect_id;
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'pallet_id', type: sql.VarChar, value: pallet_id },
            { name: 'description', type: sql.VarChar, value: description },
            { name: 'defect_date', type: sql.DateTime, value: defect_date },
            { name: 'client_id', type: sql.Int, value: client_id },
            { name: 'unit', type: sql.VarChar, value: unit || 'EA' },
            { name: 'challan_id', type: sql.Int, value: challan_id || null }
        ]);

        const defect_id = result.recordset[0]?.defect_id;

        res.status(201).json({
            message: "Defect created successfully",
            defect_id
        });
    } catch (err) {
        console.error("Defect creation error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// 🔁 Update defect by ID
// 👉 PUT /api/defects/:id
// ✅ Updates an existing defect record with new details based on defect_id
// 🔒 Requires authentication (sessionAuth)
app.put("/api/defects/:id", sessionAuth, async (req, res) => {
    const { id } = req.params;
    const { pallet_id, description, defect_date, client_id, unit, challan_id } = req.body;

    if (!pallet_id || !description || !defect_date || !client_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
        UPDATE danadb.defects 
        SET pallet_id = @pallet_id,
            description = @description,
            defect_date = @defect_date,
            client_id = @client_id,
            unit = @unit,
            challan_id = @challan_id
        WHERE defect_id = @defect_id
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'pallet_id', type: sql.VarChar, value: pallet_id },
            { name: 'description', type: sql.VarChar, value: description },
            { name: 'defect_date', type: sql.DateTime, value: defect_date },
            { name: 'client_id', type: sql.Int, value: client_id },
            { name: 'unit', type: sql.VarChar, value: unit || 'EA' },
            { name: 'challan_id', type: sql.Int, value: challan_id || null },
            { name: 'defect_id', type: sql.Int, value: parseInt(id) }
        ]);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Defect not found" });
        }

        res.json({ message: "Defect updated successfully" });
    } catch (err) {
        console.error("Defect update error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ❌ Delete defect by ID
// 👉 DELETE /api/defects/:id
// ✅ Removes a defect record based on its defect_id
// 🔒 Requires authentication (sessionAuth)
app.delete("/api/defects/:id", sessionAuth, async (req, res) => {
    const { id } = req.params;

    const sqlQuery = `
        DELETE FROM danadb.defects
        WHERE defect_id = @defect_id
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'defect_id', type: sql.Int, value: parseInt(id) }
        ]);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Defect not found" });
        }

        res.json({ message: "Defect deleted successfully" });
    } catch (err) {
        console.error("Defect deletion error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// 📄 Fetch selected fields for TransactionTracking page
// 👉 GET /transaction/challans
// ✅ Returns challan list with formatted issue date and status
app.get("/transaction/challans", async (req, res) => {
    const sqlQuery = `
        SELECT 
            vendor_name AS client,
            CONVERT(VARCHAR, issue_date, 103) AS date, -- Format: DD/MM/YYYY
            material_code AS materialCode,
            challan_no AS challanId,
            status
        FROM danadb.challans
    `;

    try {
        const result = await runQuery(sqlQuery);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching challans:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// 📦 Get all challans for defect association
// 👉 GET /defect/challans
// ✅ Used to fetch list of challans with client, return date, challan ID, and unit count
app.get('/defect/challans', async (req, res) => {
    const sqlQuery = `
        SELECT 
            vendor_name AS client,
            expected_return_date AS [Date of Return],
            challan_no AS [Challan ID],
            pallet_count AS unit
        FROM danadb.challans
    `;

    try {
        const result = await runQuery(sqlQuery);
        res.json(result.recordset);
    } catch (err) {
        console.error("Challan fetch error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ➕ POST route to add a new inventory item
// 👉 POST /api/inventory/add
// ✅ Adds a new inventory entry with material details and unrestricted quantity
app.post('/api/inventory/add', async (req, res) => {
    const {
        plant,
        material_number,
        material_description,
        storage_location,
        unrestricted,
        base_unit_of_measure,
        value_unrestricted
    } = req.body;

    const sqlQuery = `
        INSERT INTO danadb.inventory 
        (plant, material_number, material_description, storage_location, unrestricted, base_unit_of_measure, value_unrestricted)
        VALUES (@plant, @material_number, @material_description, @storage_location, @unrestricted, @base_unit_of_measure, @value_unrestricted);

        SELECT SCOPE_IDENTITY() AS inserted_id;
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'plant', type: sql.VarChar, value: plant },
            { name: 'material_number', type: sql.VarChar, value: material_number },
            { name: 'material_description', type: sql.VarChar, value: material_description },
            { name: 'storage_location', type: sql.VarChar, value: storage_location },
            { name: 'unrestricted', type: sql.Float, value: unrestricted },
            { name: 'base_unit_of_measure', type: sql.VarChar, value: base_unit_of_measure },
            { name: 'value_unrestricted', type: sql.Float, value: value_unrestricted }
        ]);

        const insertedId = result.recordset[0]?.inserted_id;

        res.status(201).json({
            id: insertedId,
            ...req.body
        });
    } catch (err) {
        console.error('Error adding item:', err);
        res.status(500).json({ error: 'Database insertion error' });
    }
});

// 👥 Client modal popup data fetching
// 👉 GET /api/customers
// ✅ Returns list of all customers with ID, name, and city for dropdowns/modals
app.get('/api/customers', async (req, res) => {
    const sqlQuery = `
        SELECT customer_id, customer_existing_id, customer_name, city
        FROM danadb.client_master
    `;

    try {
        const result = await runQuery(sqlQuery);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching customers:', err);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// 🔍 GET specific customer by ID or existing ID
// 👉 GET /api/customers/:id
// ✅ Used for viewing or editing customer details via customer_id or customer_exisitng_id
app.get('/api/customers/:id', async (req, res) => {
    const customerId = req.params.id;

    console.log(`Fetching customer details for ID: ${customerId}`); // Debug log

    const sqlQuery = `
        SELECT 
            customer_id,
            customer_exisitng_id AS customer_existing_id,
            customer_name,
            previous_account_number,
            address_1,
            address_2,
            gstin,
            market_code,
            city,
            postal_code,
            region_name,
            country_name,
            cst_no,
            lst_no,
            pan_no
        FROM danadb.client_master 
        WHERE customer_id = @customerId OR customer_exisitng_id = @customerId
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'customerId', type: sql.VarChar, value: customerId }
        ]);

        if (result.recordset.length === 0) {
            console.log('No customer found for ID:', customerId); // Debug log
            return res.status(404).json({ error: 'Customer not found' });
        }

        console.log('Found customer:', result.recordset[0]); // Debug log
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
            error: 'Database error',
            details: err.message
        });
    }
});

// 🔍 Fetch client details by customer_id or customer_exisitng_id
// 👉 GET /:id
// ⚠️ Should be mounted under a specific route like /api/clients/:id to avoid route conflict
app.get('/:id', async (req, res) => {
    const { id } = req.params;

    const sqlQuery = `
        SELECT * FROM danadb.client_master
        WHERE customer_id = @id OR customer_exisitng_id = @id
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'id', type: sql.VarChar, value: id }
        ]);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 📦 Route to import multiple customers in bulk
// 👉 POST /api/customers/import
// ✅ Accepts an array of customer objects and inserts them into the database
app.post('/api/customers/import', async (req, res) => {
    try {
        const customers = req.body; // Expected to be an array

        if (!Array.isArray(customers)) {
            return res.status(400).json({ message: 'Invalid data format. Expected an array.' });
        }

        if (customers.length === 0) {
            return res.status(400).json({ message: 'No customers to import.' });
        }

        const fields = ['customer_name', 'city', 'customer_exisitng_id', 'gstin'];

        // Build the VALUES clause dynamically
        const valuePlaceholders = customers.map((_, index) => {
            return `(@customer_name${index}, @city${index}, @customer_exisitng_id${index}, @gstin${index})`;
        }).join(', ');

        const sqlQuery = `
            INSERT INTO danadb.customers (${fields.join(', ')})
            VALUES ${valuePlaceholders}
        `;

        const params = [];
        customers.forEach((customer, index) => {
            params.push({ name: `customer_name${index}`, type: sql.VarChar, value: customer.customer_name || null });
            params.push({ name: `city${index}`, type: sql.VarChar, value: customer.city || null });
            params.push({ name: `customer_exisitng_id${index}`, type: sql.VarChar, value: customer.customer_exisitng_id || null });
            params.push({ name: `gstin${index}`, type: sql.VarChar, value: customer.gstin || null });
        });

        await runQuery(sqlQuery, params);

        console.log('Inserted customers into database.');
        res.status(200).json({ message: 'Customers imported successfully!' });

    } catch (error) {
        console.error('Error inserting customers:', error);
        res.status(500).json({ message: 'Failed to import customers', error: error.message });
    }
});

// ✏️ Edit client details
// 👉 PUT /api/customers/edit/:id
// ✅ Updates an existing client by customer_id or customer_exisitng_id and returns the updated record
app.put('/api/customers/edit/:id', async (req, res) => {
    const { id } = req.params;
    const {
        customer_name,
        address_1,
        address_2,
        city,
        postal_code,
        region_name,
        country_name,
        gstin,
        market_code,
        cst_no,
        lst_no,
        pan_no,
    } = req.body;

    try {
        // Step 1: Check if client exists
        const checkQuery = `
            SELECT * FROM danadb.client_master
            WHERE customer_id = @id OR customer_exisitng_id = @id
        `;
        const checkResult = await runQuery(checkQuery, [
            { name: 'id', type: sql.VarChar, value: id }
        ]);

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Step 2: Update the client
        const updateQuery = `
            UPDATE danadb.client_master
            SET 
                customer_name = @customer_name,
                address_1 = @address_1,
                address_2 = @address_2,
                city = @city,
                postal_code = @postal_code,
                region_name = @region_name,
                country_name = @country_name,
                gstin = @gstin,
                market_code = @market_code,
                cst_no = @cst_no,
                lst_no = @lst_no,
                pan_no = @pan_no
            WHERE customer_id = @id OR customer_exisitng_id = @id
        `;

        const updateResult = await runQuery(updateQuery, [
            { name: 'customer_name', type: sql.VarChar, value: customer_name || null },
            { name: 'address_1', type: sql.VarChar, value: address_1 || null },
            { name: 'address_2', type: sql.VarChar, value: address_2 || null },
            { name: 'city', type: sql.VarChar, value: city || null },
            { name: 'postal_code', type: sql.VarChar, value: postal_code || null },
            { name: 'region_name', type: sql.VarChar, value: region_name || null },
            { name: 'country_name', type: sql.VarChar, value: country_name || null },
            { name: 'gstin', type: sql.VarChar, value: gstin || null },
            { name: 'market_code', type: sql.VarChar, value: market_code || null },
            { name: 'cst_no', type: sql.VarChar, value: cst_no || null },
            { name: 'lst_no', type: sql.VarChar, value: lst_no || null },
            { name: 'pan_no', type: sql.VarChar, value: pan_no || null },
            { name: 'id', type: sql.VarChar, value: id },
        ]);

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(400).json({ error: 'Failed to update client' });
        }

        // Step 3: Return the updated client
        const fetchUpdatedQuery = `
            SELECT * FROM danadb.client_master
            WHERE customer_id = @id OR customer_exisitng_id = @id
        `;

        const updated = await runQuery(fetchUpdatedQuery, [
            { name: 'id', type: sql.VarChar, value: id }
        ]);

        res.json(updated.recordset[0]);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 🗑️ Delete a client by ID or Existing ID
// 👉 DELETE /api/customers/delete/:id
// ✅ Deletes the client if it exists, using either customer_id or customer_exisitng_id
app.delete('/api/customers/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Check if client exists
        const checkQuery = `
            SELECT * FROM danadb.client_master
            WHERE customer_id = @id OR customer_exisitng_id = @id
        `;
        const checkResult = await runQuery(checkQuery, [
            { name: 'id', type: sql.VarChar, value: id }
        ]);

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Step 2: Delete the client
        const deleteQuery = `
            DELETE FROM danadb.client_master
            WHERE customer_id = @id OR customer_exisitng_id = @id
        `;
        const deleteResult = await runQuery(deleteQuery, [
            { name: 'id', type: sql.VarChar, value: id }
        ]);

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(400).json({ error: 'Failed to delete client' });
        }

        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 📋 API endpoint to get all challans
// 👉 GET /api/challans
// ✅ Used in TransactionChallan.jsx to populate challan data
app.get('/api/challans', async (req, res) => {
    const sqlQuery = `
        SELECT 
            c.challan_no, 
            c.challan_date,
            c.vendor_name, 
            c.vendor_address, 
            c.vendor_code, 
            c.gstin_no, 
            c.pan_no,
            c.vehicle_no, 
            c.transporter,
            c.emp_code, 
            c.emp_name,
            c.material_code, 
            c.material_description, 
            c.hsn_code, 
            c.pallet_count,
            c.taxable_amount,
            c.basic_amount,
            c.cgst_rate,
            c.cgst_amount,
            c.sgst_rate,
            c.sgst_amount,
            c.igst_rate,
            c.igst_amount,
            c.total_amount,
            c.remarks,
            c.digitally_signed_by,
            c.signed_on,
            c.authorised_by
        FROM danadb.challans c
        ORDER BY c.challan_date DESC
    `;

    try {
        const result = await runQuery(sqlQuery);
        const formattedResults = result.recordset.map(challan => ({
            challan_no: challan.challan_no,
            challan_date: challan.challan_date,
            vendor_name: challan.vendor_name,
            vendor_address: challan.vendor_address,
            vendor_code: challan.vendor_code,
            gstin_no: challan.gstin_no,
            pan_no: challan.pan_no,
            vehicle_no: challan.vehicle_no,
            transporter: challan.transporter,
            emp_code: challan.emp_code,
            emp_name: challan.emp_name,
            material_code: challan.material_code,
            material_description: challan.material_description,
            hsn_code: challan.hsn_code,
            pallet_count: parseFloat(challan.pallet_count),
            taxable_amount: parseFloat(challan.taxable_amount || 0),
            basic_amount: parseFloat(challan.basic_amount || 0),
            cgst_rate: parseFloat(challan.cgst_rate || 0),
            cgst_amount: parseFloat(challan.cgst_amount || 0),
            sgst_rate: parseFloat(challan.sgst_rate || 0),
            sgst_amount: parseFloat(challan.sgst_amount || 0),
            igst_rate: parseFloat(challan.igst_rate || 0),
            igst_amount: parseFloat(challan.igst_amount || 0),
            total_amount: parseFloat(challan.total_amount || 0),
            remarks: challan.remarks || 'N/A',
            digitally_signed_by: challan.digitally_signed_by || '',
            signed_on: challan.signed_on || new Date(),
            authorised_by: challan.authorised_by || ''
        }));

        res.status(200).json(formattedResults);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 📄 Get specific open challan details by challan number
// 👉 GET /api/getopenChallanDetails/:challanNo
// ✅ Returns a challan record if it exists and has status 'Open'
app.get('/api/getopenChallanDetails/:challanNo', async (req, res) => {
    const challanNo = req.params.challanNo;

    const sqlQuery = `
        SELECT 
            challan_no,
            vendor_name, vendor_address, vendor_code, gstin_no, pan_no,
            challan_date, vehicle_no, transporter,
            emp_code, emp_name,
            material_code, material_description, hsn_code, pallet_count,
            taxable_amount, basic_amount,
            cgst_rate, cgst_amount, 
            sgst_rate, sgst_amount,
            igst_rate, igst_amount,
            total_amount, remarks,
            digitally_signed_by, signed_on, authorised_by
        FROM danadb.challans
        WHERE challan_no = @challan_no AND status = 'Open'
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'challan_no', type: sql.VarChar, value: challanNo }
        ]);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Challan not found or not open' });
        }

        const challan = result.recordset[0];
        res.json({
            challan_no: challan.challan_no,
            challan_date: challan.challan_date,
            vendor_name: challan.vendor_name,
            vendor_address: challan.vendor_address,
            vendor_code: challan.vendor_code,
            gstin_no: challan.gstin_no,
            pan_no: challan.pan_no,
            vehicle_no: challan.vehicle_no,
            transporter: challan.transporter,
            emp_code: challan.emp_code,
            emp_name: challan.emp_name,
            material_code: challan.material_code,
            material_description: challan.material_description,
            hsn_code: challan.hsn_code,
            pallet_count: parseFloat(challan.pallet_count),
            taxable_amount: parseFloat(challan.taxable_amount || 0),
            basic_amount: parseFloat(challan.basic_amount || 0),
            cgst_rate: parseFloat(challan.cgst_rate || 0),
            cgst_amount: parseFloat(challan.cgst_amount || 0),
            sgst_rate: parseFloat(challan.sgst_rate || 0),
            sgst_amount: parseFloat(challan.sgst_amount || 0),
            igst_rate: parseFloat(challan.igst_rate || 0),
            igst_amount: parseFloat(challan.igst_amount || 0),
            total_amount: parseFloat(challan.total_amount || 0),
            remarks: challan.remarks || 'N/A',
            digitally_signed_by: challan.digitally_signed_by || '',
            signed_on: challan.signed_on || new Date(),
            authorised_by: challan.authorised_by || ''
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 🚚 Get in-transit challans for return processing
// 👉 GET /api/challans/return
// ✅ Returns challans with status 'In-transit' sorted by challan_date DESC
app.get('/api/challans/return', async (req, res) => {
    const sqlQuery = `
        SELECT 
            challan_no,
            vendor_name,
            pallet_count,
            challan_date,
            material_code,
            material_description
        FROM danadb.challans
        WHERE status = 'In-transit'
        ORDER BY challan_date DESC
    `;

    try {
        const result = await runQuery(sqlQuery);

        const formattedResults = result.recordset.map(challan => ({
            challan_no: challan.challan_no,
            vendor_name: challan.vendor_name,
            pallet_count: parseFloat(challan.pallet_count),
            challan_date: challan.challan_date,
            material_code: challan.material_code,
            material_description: challan.material_description
        }));

        res.status(200).json(formattedResults);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 🔄 Update challan status to 'Returned'
// 👉 PUT /api/challans/return/:challanNo
// ✅ Marks the challan as returned with return metadata
app.put('/api/challans/return/:challanNo', async (req, res) => {
    const challanNo = req.params.challanNo;
    const { actual_return_date, received_by, condition, remarks } = req.body;

    const sqlQuery = `
        UPDATE danadb.challans
        SET 
            status = 'Returned',
            actual_return_date = @actual_return_date,
            received_by = @received_by,
            condition_on_return = @condition,
            return_remarks = @remarks
        WHERE challan_no = @challan_no AND status = 'In-transit'
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'actual_return_date', type: sql.DateTime, value: actual_return_date },
            { name: 'received_by', type: sql.VarChar, value: received_by },
            { name: 'condition', type: sql.VarChar, value: condition },
            { name: 'remarks', type: sql.VarChar, value: remarks },
            { name: 'challan_no', type: sql.VarChar, value: challanNo }
        ]);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Challan not found or not in-transit' });
        }

        res.status(200).json({ message: 'Challan status updated to Returned' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 📄 Get a specific challan by challan number
// 👉 GET /api/challans/:challan_no
// ✅ Returns all details for the given challan number
app.get('/api/challans/:challan_no', async (req, res) => {
    const { challan_no } = req.params;

    const sqlQuery = `
        SELECT 
            c.challan_no, 
            c.challan_date,
            c.vendor_name, 
            c.vendor_address, 
            c.vendor_code, 
            c.gstin_no, 
            c.pan_no,
            c.vehicle_no, 
            c.transporter,
            c.emp_code, 
            c.emp_name,
            c.material_code, 
            c.material_description, 
            c.hsn_code, 
            c.pallet_count,
            c.taxable_amount,
            c.basic_amount,
            c.cgst_rate,
            c.cgst_amount,
            c.sgst_rate,
            c.sgst_amount,
            c.igst_rate,
            c.igst_amount,
            c.total_amount,
            c.remarks,
            c.digitally_signed_by,
            c.signed_on,
            c.authorised_by,
            c.status
        FROM danadb.challans c
        WHERE c.challan_no = @challan_no
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'challan_no', type: sql.VarChar, value: challan_no }
        ]);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Challan not found' });
        }

        const challan = result.recordset[0];
        res.json({
            challan_no: challan.challan_no,
            challan_date: challan.challan_date,
            vendor_name: challan.vendor_name,
            vendor_address: challan.vendor_address,
            vendor_code: challan.vendor_code,
            gstin_no: challan.gstin_no,
            pan_no: challan.pan_no,
            vehicle_no: challan.vehicle_no,
            transporter: challan.transporter,
            emp_code: challan.emp_code,
            emp_name: challan.emp_name,
            material_code: challan.material_code,
            material_description: challan.material_description,
            hsn_code: challan.hsn_code,
            pallet_count: parseFloat(challan.pallet_count),
            taxable_amount: parseFloat(challan.taxable_amount || 0),
            basic_amount: parseFloat(challan.basic_amount || 0),
            cgst_rate: parseFloat(challan.cgst_rate || 0),
            cgst_amount: parseFloat(challan.cgst_amount || 0),
            sgst_rate: parseFloat(challan.sgst_rate || 0),
            sgst_amount: parseFloat(challan.sgst_amount || 0),
            igst_rate: parseFloat(challan.igst_rate || 0),
            igst_amount: parseFloat(challan.igst_amount || 0),
            total_amount: parseFloat(challan.total_amount || 0),
            remarks: challan.remarks || 'N/A',
            digitally_signed_by: challan.digitally_signed_by || '',
            signed_on: challan.signed_on || new Date(),
            authorised_by: challan.authorised_by || '',
            status: challan.status || 'Unknown'
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 🔁 Update challan status
// 👉 PUT /api/challans/:challan_no/status
// ✅ Updates the status field of a challan to one of: 'Open', 'In Transit', or 'Closed'
app.put('/api/challans/:challan_no/status', async (req, res) => {
    const { challan_no } = req.params;
    const { status } = req.body;

    if (!['Open', 'In Transit', 'Closed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    const sqlQuery = `
        UPDATE danadb.challans
        SET status = @status
        WHERE challan_no = @challan_no
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'status', type: sql.VarChar, value: status },
            { name: 'challan_no', type: sql.VarChar, value: challan_no }
        ]);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Challan not found' });
        }

        res.json({ message: 'Challan status updated successfully' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 📋 Get all possible challan status options
// 👉 GET /api/challans/status-options
// ✅ Returns static list of filter options for challan status
app.get('/api/challans/status-options', (req, res) => {
    res.json(['All', 'Open', 'In Transit', 'Closed']);
});

// 👤 Get unique vendor names (clients) for filtering challans
// 👉 GET /api/challans/clients
// ✅ Returns distinct vendor_name values used as client filter options
app.get('/api/challans/clients', async (req, res) => {
    const sqlQuery = `
        SELECT DISTINCT vendor_name AS client 
        FROM danadb.challans
        ORDER BY vendor_name
    `;

    try {
        const result = await runQuery(sqlQuery);
        const clients = result.recordset.map(row => row.client);
        res.json(['All', ...clients]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 🔍 Search challans with filters
// 👉 GET /api/challans/search?searchTerm=&client=All&status=All
// ✅ Allows filtering by vendor name, challan number, material code, client, and status
app.get('/api/challans/search', async (req, res) => {
    const { searchTerm = '', client = 'All', status = 'All' } = req.query;

    let sqlQuery = `
        SELECT 
            vendor_name AS client, 
            CONVERT(VARCHAR, challan_date, 103) AS date, 
            material_code AS materialCode, 
            challan_no AS challanId, 
            status 
        FROM danadb.challans
        WHERE 1=1
    `;

    const params = [];

    if (searchTerm) {
        sqlQuery += ` AND (vendor_name LIKE @searchTerm OR material_code LIKE @searchTerm OR challan_no LIKE @searchTerm)`;
        params.push({ name: 'searchTerm', type: sql.VarChar, value: `%${searchTerm}%` });
    }

    if (client !== 'All') {
        sqlQuery += ` AND vendor_name = @client`;
        params.push({ name: 'client', type: sql.VarChar, value: client });
    }

    if (status !== 'All') {
        sqlQuery += ` AND status = @status`;
        params.push({ name: 'status', type: sql.VarChar, value: status });
    }

    try {
        const result = await runQuery(sqlQuery, params);
        res.json(result.recordset);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 🏢 Get all suppliers
// 👉 GET /api/suppliers
// ✅ Fetches supplier_id, name, contact, email, and address from supplier_master
app.get('/api/suppliers', async (req, res) => {
    const sqlQuery = `
        SELECT 
            supplier_id, 
            supplier_name, 
            contact_number, 
            email, 
            address 
        FROM danadb.supplier_master
    `;

    try {
        const result = await runQuery(sqlQuery);
        console.log('Fetched suppliers:', result.recordset); // Debug log
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching suppliers:', err);
        res.status(500).json({ error: 'Error fetching suppliers' });
    }
});

// 🔍 Get single supplier by ID
// 👉 GET /api/suppliers/:id
// ✅ Fetches a supplier's basic details from supplier_master by supplier_id
app.get('/api/suppliers/:id', async (req, res) => {
    const { id } = req.params;

    const sqlQuery = `
        SELECT 
            supplier_id, 
            supplier_name, 
            contact_number, 
            email, 
            address 
        FROM danadb.supplier_master 
        WHERE supplier_id = @id
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'id', type: sql.Int, value: parseInt(id) }
        ]);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching supplier:', err);
        res.status(500).json({ error: 'Error fetching supplier' });
    }
});

// ➕ Create new supplier
// 👉 POST /api/add/suppliers
// ✅ Adds a new supplier to danadb.supplier_master after validating input
app.post('/api/add/suppliers', async (req, res) => {
    const { supplier_name, contact_number, email, address } = req.body;

    // Basic validation
    if (!supplier_name || !contact_number || !email || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (typeof supplier_name !== 'string' || supplier_name.length > 255) {
        return res.status(400).json({ error: 'Invalid supplier name' });
    }
    if (typeof contact_number !== 'string' || contact_number.length > 20) {
        return res.status(400).json({ error: 'Invalid contact number' });
    }
    if (typeof email !== 'string' || email.length > 255 || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    if (typeof address !== 'string') {
        return res.status(400).json({ error: 'Invalid address' });
    }

    const sqlQuery = `
        INSERT INTO danadb.supplier_master (supplier_name, contact_number, email, address)
        VALUES (@supplier_name, @contact_number, @email, @address);
        SELECT SCOPE_IDENTITY() AS supplier_id;
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'supplier_name', type: sql.VarChar, value: supplier_name },
            { name: 'contact_number', type: sql.VarChar, value: contact_number },
            { name: 'email', type: sql.VarChar, value: email },
            { name: 'address', type: sql.VarChar, value: address }
        ]);

        const supplier_id = result.recordset[0].supplier_id;

        res.status(201).json({
            supplier_id,
            supplier_name,
            contact_number,
            email,
            address
        });
    } catch (err) {
        console.error('Error creating supplier:', {
            message: err.message,
            code: err.code,
            number: err.number
        });

        if (
            err.originalError &&
            err.originalError.info &&
            err.originalError.info.message &&
            err.originalError.info.message.includes('duplicate')
        ) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        return res.status(500).json({ error: 'Error creating supplier', details: err.message });
    }
});

// ✏️ Update supplier
// 👉 PUT /api/suppliers/:id
// ✅ Updates the specified supplier with new data
app.put('/api/suppliers/:id', async (req, res) => {
    const { id } = req.params;
    const { supplier_name, contact_number, email, address } = req.body;

    // Input validation
    if (!supplier_name || !contact_number || !email || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sqlQuery = `
        UPDATE danadb.supplier_master
        SET 
            supplier_name = @supplier_name,
            contact_number = @contact_number,
            email = @email,
            address = @address
        WHERE supplier_id = @supplier_id
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'supplier_name', type: sql.VarChar, value: supplier_name },
            { name: 'contact_number', type: sql.VarChar, value: contact_number },
            { name: 'email', type: sql.VarChar, value: email },
            { name: 'address', type: sql.VarChar, value: address },
            { name: 'supplier_id', type: sql.Int, value: parseInt(id) }
        ]);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        res.json({
            supplier_id: id,
            supplier_name,
            contact_number,
            email,
            address
        });
    } catch (err) {
        console.error('Error updating supplier:', err);
        res.status(500).json({ error: 'Error updating supplier', details: err.message });
    }
});

// 🗑️ Delete supplier by ID
// 👉 DELETE /api/suppliers/:id
// ✅ Removes supplier from danadb.supplier_master if it exists
app.delete('/api/suppliers/:id', async (req, res) => {
    const { id } = req.params;

    const sqlQuery = `
        DELETE FROM danadb.supplier_master 
        WHERE supplier_id = @supplier_id
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'supplier_id', type: sql.Int, value: parseInt(id) }
        ]);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        res.status(204).send(); // No Content
    } catch (err) {
        console.error('Error deleting supplier:', err);
        res.status(500).json({ error: 'Error deleting supplier', details: err.message });
    }
});

// App Specific Challans

// 🙋‍♂️ Get all first names from users
// 👉 GET /api/firstNames
// ✅ Returns array of all first_name values from danadb.users
app.get('/api/firstNames', async (req, res) => {
    const sqlQuery = `SELECT first_name FROM danadb.users`;

    try {
        const result = await runQuery(sqlQuery);
        const firstNames = result.recordset.map(row => row.first_name);
        res.status(200).json({ firstNames });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 📦 Get basic challan details with Open status (for Dispatch page)
// 👉 GET /api/challans-dispatch
// ✅ Returns vendor name, challan number, and pallet count where status is 'Open'
app.get('/api/challans-dispatch', async (req, res) => {
    const sqlQuery = `
        SELECT 
            vendor_name,
            challan_no,
            pallet_count
        FROM danadb.challans
        WHERE status = 'Open'
        ORDER BY challan_id
    `;

    try {
        const result = await runQuery(sqlQuery);

        console.log('Query Results:', result.recordset); // Debug log

        if (!result.recordset || result.recordset.length === 0) {
            console.log('No open challans found'); // Debug log
            return res.status(404).json({ error: 'Challan not found' });
        }

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 📄 Get open challan details by challan number
// 👉 GET /api/getopenChallanDetails/:challanNo
// ✅ Returns structured challan details if status is 'Open'
app.get('/api/getopenChallanDetails/:challanNo', async (req, res) => {
    const challanNo = req.params.challanNo;

    const sqlQuery = `
        SELECT 
            challan_no,
            vendor_name, vendor_address, vendor_code, gstin_no, pan_no,
            challan_date, issue_date, vehicle_no, transporter,
            emp_code, emp_name,
            material_code, material_description, hsn_code, pallet_count,
            expected_return_date
        FROM danadb.challans
        WHERE challan_no = @challan_no AND status = 'Open'
    `;

    try {
        const result = await runQuery(sqlQuery, [
            { name: 'challan_no', type: sql.VarChar, value: challanNo }
        ]);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Challan not found or not open' });
        }

        const challan = result.recordset[0];

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
                hsn_code: challan.hsn_code?.toString() || '',
                pallet_count: challan.pallet_count?.toString() || '0'
            },
            expected_return_date: challan.expected_return_date || 'N/A'
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 🚚 Get basic challan details with In-transit status
// 👉 GET /api/challans/return
// ✅ Returns challan_no, vendor_name, pallet_count
// app.get('/api/challans/return', async (req, res) => {
//     const sqlQuery = `
//         SELECT 
//             vendor_name,
//             challan_no,
//             pallet_count
//         FROM danadb.challans
//         WHERE status = 'In-transit'
//         ORDER BY challan_id
//     `;

//     try {
//         const result = await runQuery(sqlQuery);
//         res.status(200).json(result.recordset);
//     } catch (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// 📦 Get in-transit challan details by challan number
// 👉 GET /api/getin-transitChallanDetails/:challanNo
// ✅ Returns structured challan details if status is 'In-transit'
// app.get('/api/getin-transitChallanDetails/:challanNo', async (req, res) => {
//     const challanNo = req.params.challanNo;

//     const sqlQuery = `
//         SELECT 
//             challan_no,
//             vendor_name, vendor_address, vendor_code, gstin_no, pan_no,
//             challan_date, issue_date, vehicle_no, transporter,
//             emp_code, emp_name,
//             material_code, material_description, hsn_code, pallet_count,
//             expected_return_date
//         FROM danadb.challans
//         WHERE challan_no = @challan_no AND status = 'In-transit'
//     `;

//     try {
//         const result = await runQuery(sqlQuery, [
//             { name: 'challan_no', type: sql.VarChar, value: challanNo }
//         ]);

//         if (result.recordset.length === 0) {
//             return res.status(404).json({ error: 'Challan not found or not in-transit' });
//         }

//         const challan = result.recordset[0];
//         res.json({
//             challan_no: challan.challan_no,
//             vendor: {
//                 name: challan.vendor_name,
//                 address: challan.vendor_address,
//                 code: challan.vendor_code,
//                 gstin: challan.gstin_no,
//                 pan: challan.pan_no
//             },
//             challan_info: {
//                 date: challan.challan_date,
//                 issue_date: challan.issue_date,
//                 vehicle_no: challan.vehicle_no,
//                 transporter: challan.transporter
//             },
//             employee: {
//                 code: challan.emp_code,
//                 name: challan.emp_name
//             },
//             material: {
//                 code: challan.material_code,
//                 description: challan.material_description,
//                 hsn_code: challan.hsn_code?.toString() || '',
//                 pallet_count: challan.pallet_count?.toString() || '0'
//             },
//             expected_return_date: challan.expected_return_date || 'N/A'
//         });
//     } catch (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});