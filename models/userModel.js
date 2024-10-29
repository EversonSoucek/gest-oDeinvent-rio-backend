const db = require('../database');
const bcrypt = require('bcrypt');

// Função para criar um novo usuário com hash de senha
exports.createUser = async (username, password, email, callback) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (username, passwordHash, email) VALUES (?, ?, ?)`;
  db.run(query, [username, passwordHash, email], function (err) {
    callback(err, this.lastID);
  });
};

// Função para buscar um usuário por username
exports.findUserByUsername = (username, callback) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    callback(err, row);
  });
};
