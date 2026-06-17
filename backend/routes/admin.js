const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken, authorizeRoles('System Administrator'));

router.get('/dashboard-stats', async (req, res, next) => {
    try {
        const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
        const [[{ totalStores }]] = await db.query('SELECT COUNT(*) as totalStores FROM stores');
        const [[{ totalRatings }]] = await db.query('SELECT COUNT(*) as totalRatings FROM ratings');
        res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        next(err);
    }
});

router.post('/users', async (req, res, next) => {
    const { name, email, password, address, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );
        res.status(201).json({ message: 'User provisioned successfully' });
    } catch (err) {
        next(err);
    }
});

router.post('/stores', async (req, res, next) => {
    const { name, email, address, ownerId } = req.body;
    try {
        await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, ownerId || null]
        );
        res.status(201).json({ message: 'Store provisioned successfully' });
    } catch (err) {
        next(err);
    }
});

router.get('/stores-list', async (req, res, next) => {
    const { search = '', sortBy = 'name', order = 'ASC' } = req.query;
    const allowedSortFields = ['name', 'email', 'address', 'avg_rating'];
    const validatedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const validatedOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    try {
        const query = `
            SELECT s.id, s.name, s.email, s.address, COALESCE(AVG(r.rating_value), 0) as avg_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?
            GROUP BY s.id
            ORDER BY ${validatedSortBy} ${validatedOrder}
        `;
        const searchPattern = `%${search}%`;
        const [stores] = await db.query(query, [searchPattern, searchPattern, searchPattern]);
        res.json(stores);
    } catch (err) {
        next(err);
    }
});

router.get('/users-list', async (req, res, next) => {
    const { search = '', sortBy = 'name', order = 'ASC' } = req.query;
    const allowedSortFields = ['name', 'email', 'address', 'role'];
    const validatedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const validatedOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    try {
        const query = `
            SELECT u.id, u.name, u.email, u.address, u.role, COALESCE(AVG(r.rating_value), 0) as user_store_rating
            FROM users u
            LEFT JOIN stores s ON u.id = s.owner_id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ? OR u.role LIKE ?
            GROUP BY u.id
            ORDER BY ${validatedSortBy} ${validatedOrder}
        `;
        const searchPattern = `%${search}%`;
        const [users] = await db.query(query, [searchPattern, searchPattern, searchPattern, searchPattern]);
        res.json(users);
    } catch (err) {
        next(err);
    }
});

module.exports = router;