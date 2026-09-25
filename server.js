require('dotenv').config();
const app = require('./app');
const pool = require('./config/db')

const PORT = process.env.PORT || 3001;

const testConnection = async () => {
    await pool.query("SELECT NOW()")
    console.log("Connected to Neon")
}

async function startServer() {
    await testConnection();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

startServer().catch(console.error);