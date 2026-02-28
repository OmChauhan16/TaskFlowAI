// // frontend/src/services/socket.js
// import { io } from 'socket.io-client';

// let socket = null;

// export const connectSocket = (token) => {
//     if (!socket) {
//         socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
//             auth: { token },
//             withCredentials: true,
//         });
//     }
//     return socket;
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//     if (socket) {
//         socket.disconnect();
//         socket = null;
//     }
// };



import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            withCredentials: true,
            transports: ['polling', 'websocket'], // polling first, then upgrades
            auth: { token },
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};