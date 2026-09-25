const ai = require("../config/ai");

async function generateEmbedding(text){

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: text,
        config: { outputDimensionality: 768 },
    });

    return response.embeddings[0].values;

}

module.exports = { generateEmbedding };