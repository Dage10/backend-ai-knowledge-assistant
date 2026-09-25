const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const documentRoutes = require('./routes/documents.routes');
const askRoutes = require('./routes/ask.routes');

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
}

app.use(express.json({ limit: '1mb' }));
app.use(cors(corsOptions));
app.use(helmet());
app.set('trust proxy', 1);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
})

app.use("/documents", documentRoutes);
app.use("/",askRoutes);

module.exports = app;