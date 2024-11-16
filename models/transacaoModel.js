const db = require('../database');

// Criar uma nova transação
exports.addTransacao = (data, tipo, valor, produtoId, pedidoId, callback) => {
  const query = `
    INSERT INTO transacoes (data, tipo, valor, produtoId, pedidoId)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [data, tipo, valor, produtoId, pedidoId || null], function (err) {
    callback(err, { id: this.lastID });
  });
};

// Listar transações com filtros opcionais
exports.getTransacoes = (tipo, dataInicio, dataFim, callback) => {
  let query = `SELECT * FROM transacoes WHERE 1=1`;
  const params = [];

  if (tipo) {
    query += ` AND tipo = ?`;
    params.push(tipo);
  }
  if (dataInicio) {
    query += ` AND data >= ?`;
    params.push(dataInicio);
  }
  if (dataFim) {
    query += ` AND data <= ?`;
    params.push(dataFim);
  }

  db.all(query, params, (err, rows) => {
    callback(err, rows);
  });
};

// Atualizar uma transação
exports.updateTransacao = (id, data, tipo, valor, produtoId, pedidoId, callback) => {
  const query = `
    UPDATE transacoes
    SET data = ?, tipo = ?, valor = ?, produtoId = ?, pedidoId = ?
    WHERE id = ?
  `;
  db.run(query, [data, tipo, valor, produtoId, pedidoId || null, id], function (err) {
    callback(err, { changes: this.changes });
  });
};

// Deletar uma transação
exports.deleteTransacao = (id, callback) => {
  const query = `DELETE FROM transacoes WHERE id = ?`;
  db.run(query, [id], function (err) {
    callback(err, { changes: this.changes });
  });
};
