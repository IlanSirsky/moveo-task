const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
const socketHandlers = require('./sockets/socketHandlers');

// Create the server
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ["https://moveo-task-client-one.vercel.app", "http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
// const mongoURI = 'mongodb://localhost:27017/codeBlocks';
const mongoURI = process.env.MONGODB_URI || '';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Socket.io connection
io.on('connection', (socket) => {
    socketHandlers(socket, io);
});

// Start the server
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));