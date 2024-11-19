const db = require('../database');
exports.addPedido = (clienteId, status, items, callback) => {
  if (!clienteId || !items || items.length === 0) {
    return callback(new Error("Cliente e itens são obrigatórios."));
  }

  const data = new Date().toISOString();
  db.run(
    `INSERT INTO pedidos (data, clienteId, status, total) VALUES (?, ?, ?, 0)`,
    [data, clienteId, status],
    function (err) {
      if (err) {
        return callback(err);
      }

      const pedidoId = this.lastID;

      // Verifica se os itens têm os campos necessários
      const itemInserts = items.map((item) => {
        if (!item.produtoId || !item.quantidade || !item.precoUnitario) {
          return Promise.reject(
            new Error("Cada item deve ter produtoId, quantidade e precoUnitario.")
          );
        }

        return new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO itensPedido (pedidoId, produtoId, quantidade, precoUnitario)
             VALUES (?, ?, ?, ?)`,
            [pedidoId, item.produtoId, item.quantidade, item.precoUnitario],
            (err) => (err ? reject(err) : resolve())
          );
        });
      });

      // Executa todas as inserções dos itens
      Promise.all(itemInserts)
        .then(() => callback(null, { id: pedidoId }))
        .catch((err) => {
          // Se houver erro na inserção dos itens, remove o pedido criado
          db.run(`DELETE FROM pedidos WHERE id = ?`, [pedidoId], () => {
            callback(err);
          });
        });
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
    SELECT SUM(quantidade * precoUnitario) AS total
    FROM itensPedido
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
