const Block = require('../models/codeBlock');

const codeBlockConnections = {};

// Handle socket connections
const handleConnection = (socket, io) => {
    console.log('A user connected', socket.id);

    // Get code block titles from the database and send to lobby
    socket.on('getTitles', async () => {
        try {
            const codeBlocks = await Block.find({}, 'blockId title');
            const titles = codeBlocks.map(block => ({ id: block.blockId, title: block.title }));
            socket.emit('titles', titles);
            console.log('Fetched code block titles');
        } catch (error) {
            console.error('Error fetching code block titles:', error);
        }
    });

    // Client joined a code block room, assign role and load code
    socket.on('joinCodeBlock', async (id) => {
        try {
            const connections = codeBlockConnections[id] || [];

            // Assign role based on number of connections
            if (connections.length === 0) {
                codeBlockConnections[id] = [socket.id];
                socket.emit('assignRole', 'mentor');
            } else if (connections.length >= 1) {
                codeBlockConnections[id].push(socket.id);
                socket.emit('assignRole', 'student');
            }
            console.log('user joined to code block', id, codeBlockConnections[id]);

            // Load code block data from the database
            const codeBlock = await Block.findOne({ blockId: id });
            if (codeBlock) {
                socket.emit('loadCode', { title: codeBlock.title, code: codeBlock.code, solution: codeBlock.solution});
                console.log('Loaded code block data');
            } else {
                console.log('Code block not found');
            }

            // Join the code block room
            socket.join(id);
        } catch (error) {
            console.error('Error joining code block:', error);
        }
    });

    // Update code block and send to all clients in the room
    socket.on('updateCode', ({ codeBlockId, updatedCode }) => {
        socket.to(codeBlockId).emit('codeUpdated', updatedCode);
        socket.emit('codeUpdated', updatedCode);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        Object.keys(codeBlockConnections).forEach(id => {
            const index = codeBlockConnections[id].indexOf(socket.id);
            if (index !== -1) {
                codeBlockConnections[id].splice(index, 1);
                if (codeBlockConnections[id].length === 0) {
                    delete codeBlockConnections[id];
                }
            }
        });
        console.log('User disconnected', socket.id);
    });
};

module.exports = handleConnection;