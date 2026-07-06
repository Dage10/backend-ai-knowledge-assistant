require('dotenv').config();
const {Pool} = require('pg');
const {PDFParse} = require('pdf-parse')
const multer = require('multer');
const upload = multer({
   limits: {
       fileSize: 10 * 1024 * 1024
   }
});

const express = require('express');
const app = express();
const cors = require('cors')
var corsOptions = {
    origin:"http://localhost:3000"
}
app.use(cors(corsOptions))


const port = 3001;


const pool = new Pool({connectionString: process.env.DATABASE_URL});

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.get("/documents",async(req,res) => {
    const result = await pool.query('SELECT * FROM documents');
    res.json(result.rows);
});

app.post("/documents/upload", upload.single("file"), async (req, res) => {
    try{
        const parser = new PDFParse({data: req.file.buffer});
        const data = await parser.getText();

        const result = await pool.query(
            'INSERT INTO documents (name, text) VALUES ($1, $2) RETURNING id', [req.file.originalname, data.text]);

        const documentId = result.rows[0].id;

        const chunks = chunkText(data.text,850,150)

        for(let i = 0; i < chunks.length; i++){
            await pool.query('INSERT INTO chunks (document_id, content, chunk_index) VALUES ($1, $2 ,$3)', [documentId,chunks[i],i])
        }


        res.status(200).send("File uploaded successfully!");
    }catch(err){
        console.error(err);
        res.status(500).send("Error uploading file");
    }
});


app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});

const testConnection = async () => {
    await pool.query('SELECT NOW()');
    console.log("Connected to Neon");
};

function chunkText(text,chunkSize,overlap){

    if (overlap >= chunkSize) {
        throw new Error("Overlap needs to be smaller than chunkSize");
    }

    let array = []
    let position = 0;
    let advance = chunkSize - overlap

    while(position < text.length) {
        let chunk = text.substring(position, position + chunkSize)
        array.push(chunk)
        position += advance;
    }

    return array;
}

testConnection();