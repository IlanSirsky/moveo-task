const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
    title: String,
    code: String,
    blockId: Number
});

const Block = mongoose.model('Block', codeBlockSchema);

module.exports = Block;