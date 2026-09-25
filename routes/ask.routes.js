const express = require('express');
const router = express.Router();

const pool = require('../config/db');
const ai = require('../config/ai');
const { generateEmbedding } = require('../utils/embeddings');
const {askLimiter} = require("../middlewares/rateLimiters");

router.post("/ask",askLimiter,async(req,res) => {
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

router.get("/conversations",async(req,res) => {

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

module.exports = router;