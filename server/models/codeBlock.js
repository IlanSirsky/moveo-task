const mongoose = require('mongoose');

// Define the schema for the code block model
const codeBlockSchema = new mongoose.Schema({
    title: String,
    code: String,
    solution: String,
    blockId: Number
});

const Block = mongoose.model('Block', codeBlockSchema);

module.exports = Block;