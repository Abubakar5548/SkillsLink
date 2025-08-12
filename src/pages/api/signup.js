import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { regNumber, email, password, name } = req.body;

  if (!regNumber || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ regNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      regNumber,
      email,
      password: hashedPassword,
      name,
    });

    // Remove password before sending to frontend
    const { password: _, ...userWithoutPass } = newUser._doc;

    return res.status(201).json({
      message: 'Signup successful',
      user: userWithoutPass,
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}