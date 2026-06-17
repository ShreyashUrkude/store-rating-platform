const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken, authorizeRoles('Normal User'));

router.get('/stores', async (req, res, next) => {
    const { search = '' } = req.query;
    try {
        const query = `
            SELECT s.id, s.name, s.email, s.address, 
                   COALESCE(AVG(r.rating_value), 0) as avg_rating,
                   COUNT(r.id) as total_reviews,
                   MAX(CASE WHEN r.user_id = ? THEN r.rating_value END) as personal_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.name LIKE ? OR s.address LIKE ?
            GROUP BY s.id
            ORDER BY s.name ASC
        `;
        const searchPattern = `%${search}%`;
        const [stores] = await db.query(query, [req.user.id, searchPattern, searchPattern]);
        res.json(stores);
    } catch (err) {
        next(err);
    }
});

router.post('/rate', async (req, res, next) => {
    const { storeId, ratingValue } = req.body;
    const userId = req.user.id;

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({ message: 'Rating value must scale between 1 and 5' });
    }

    try {
        const query = `
            INSERT INTO ratings (user_id, store_id, rating_value) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating_value = VALUES(rating_value)
        `;
        await db.query(query, [userId, storeId, ratingValue]);
        res.json({ message: 'Rating submitted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;