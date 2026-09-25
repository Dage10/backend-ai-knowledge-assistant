const express = require('express');
const router = express.Router();
const { PDFParse } = require('pdf-parse');

const pool = require('../config/db');
const upload = require('../middlewares/upload');
const { uploadLimiter } = require('../middlewares/rateLimiters');
const { chunkText} = require('../utils/chunking');
const { generateEmbedding } = require('../utils/embeddings');
const { generateFileHash } = require('../utils/hash');

router.get("/",async(req,res) => {
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

router.get("/:id/conversations", async (req, res) => {

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

router.delete("/:id", async (req, res) => {

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

router.post("/upload", uploadLimiter, upload.single("file"), async (req, res) => {

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

module.exports = router;