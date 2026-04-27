const db = require('../config/db');

const User = {
  async create({ name, email, password, role }) {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async update2FA(id, secret) {
    await db.execute(
      'UPDATE users SET two_fa_secret = ?, two_fa_enabled = TRUE WHERE id = ?',
      [secret, id]
    );
  },
};

module.exports = User;

