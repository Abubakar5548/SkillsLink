import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MessagesPage() {
  const router = useRouter();
  const { to } = router.query;

  const [sender, setSender] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [receiverName, setReceiverName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSender(localStorage.getItem('regNumber'));
    }
  }, []);

  useEffect(() => {
    if (sender && to) {
      fetchMessages();
    }
  }, [sender, to]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/messages?user1=${sender}&user2=${to}`);
      const data = await res.json();
      setMessages(data.messages || []);
      setReceiverName(to);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender,
          receiver: to,
          content,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, data.message]);
        setContent('');
      } else {
        console.error('Failed to send message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Chat with {receiverName}</h3>

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            height: '400px',
            overflowY: 'scroll',
            background: '#f9f9f9',
          }}
        >
          {messages.length === 0 ? (
            <p>No messages yet</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 p-2 rounded ${msg.sender === sender ? 'bg-primary text-white' : 'bg-light'}`}
                style={{ maxWidth: '70%', alignSelf: msg.sender === sender ? 'flex-end' : 'flex-start' }}
              >
                <strong>{msg.sender === sender ? 'You' : receiverName}</strong>
                <p style={{ margin: 0 }}>{msg.content}</p>
                <small className="text-muted">{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}