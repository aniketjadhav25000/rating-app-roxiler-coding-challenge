import pool from "../db.js";

export const listStores = async (req, res) => {
    const userId = req.user.id;
    const { qName = "", qAddress = "" } = req.query;

    const baseQuery = `
        SELECT 
            s.id, 
            s.name, 
            s.address
        FROM stores s
        -- Using ILIKE for case-insensitive searching
        WHERE s.name ILIKE $1 AND s.address ILIKE $2
        ORDER BY s.name ASC
    `;
    const baseParams = [`%${qName}%`, `%${qAddress}%`];
    
    try {
        const { rows: stores } = await pool.query(baseQuery, baseParams);
        
        const storesWithRatings = await Promise.all(stores.map(async (store) => {
            
            const aggregateQuery = `
                SELECT 
                    COALESCE(AVG(rating), 0)::numeric(3,2) as overall_rating,
                    COUNT(id) as total_ratings_count
                FROM ratings 
                WHERE store_id = $1;
            `;
            
            const userRatingQuery = `
                SELECT rating FROM ratings WHERE store_id = $1 AND user_id = $2;
            `;
            
            try {
                const [{ rows: ratingRows }, { rows: userRatingRows }] = await Promise.all([
                    pool.query(aggregateQuery, [store.id]),
                    pool.query(userRatingQuery, [store.id, userId])
                ]);
                
                return {
                    ...store,
                    overall_rating: ratingRows[0].overall_rating,
                    total_ratings_count: ratingRows[0].total_ratings_count,
                    user_submitted_rating: userRatingRows.length > 0 ? userRatingRows[0].rating : null
                };
            } catch (err) {
                console.error(`Error fetching rating data for store ${store.id}:`, err.message);
                return { 
                    ...store, 
                    overall_rating: '0.00', 
                    total_ratings_count: 0, 
                    user_submitted_rating: null 
                };
            }
        }));

        res.json(storesWithRatings);
    } catch (err) {
        console.error("FATAL ERROR in listStores (Base Query Failed):", err.message); 
        res.status(500).json({ message: "Error listing stores for user." });
    }
};

export const getStore = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM stores WHERE id=$1", [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: "Store not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error("Error in getStore:", err);
        res.status(500).json({ message: "Error fetching store details." });
    }
};

export const submitRating = async (req, res) => {
    const { rating } = req.body;
    const userId = req.user.id;
    const storeId = req.params.id;

    try {
        const { rows } = await pool.query(
            `
            INSERT INTO ratings (store_id, user_id, rating, rated_at) 
            VALUES ($1,$2,$3, NOW()) 
            ON CONFLICT (store_id,user_id)
            DO UPDATE SET 
                rating=EXCLUDED.rating,
                rated_at=NOW() 
            RETURNING *;
            `,
            [storeId, userId, rating]
        );
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error("Error submitting rating:", err); 
        res.status(500).json({ message: "Error submitting or updating rating." });
    }
};

export const updateRating = submitRating;