import pool from "../db.js"; 

export const createOwnedStore = async (req, res) => {
    const owner_id = req.user.id; 
    const { name, email, address } = req.body; 
    
    try {
        const { rows } = await pool.query(
            "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, address, owner_id",
            [name, email, address, owner_id]
        );
        
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error("Error in createOwnedStore:", err); 
        
        if (err.code === '23505') { 
            return res.status(409).json({ message: "Store with this email already exists." });
        }

        return res.status(500).json({ 
            message: "Internal Server Error: Database operation failed.",
            detail: err.message, 
            code: err.code || 'N/A'
        });
    }
};

export const listOwnedStores = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM stores WHERE owner_id=$1", [req.user.id]);
        res.json(rows);
    } catch (err) {
        console.error("Error in listOwnedStores:", err);
        res.status(500).json({ message: "Error listing owned stores." });
    }
};

export const getStoreRatings = async (req, res) => {
    const { id } = req.params;
    console.log(`[DEBUG] Fetching ratings for store ID: ${id}`);
    try {
        const { rows } = await pool.query(
            `
            SELECT u.name, u.email, r.rating, r.rated_at
            FROM ratings r
            -- CRITICAL FIX: Cast IDs to TEXT for robust joining, resolving the '0 ratings found' issue
            JOIN users u ON CAST(u.id AS TEXT) = CAST(r.user_id AS TEXT) 
            WHERE r.store_id = $1
            ORDER BY r.rated_at DESC;
            `,
            [id]
        );
        console.log(`[DEBUG] Found ${rows.length} ratings for store ID ${id}.`);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching store ratings:", err);
        res.status(500).json({ message: "Error fetching store ratings." });
    }
};

export const getStoreSummary = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(
            "SELECT COALESCE(AVG(rating), 0)::numeric(3,2) as avg_rating, COUNT(*) as total FROM ratings WHERE store_id=$1",
            [id]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error("Error in getStoreSummary:", err);
        res.status(500).json({ message: "Error fetching store summary." });
    }
};

export const deleteOwnedStore = async (req, res) => {
    const storeId = req.params.storeId; 
    const ownerId = req.user.id; 

    try {
        await pool.query('BEGIN');

        await pool.query('DELETE FROM ratings WHERE store_id = $1', [storeId]);
        
        const result = await pool.query(
            'DELETE FROM stores WHERE id = $1 AND owner_id = $2 RETURNING id', 
            [storeId, ownerId]
        );

        if (result.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: "Store not found or you are not authorized to delete it." });
        }
        
        await pool.query('COMMIT');
        
        res.status(204).send(); 
    } catch (err) {
        await pool.query('ROLLBACK'); 
        console.error(`[DELETE] Error deleting store ${storeId}:`, err);
        res.status(500).json({ message: "An internal server error occurred during store deletion." });
    }
};