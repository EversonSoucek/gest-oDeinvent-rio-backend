const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

// Cadastro de usuário
exports.register = (req, res) => {
  const { username, password, email } = req.body;
  userModel.createUser(username, password, email, (err, userId) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', userId });
  });
};

// Login de usuário
exports.login = (req, res) => {
  const { username, password } = req.body;
  userModel.findUserByUsername(username, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) {
      req.session.userId = user.id;  // Armazena o ID do usuário na sessão
      res.json({ message: 'Login bem-sucedido' });
    } else {
      res.status(401).json({ error: 'Senha incorreta' });
    }
  });
};

// Logout de usuário
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.json({ message: 'Logout bem-sucedido' });
  });
};
