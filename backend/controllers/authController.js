import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, patientId } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      specialization: role === 'doctor' ? specialization : undefined,
      patientId: role === 'patient' ? patientId : undefined,
    });

    const token = generateToken(user._id);
    const userResponse = await User.findById(user._id).select('-password');

    res.status(201).json({ message: 'Registration successful', token, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Registration failed.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }

    const token = generateToken(user._id);
    const userResponse = await User.findById(user._id)
      .select('-password')
      .populate('patientId', 'name age gender contact');

    res.json({ message: 'Login successful', token, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Login failed.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('patientId', 'name age gender contact');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch profile.' });
  }
};
