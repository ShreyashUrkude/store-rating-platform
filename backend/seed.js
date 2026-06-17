const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function runSeeder() {
    console.log('Initializing automated database seeding routine...');
    try {
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE ratings');
        await db.query('TRUNCATE TABLE stores');
        await db.query('TRUNCATE TABLE users');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✔ Target relational tables truncated cleanly.');

        const passAdmin = await bcrypt.hash('Admin@1234', 10);
        const passOwner1 = await bcrypt.hash('Owner@1234', 10);
        const passOwner2 = await bcrypt.hash('Owner@5678', 10);
        const passUser1 = await bcrypt.hash('User@1234', 10);
        const passUser2 = await bcrypt.hash('User@5678', 10);

        console.log('⚙ Hashing baseline security profile credentials...');

        const [resAdmin] = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            ['System Administrator Root Account', 'admin@platform.com', passAdmin, 'Centralized Cloud Infrastructure Hub Portal 101', 'System Administrator']
        );

        const [resOwner1] = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            ['Corporate Executive Manager Alpha', 'owner_alpha@business.com', passOwner1, 'Commercial Business Complex Suite 40, Mumbai', 'Store Owner']
        );
        const owner1Id = resOwner1.insertId;

        const [resOwner2] = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            ['Corporate Executive Manager Beta', 'owner_beta@business.com', passOwner2, 'Industrial Manufacturing Sector Zone 9, Pune', 'Store Owner']
        );
        const owner2Id = resOwner2.insertId;

        const [resUser1] = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            ['Standard Platform Consumer Profile One', 'user_one@outlook.com', passUser1, 'Residential Apartments Block B-12, Sector 4, Pune', 'Normal User']
        );
        const user1Id = resUser1.insertId;

        const [resUser2] = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            ['Standard Platform Consumer Profile Two', 'user_two@outlook.com', passUser2, 'Metro Living Society Flat No 504, Hinjewadi', 'Normal User']
        );
        const user2Id = resUser2.insertId;

        console.log('✔ Administrative and user profile seeds provisioned.');

        const [resStore1] = await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            ['Apex Tech Outlets & Digital Gadgets', 'contact@apextech.com', 'Tech Park Galleria Mall Floor 1, Hinjewadi, Pune', owner1Id]
        );
        const store1Id = resStore1.insertId;

        const [resStore2] = await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            ['Gourmet Express Culinary Delights', 'orders@gourmetexpress.com', 'High Street Food Arena Avenue 7, Koregaon Park, Pune', owner2Id]
        );
        const store2Id = resStore2.insertId;

        console.log('✔ Commercial storefront enterprise assets bound and registered.');

        await db.query('INSERT INTO ratings (user_id, store_id, rating_value) VALUES (?, ?, ?)', [user1Id, store1Id, 5]);
        await db.query('INSERT INTO ratings (user_id, store_id, rating_value) VALUES (?, ?, ?)', [user2Id, store1Id, 4]);
        await db.query('INSERT INTO ratings (user_id, store_id, rating_value) VALUES (?, ?, ?)', [user1Id, store2Id, 2]);
        await db.query('INSERT INTO ratings (user_id, store_id, rating_value) VALUES (?, ?, ?)', [user2Id, store2Id, 1]);

        console.log('✔ Mock customer review metrics generated and balanced.');
        console.log('\n======================================================');
        console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
        console.log('You can now log in using these preset profiles:');
        console.log('1. Admin: admin@platform.com  | Pass: Admin@1234');
        console.log('2. Owner: owner_alpha@business.com | Pass: Owner@1234');
        console.log('3. User:  user_one@outlook.com    | Pass: User@1234');
        console.log('======================================================');
        
        process.exit(0);
    } catch (err) {
        console.error('CRITICAL: Database environment seed anomaly encountered:', err);
        process.exit(1);
    }
}

runSeeder();