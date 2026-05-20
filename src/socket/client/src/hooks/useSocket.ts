import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://sj-server-v2.onrender.com';
const TOKEN = localStorage.getItem('token') || 'demo';

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(SOCKET_URL, { auth: { token: TOKEN } });
    s.on('connect', () => console.log('🔌 Socket connected'));
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  return socket;
}