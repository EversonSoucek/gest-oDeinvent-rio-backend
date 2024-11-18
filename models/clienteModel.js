const db = require("../database");

// Adicionar um novo cliente
exports.addCliente = (
  nome,
  cpf_cnpj,
  email,
  endereco,
  contato,
  tipo,
  callback
) => {
  const query = `
    INSERT INTO clientes (nome, cpf_cnpj, email, endereco, contato, tipo, ativo)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;
  const params = [nome, cpf_cnpj, email, endereco, contato, tipo];

  db.run(query, params, function (err) {
    callback(err, { id: this.lastID });
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

// Função para buscar cliente por ID
exports.getClienteById = (id, callback) => {
  const query = `
    SELECT id, nome, cpf_cnpj, email, contato, endereco, tipo 
    FROM clientes 
    WHERE id = ? AND ativo = 1
  `;

  db.get(query, [id], (err, row) => {
    callback(err, row);
  });
};

exports.updateCliente = (
  id,
  nome,
  cpf_cnpj,
  email,
  endereco,
  contato,
  tipo,
  callback
) => {
  const query = `
    UPDATE clientes
    SET nome = ?, cpf_cnpj = ?, email = ?, endereco = ?, contato = ?, tipo = ?
    WHERE id = ? AND ativo = 1
  `;

  const params = [nome, cpf_cnpj, email, endereco, contato, tipo, id];

  db.run(query, params, function (err) {
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
