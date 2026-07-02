require('dotenv').config();
const {Pool} = require('pg');

const express = require('express');
const app = express();
const port = 3000;


const pool = new Pool({connectionString: process.env.DATABASE_URL});

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.get("/documents",async(req,res) => {
    const result = await pool.query('SELECT * FROM documents')
    res.json(result.rows)
});

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});

async function testConnection() {
    const res = await pool.query('SELECT NOW()')
    console.log(res);
}
testConnection();