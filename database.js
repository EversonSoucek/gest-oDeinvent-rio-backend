const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');

    // Criação da tabela products
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      quantidade INTEGER NOT NULL,
      imagem TEXT,
      fornecedorId INTEGER
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela products:', err.message);
      } else {
        console.log('Tabela products verificada/criada com sucesso.');
      }
    });

    // Criação da tabela users
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      email TEXT UNIQUE
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela users:', err.message);
      } else {
        console.log('Tabela users verificada/criada com sucesso.');
      }
    });

    // Criação da tabela fornecedores
    db.run(`CREATE TABLE IF NOT EXISTS fornecedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cnpj TEXT UNIQUE,
      contato TEXT,
      endereco TEXT
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela fornecedores:', err.message);
      } else {
        console.log('Tabela fornecedores verificada/criada com sucesso.');
      }
    });
  }
});

module.exports = db;
