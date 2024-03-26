const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 4000;

// Track connections
const codeBlockConnections = {};

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('joinCodeBlock', (id) => {
        const connections = codeBlockConnections[id] || [];

        if (connections.length === 0) {
            // First user, assigned as mentor
            codeBlockConnections[id] = [socket.id];
            socket.emit('assignRole', 'mentor');
        } else if (connections.length >= 1) {
            // Second user, assigned as student
            codeBlockConnections[id].push(socket.id);
            socket.emit('assignRole', 'student');
        }
        console.log('user joined to code block', id, codeBlockConnections[id]);
        // Join a room specific to the codeBlockId
        socket.join(id);
    });

    socket.on('updateCode', ({ codeBlockId, updatedCode }) => {
        // Broadcast the updated code to all users in the room
        socket.to(codeBlockId).emit('codeUpdated', updatedCode);
        socket.emit('codeUpdated', updatedCode);
    });

    socket.on('disconnect', () => {
        // Remove the socket from the codeBlockConnections
        Object.keys(codeBlockConnections).forEach(id => {
            const index = codeBlockConnections[id].indexOf(socket.id);
            if (index !== -1) {
                codeBlockConnections[id].splice(index, 1);
                // If the room is empty, delete it from the tracking object
                if (codeBlockConnections[id].length === 0) {
                    delete codeBlockConnections[id];
                }
            }
        });
        console.log('User disconnected', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
