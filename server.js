const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const corsOptions = {
    origin: [
        "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required by Neon
    keepAlive: true, // avoid idle‑TCP closes
    idleTimeoutMillis: 0, // let Neon decide when to drop
    connectionTimeoutMillis: 10000 // fail fast instead of hanging
});

pool.connect()
    .then(() => console.log('✅ Connected to Neon PostgreSQL!'))
    .catch(err => console.error('❌ Failed to connect to Neon PostgreSQL:', err));

app.get('/users', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error('Error querying DB:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(5000, () => {
    console.log('Backend running at http://localhost:5000');
});