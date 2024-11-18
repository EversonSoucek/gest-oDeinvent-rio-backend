const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");

    // Criação da tabela products
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      quantidade INTEGER NOT NULL,
      imagem TEXT,
      fornecedorId INTEGER
    )`,
      (err) => {
        if (err) {
          console.error("Erro ao criar a tabela products:", err.message);
        } else {
          console.log("Tabela products verificada/criada com sucesso.");
        }
      }
    );

    // Criação da tabela users
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      email TEXT UNIQUE
    )`,
      (err) => {
        if (err) {
          console.error("Erro ao criar a tabela users:", err.message);
        } else {
          console.log("Tabela users verificada/criada com sucesso.");
        }
      }
    );

    // Criação da tabela fornecedores
    db.run(
      `CREATE TABLE IF NOT EXISTS fornecedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cnpj TEXT UNIQUE,
      contato TEXT,
      endereco TEXT
    )`,
      (err) => {
        if (err) {
          console.error("Erro ao criar a tabela fornecedores:", err.message);
        } else {
          console.log("Tabela fornecedores verificada/criada com sucesso.");
        }
      }
    );
  }

  db.run(
    `CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    clienteId INTEGER NOT NULL,
    status TEXT NOT NULL,
    total REAL DEFAULT 0,
    FOREIGN KEY (clienteId) REFERENCES clientes(id)
  )`,
    (err) => {
      if (err) {
        console.error("Erro ao criar a tabela pedidos:", err.message);
      } else {
        console.log("Tabela pedidos verificada/criada com sucesso.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf_cnpj TEXT UNIQUE NOT NULL,
    endereco TEXT,
    contato TEXT,
    email TEXT,
    tipo TEXT, 
    ativo INTEGER DEFAULT 1
  )`,
    (err) => {
      if (err) {
        console.error("Erro ao criar a tabela clientes:", err.message);
      } else {
        console.log("Tabela clientes verificada/criada com sucesso.");
      }
    }
  );

  // Criação da tabela itensPedido
  db.run(
    `CREATE TABLE IF NOT EXISTS itensPedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedidoId INTEGER NOT NULL,
  produtoId INTEGER NOT NULL,
  quantidade INTEGER NOT NULL CHECK(quantidade > 0),
  precoUnitario REAL NOT NULL CHECK(precoUnitario > 0),
  FOREIGN KEY (pedidoId) REFERENCES pedidos(id),
  FOREIGN KEY (produtoId) REFERENCES products(id)
)`,
    (err) => {
      if (err) {
        console.error("Erro ao criar a tabela itensPedido:", err.message);
      } else {
        console.log("Tabela itensPedido verificada/criada com sucesso.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data DATE NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('Entrada', 'Saída')),
    valor REAL NOT NULL CHECK(valor > 0),
    produtoId INTEGER NOT NULL,
    pedidoId INTEGER,
    FOREIGN KEY (produtoId) REFERENCES products(id),
    FOREIGN KEY (pedidoId) REFERENCES pedidos(id)
  )`,
    (err) => {
      if (err) {
        console.error("Erro ao criar a tabela transacoes:", err.message);
      } else {
        console.log("Tabela transacoes verificada/criada com sucesso.");
      }
    }
  );
});

module.exports = db;
