import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { regNumber, email, password } = req.body;

  if ((!regNumber && !email) || !password) {
    return res.status(400).json({ message: 'RegNumber or Email and password are required' });
  }

  try {
    // Find the user by regNumber or email
    const user = await User.findOne({
      $or: [{ regNumber }, { email }],
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ Return user data to store in localStorage
    return res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      regNumber: user.regNumber,
      email: user.email,
      name: user.name,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}