export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('✅ User connected:', socket.id);

        socket.on('join-project', (projectId) => {
            socket.join(projectId);
            console.log(`User ${socket.id} joined project: ${projectId}`);
        });

        socket.on('task-updated', (data) => {
            socket.to(data.projectId).emit('task-updated', data);
        });

        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.id);
        });
    });
};