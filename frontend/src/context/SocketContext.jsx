import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { connectSocket, disconnectSocket } from '../services/socket';
import { AuthContext } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) {
            disconnectSocket();
            setIsConnected(false);
            return;
        }

        const token = localStorage.getItem('token'); // match your key
        socketRef.current = connectSocket(token);

        socketRef.current.on('connect', () => {
            console.log('🔌 Socket connected');
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            disconnectSocket();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);