require('dotenv').config();
const {Pool} = require('pg');
const {PDFParse} = require('pdf-parse');
const {GoogleGenAI} = require('@google/genai');
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const multer = require('multer');
const upload = multer({
   limits: {
       fileSize: 10 * 1024 * 1024
   }
});
const askLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10
});

const express = require('express');
const app = express();
const cors = require('cors')
const corsOptions = {
    origin:"http://localhost:3000"
}
app.use(express.json({
    limit: "1mb"
}));
app.use(cors(corsOptions))


const port = 3001;


const pool = new Pool({connectionString: process.env.DATABASE_URL});

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.get("/documents",async(req,res) => {
    try {
        const result = await pool.query(`
            SELECT id,name,created_at
            FROM documents
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    }catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Error loading documents"
        });
    }
});

app.get("/documents/:id/conversations", async (req, res) => {

    try {

        const documentId = Number(req.params.id);

        if (!Number.isInteger(documentId) || documentId <= 0) {
            return res.status(400).json({
                error: "Invalid document id"
            });
        }

        const result = await pool.query(`
            SELECT question, answer, created_at
            FROM conversations
            WHERE document_id = $1
            ORDER BY created_at ASC
            `, [documentId]);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Error loading conversations"
        });

    }

});

app.delete("/documents/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(`
            DELETE FROM documents
            WHERE id = $1
            RETURNING id`,
            [id]
        );

        if(result.rowCount === 0){
            return res.status(404).json({
                error:"Document not found"
            });
        }

        res.json({
            message:"Document deleted"
        });

    }
    catch(err){

        console.error(err);

        res.status(500).json({
            error:"Error deleting document"
        });
    }

});

app.post("/documents/upload", upload.single("file"), async (req, res) => {

    let client;

    if (!req.file) {
        return res.status(400).json({
            error: "PDF file is required"
        });
    }

    try{

        client = await pool.connect();

        await client.query("BEGIN");
        const fileHash = generateFileHash(req.file.buffer);

        const existingDocument = await client.query(`
            SELECT id
            FROM documents
            WHERE file_hash = $1`, [fileHash]
        );

        if (existingDocument.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({
                error:"This document has already been uploaded"
            });

        }

        const parser = new PDFParse({data: req.file.buffer});
        const data = await parser.getText();

        const result = await client.query(
            `INSERT INTO documents (name, text,file_hash) VALUES ($1, $2, $3) RETURNING id`, [req.file.originalname, data.text,fileHash]);

        const documentId = result.rows[0].id;

        const chunks = chunkText(data.text,850,150);

        for(let i = 0; i < chunks.length; i++){
            const embedding = await generateEmbedding(chunks[i])

            await client.query(`
	            INSERT INTO chunks
	            (document_id, content, chunk_index, embedding)
	            VALUES ($1, $2, $3, $4)`,
                [documentId, chunks[i], i, `[${embedding.join(",")}]`
            ]);

            await new Promise(r => setTimeout(r, 200));

        }

        await client.query("COMMIT");

        res.status(200).json({
            id: documentId,
            message: "File uploaded successfully"
        });

    }catch(err){
        if(client){
            await client.query("ROLLBACK");
        }

        console.error(err);

        res.status(500).json({
            error:"Error uploading file"
        });
    }
    finally{
        if(client){
            client.release();
        }
    }
});

app.post("/ask",askLimiter,async(req,res) => {
    try {

        const { question, documentId } = req.body;

        if (documentId == null) {
            return res.status(400).json({
                error:"Document is required"
            });
        }

        if (typeof question !== "string") {
            return res.status(400).json({
                error: "Question must be a string"
            });
        }

        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        if (question.length > 500) {
            return res.status(400).json({
                error: "Question is too long"
            });
        }

        const embeddingPregunta = await generateEmbedding(question)

        const vectorString = `[${embeddingPregunta.join(",")}]`

        const chunkResult = await pool.query(`SELECT id, document_id, content, chunk_index
                                              FROM chunks
                                              WHERE document_id = $2
                                              ORDER BY embedding <=> $1
                                                  LIMIT 5;`, [vectorString,documentId])

        const chunks = chunkResult.rows

        if(chunks.length === 0){
            return res.json({
                answer:"No information found in this document.",
                sources:[]
            });
        }


        let context = "";

        for (let chunk of chunks) {
            context += `--- Chunk ${chunk.chunk_index} ---\n${chunk.content}\n\n`;
        }

        const prompt =
            "You are an assistant that answers questions ONLY using the provided context.\n" +
            "If the answer is not in the context, reply: \"I didn't find information about this in the document.\"\n" +
            "Do not use external knowledge.\n" +
            "Respond in the same language as the user.\n\n" +
            "Context:\n" +
            context +
            "\nUser question:\n" +
            question;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const answer =
            response.candidates?.[0]?.content?.parts?.[0]?.text ??
            "No response generated.";

        await pool.query(
            `INSERT INTO conversations (document_id, question, answer)
             VALUES ($1, $2, $3)`,
            [
                chunks.length > 0 ? chunks[0].document_id : null,
                question,
                answer
            ]
        );

        res.json({
            answer: answer,
            sources: chunks
        });
    }catch (err){
        console.error(err);
        res.status(500).json({ error: "Error processing question" });
    }



});

app.get("/conversations",async(req,res) => {

    try{
        const result = await pool.query(`
            SELECT document_id, question, answer, created_at
            FROM conversations
            ORDER BY created_at ASC
        `);

        res.json(result.rows);

    }catch(err){
        console.error(err);
        res.status(500).json({
            error: "Error loading conversations"
        });
    }

});

const testConnection = async () => {
    await pool.query('SELECT NOW()');
    console.log("Connected to Neon");
};

async function startServer() {
    await testConnection();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().catch(console.error);

function chunkText(text,chunkSize,overlap){

    if (overlap >= chunkSize) {
        throw new Error("Overlap needs to be smaller than chunkSize");
    }

    let array = [];
    let position = 0;
    let advance = chunkSize - overlap;

    while(position < text.length) {
        let chunk = text.substring(position, position + chunkSize);
        array.push(chunk);
        position += advance;
    }

    return array;
}

async function generateEmbedding(text){

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: text,
        config: { outputDimensionality: 768 },
    });

    return response.embeddings[0].values;

}

function generateFileHash(buffer) {
    return crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");
}