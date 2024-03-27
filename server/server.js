const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketHandlers = require('./sockets/socketHandlers');

// Create the server
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/codeBlocks', {
mongoose.connect('mongodb+srv://BigData:BigDataProject23@codeblocks.himeihq.mongodb.net/codeBlocks', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Socket.io connection
io.on('connection', (socket) => {
    socketHandlers(socket, io);
});

// Start the server
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));