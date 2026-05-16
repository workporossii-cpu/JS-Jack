import { useEffect, useState, useRef } from 'react';
import type { Socket } from 'socket.io-client';

interface ChatMessage {
  id: number;
  userId: string;
  username: string;
  text: string;
  replyTo: number | null;
}

interface ChatPanelProps {
  socket: Socket | null;
  onClose: () => void;
}

export function ChatPanel({ socket, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    if (!socket) return;
    socket.on('new_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => { socket.off('new_message'); };
  }, [socket]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    if (!input.trim() || !socket) return;
    socket.emit('send_message', { text: input, token });
    setInput('');
  };

  return (
    <div className="chat-panel open">
      <div className="chat-header">
        <span className="chat-title">Чат</span>
        <button className="chat-close" onClick={onClose}>×</button>
      </div>
      <div className="chat-messages" ref={containerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className="chat-msg">
            <div className="chat-msg-avatar">{msg.username.substring(0, 2).toUpperCase()}</div>
            <div className="chat-msg-body">
              <div className="chat-msg-author">{msg.username}</div>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          className="input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Сообщение..."
          maxLength={200}
        />
        <button className="btn btn-primary" onClick={send}>→</button>
      </div>
    </div>
  );
}
