const User = require('../models/User');

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user: { name: user.name, email: user.email, role: user.role } });
};

exports.getAdminPage = (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}!` });
};

exports.getManagerPage = (req, res) => {
  res.json({ message: `Welcome Manager ${req.user.name}!` });
};

exports.getUserPage = (req, res) => {
  res.json({ message: `Welcome ${req.user.name}!` });
};

