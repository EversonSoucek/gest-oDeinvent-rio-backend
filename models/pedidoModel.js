const db = require('../database');

// Adicionar um novo pedido
exports.addPedido = (clienteId, status, items, callback) => {
  const data = new Date().toISOString();
  db.run(
    `INSERT INTO pedidos (data, clienteId, status, total) VALUES (?, ?, ?, 0)`,
    [data, clienteId, status],
    function (err) {
      if (err) {
        return callback(err);
      }
      const pedidoId = this.lastID;
      const itemInserts = items.map((item) => {
        return new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO itens_pedido (pedidoId, produtoId, quantidade, preco_unitario)
             VALUES (?, ?, ?, ?)`,
            [pedidoId, item.produtoId, item.quantidade, item.preco_unitario],
            (err) => (err ? reject(err) : resolve())
          );
        });
      });
      Promise.all(itemInserts)
        .then(() => callback(null, { id: pedidoId }))
        .catch(callback);
    }
  );
};

// Listar pedidos com filtros
exports.getPedidos = (filters, callback) => {
  const { dataInicio, dataFim, status } = filters;
  let query = `SELECT * FROM pedidos WHERE 1=1`;
  const params = [];

  if (dataInicio && dataFim) {
    query += ` AND data BETWEEN ? AND ?`;
    params.push(dataInicio, dataFim);
  }
  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  db.all(query, params, (err, rows) => {
    callback(err, rows);
  });
};

// Atualizar pedido
exports.updatePedido = (id, clienteId, status, callback) => {
  db.run(
    `UPDATE pedidos SET clienteId = ?, status = ? WHERE id = ?`,
    [clienteId, status, id],
    function (err) {
      callback(err, { changes: this.changes });
    }
  );
};

// Excluir pedido
exports.deletePedido = (id, callback) => {
  db.run(`DELETE FROM pedidos WHERE id = ?`, [id], function (err) {
    callback(err, { changes: this.changes });
  });
};

// Calcular total do pedido
exports.calculateTotal = (pedidoId, callback) => {
  const query = `
    SELECT SUM(quantidade * preco_unitario) AS total
    FROM itens_pedido
    WHERE pedidoId = ?
  `;
  db.get(query, [pedidoId], (err, row) => {
    if (err) {
      return callback(err);
    }
    const total = row?.total || 0;
    db.run(`UPDATE pedidos SET total = ? WHERE id = ?`, [total, pedidoId], (err) => {
      callback(err, total);
    });
  });
};
