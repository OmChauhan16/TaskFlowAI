// export const initSocket = (io) => {
//     io.on('connection', (socket) => {
//         console.log('✅ User connected:', socket.id);

//         socket.on('join-project', (projectId) => {
//             socket.join(projectId);
//             console.log(`User ${socket.id} joined project: ${projectId}`);
//         });

//         socket.on('task-updated', (data) => {
//             socket.to(data.projectId).emit('task-updated', data);
//         });

//         socket.on('disconnect', () => {
//             console.log('❌ User disconnected:', socket.id);
//         });
//     });
// };



// socket/socketHandler.js
export const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('✅ User connected:', socket.id);

        // Join project room
        socket.on('join-project', (projectId) => {
            socket.join(projectId);
            // ✅ ADD THIS — see who is in the room
            const room = io.sockets.adapter.rooms.get(projectId);
            console.log(`📁 ${socket.id} joined project: ${projectId}`);
            console.log(`👥 Users in room ${projectId}:`, room?.size);
            // console.log(`User ${socket.id} joined project: ${projectId}`);
        });

        // Leave project room
        socket.on('leave-project', (projectId) => {
            socket.leave(projectId);
        });

        // Client-side task move (Kanban drag) — relay to others in room
        socket.on('task-updated', (data) => {
            socket.to(data.projectId).emit('task-updated', data);
        });

        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.id);
        });
    });
};
