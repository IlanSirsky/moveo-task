const Block = require('../models/codeBlock');

const codeBlockConnections = {};

const handleConnection = (socket, io) => {
    console.log('A user connected', socket.id);

    socket.on('getTitles', async () => {
        try {
            const codeBlocks = await Block.find({}, 'blockId title');
            const titles = codeBlocks.map(block => ({ id: block.blockId, title: block.title }));
            socket.emit('titles', titles);
        } catch (error) {
            console.error('Error fetching code block titles:', error);
        }
    });

    socket.on('joinCodeBlock', async (id) => {
        try {
            const connections = codeBlockConnections[id] || [];

            if (connections.length === 0) {
                codeBlockConnections[id] = [socket.id];
                socket.emit('assignRole', 'mentor');
            } else if (connections.length >= 1) {
                codeBlockConnections[id].push(socket.id);
                socket.emit('assignRole', 'student');
            }
            console.log('user joined to code block', id, codeBlockConnections[id]);

            const codeBlock = await Block.findOne({ blockId: id });
            if (codeBlock) {
                socket.emit('loadCode', { title: codeBlock.title, code: codeBlock.code, solution: codeBlock.solution});
            } else {
                console.log('Code block not found');
            }

            socket.join(id);
        } catch (error) {
            console.error('Error joining code block:', error);
        }
    });

    socket.on('updateCode', ({ codeBlockId, updatedCode }) => {
        socket.to(codeBlockId).emit('codeUpdated', updatedCode);
        socket.emit('codeUpdated', updatedCode);
    });

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