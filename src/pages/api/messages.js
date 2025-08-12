import dbConnect from '../../lib/dbConnect';
import Message from '../../models/Message';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { sender, receiver, content } = req.body;

    console.log("Received body:", req.body);

    if (!sender || !receiver || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const message = new Message({
        sender,
        receiver,
        content,
        timestamp: new Date(),
      });
      await message.save();
      return res.status(201).json({ success: true, message });
    } catch (error) {
      console.error("Error saving message:", error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'GET') {
    const { user1, user2 } = req.query;

    if (!user1 || !user2) {
      return res.status(400).json({ error: 'Missing user identifiers' });
    }

    try {
      const messages = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      }).sort({ timestamp: 1 });

      return res.status(200).json({ messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}