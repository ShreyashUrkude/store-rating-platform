const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken, authorizeRoles('Store Owner'));

router.get('/my-store-stats', async (req, res, next) => {
    try {
        const [stores] = await db.query('SELECT * FROM stores WHERE owner_id = ?', [req.user.id]);
        if (stores.length === 0) {
            return res.status(444).json({ message: 'No registered storefront entity linked to this owner profile' });
        }

        const store = stores[0];
        const [[{ avgRating, totalRatings }]] = await db.query(
            'SELECT COALESCE(AVG(rating_value), 0) as avgRating, COUNT(*) as totalRatings FROM ratings WHERE store_id = ?',
            [store.id]
        );

        const [breakdown] = await db.query(
            'SELECT rating_value as rating, COUNT(*) as count FROM ratings WHERE store_id = ? GROUP BY rating_value ORDER BY rating_value DESC',
            [store.id]
        );

        res.json({
            storeName: store.name,
            storeEmail: store.email,
            storeAddress: store.address,
            avgRating: parseFloat(avgRating).toFixed(1),
            totalRatings,
            breakdown
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;