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
    <div className="chat-panel open">
      <div className="chat-header">
        <span className="chat-title">Чат</span>
        <button className="chat-close" onClick={onClose}>×</button>
      </div>
      <div className="chat-messages" ref={containerRef}>
        {messages.map((msg, i) => (
          <div key={i} className="chat-msg">
            <div className="chat-msg-avatar">{msg.username?.substring(0,2).toUpperCase()}</div>
            <div className="chat-msg-body">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input className="input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Сообщение..." />
        <button className="btn btn-primary" onClick={send}>→</button>
      </div>
    </div>
  );
}
