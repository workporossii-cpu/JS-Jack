import { useEffect, useState, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';

interface Props { onClose: () => void }

export default function ChatPanel({ onClose }: Props) {
  const socket = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket?.on('new_message', (msg: any) => setMessages(prev => [...prev, msg]));
    return () => { socket?.off('new_message'); };
  }, [socket]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    socket?.emit('send_message', { text: input, token: localStorage.getItem('token') || 'demo' });
    setInput('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '300px',
      height: '100vh',
      background: '#0f1117',
      borderLeft: '1px solid #252830',
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      padding: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#a970ff' }}>Чат</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>×</button>
      </div>
      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '40px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#a970ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
              {msg.username?.substring(0,2).toUpperCase()}
            </div>
            <div style={{ background: '#1a1d25', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', maxWidth: '200px' }}>{msg.text}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Сообщение..."
          style={{ flex: 1, background: '#111318', border: '1px solid #252830', color: '#fff', padding: '8px 10px', borderRadius: '8px', fontSize: '11px', outline: 'none' }}
        />
        <button onClick={send} style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>→</button>
      </div>
    </div>
  );
}
