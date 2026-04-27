const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { getProfile, getAdminPage, getManagerPage, getUserPage } = require('../controllers/userController');

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}!`, role: req.user.role });
});

router.get('/admin',   verifyToken, authorizeRoles('admin'),   getAdminPage);
router.get('/manager', verifyToken, authorizeRoles('manager'), getManagerPage);
router.get('/profile', verifyToken, authorizeRoles('user'),    getProfile);
router.get('/user',    verifyToken, getUserPage);

module.exports = router;
