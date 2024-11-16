const db = require('../database');

// Adicionar um novo cliente
exports.addCliente = (nome, cpf_cnpj, endereco, contato, callback) => {
  const query = `INSERT INTO clientes (nome, cpf_cnpj, endereco, contato, ativo) VALUES (?, ?, ?, ?, 1)`;
  db.run(query, [nome, cpf_cnpj, endereco, contato], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: this.lastID });
    }
  });
};

// Listar clientes com filtros opcionais
exports.getClientes = (nome, cpf_cnpj, callback) => {
  let query = `SELECT * FROM clientes WHERE ativo = 1`;
  const params = [];

  if (nome) {
    query += ` AND nome LIKE ?`;
    params.push(`%${nome}%`);
  }
  if (cpf_cnpj) {
    query += ` AND cpf_cnpj = ?`;
    params.push(cpf_cnpj);
  }

  db.all(query, params, (err, rows) => {
    callback(err, rows);
  });
};

// Atualizar informações de um cliente
exports.updateCliente = (id, nome, cpf_cnpj, endereco, contato, callback) => {
  const query = `
    UPDATE clientes
    SET nome = ?, cpf_cnpj = ?, endereco = ?, contato = ?
    WHERE id = ? AND ativo = 1
  `;
  db.run(query, [nome, cpf_cnpj, endereco, contato, id], function (err) {
    callback(err, { changes: this.changes });
  });
};

// Desativar cliente (não excluir)
exports.deactivateCliente = (id, callback) => {
  const query = `
    UPDATE clientes
    SET ativo = 0
    WHERE id = ?
  `;
  db.run(query, [id], function (err) {
    callback(err, { changes: this.changes });
  });
};

// Excluir um cliente
exports.deleteCliente = (id, callback) => {
  const query = `DELETE FROM clientes WHERE id = ?`;
  db.run(query, [id], function (err) {
    callback(err, { changes: this.changes });
  });
};
