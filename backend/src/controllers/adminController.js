import pool from "../db.js";
import bcrypt from "bcrypt";

export const getDashboard = async (req, res) => {
    try {
        const query = `
            SELECT
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM stores) AS total_stores,
                (SELECT COUNT(*) FROM ratings) AS total_ratings;
        `;
        const { rows } = await pool.query(query);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching dashboard data." });
    }
};

export const createUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const validRole = ["admin", "user", "owner"].includes(role) ? role : "user";
        
        const { rows } = await pool.query(
            "INSERT INTO users (name,email,password_hash,address,role) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING RETURNING id,name,email,role",
            [name, email, hashed, address, validRole]
        );
        
        if (rows.length === 0) {
            return res.status(409).json({ message: "User with this email already exists." });
        }
        
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error creating user." });
    }
};

export const listUsers = async (req, res) => {
    const {
        qName = "", qEmail = "", qAddress = "", role = "",
        sortField = "name", sortOrder = "ASC"
    } = req.query;

    const allowedFields = ["name", "email", "address", "role"];
    const safeSortField = allowedFields.includes(sortField.toLowerCase()) ? sortField : "name";
    const safeSortOrder = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const query = `
        SELECT id, name, email, address, role
        FROM users
        WHERE name ILIKE $1 
        AND email ILIKE $2 
        AND address ILIKE $3
        ${role ? "AND role=$4" : ""}
        ORDER BY ${safeSortField} ${safeSortOrder}
    `;
    
    const params = role
        ? [`%${qName}%`, `%${qEmail}%`, `%${qAddress}%`, role]
        : [`%${qName}%`, `%${qEmail}%`, `%${qAddress}%`];
        
    try {
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error listing users." });
    }
};

export const getUserDetails = async (req, res) => {
    const query = `
        SELECT 
            u.id, u.name, u.email, u.address, u.role,
            COALESCE(AVG(r.rating), NULL)::numeric(3,2) as owner_avg_rating
        FROM users u
        LEFT JOIN stores s ON s.owner_id = u.id
        LEFT JOIN ratings r ON r.store_id = s.id
        WHERE u.id=$1
        GROUP BY u.id, u.name, u.email, u.address, u.role
    `;
    try {
        const { rows } = await pool.query(query, [req.params.id]);
        
        if (!rows.length) return res.status(404).json({ message: "User not found" });
        
        const user = rows[0];
        
        if (user.role !== 'owner') {
            delete user.owner_avg_rating;
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user details." });
    }
};

export const listStores = async (req, res) => {
    const {
        qName = "", qEmail = "", qAddress = "",
        sortField = "name", sortOrder = "ASC"
    } = req.query;

    const allowedFields = ["name", "email", "address", "avg_rating"];
    const safeSortField = allowedFields.includes(sortField.toLowerCase()) ? sortField : "name";
    const safeSortOrder = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
    
    const query = `
        SELECT 
            s.id, s.name, s.email, s.address, 
            COALESCE(AVG(r.rating),0)::numeric(3,2) as avg_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.name ILIKE $1 AND s.email ILIKE $2 AND s.address ILIKE $3
        GROUP BY s.id
        ORDER BY ${safeSortField} ${safeSortOrder}
    `;
    
    const params = [`%${qName}%`, `%${qEmail}%`, `%${qAddress}%`];

    try {
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Error listing stores." });
    }
};

export const createStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;
    try {
        const { rows } = await pool.query(
            "INSERT INTO stores (name,email,address,owner_id) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING RETURNING *",
            [name, email, address, owner_id]
        );
        
        if (rows.length === 0) {
            return res.status(409).json({ message: "Store with this email already exists." });
        }
        
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error creating store. Check if owner_id exists and is unique." });
    }
};




export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
    
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(204).send(); 
    } catch (err) {
        console.error(`[ADMIN DELETE] Error deleting user ${userId}:`, err);
        res.status(500).json({ message: "An internal server error occurred during user deletion." });
    }
};


export const deleteStore = async (req, res) => {
    const storeId = req.params.id; 

    try {
        
        await pool.query('BEGIN');

        
        await pool.query('DELETE FROM ratings WHERE store_id = $1', [storeId]);

       
        const result = await pool.query(
            'DELETE FROM stores WHERE id = $1 RETURNING id',
            [storeId]
        );

        if (result.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: "Store not found." });
        }
        
   
        await pool.query('COMMIT');

        res.status(204).send(); 
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(`[ADMIN DELETE] Error deleting store ${storeId}:`, err);
        res.status(500).json({ message: "An internal server error occurred during store deletion." });
    }
};