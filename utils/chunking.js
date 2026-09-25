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

module.exports = { chunkText };