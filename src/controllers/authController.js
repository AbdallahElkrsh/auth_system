const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const secret = speakeasy.generateSecret({ name: `AuthSystem (${email})` });
    const userId = await User.create({ name, email, password: hashedPassword, role });
    await User.update2FA(userId, secret.base32);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.status(201).json({
      message: 'User registered successfully.',
      qrCode,
      secret: secret.base32,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    res.json({ message: 'Password verified. Please enter your 2FA code.', userId: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.verify2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isValid = speakeasy.totp.verify({
      secret: user.two_fa_secret,
      encoding: 'base32',
      token,
      window: 1,
    });


    if (!isValid) return res.status(400).json({ message: 'Invalid 2FA code.' });

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful.',
      token: jwtToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};
