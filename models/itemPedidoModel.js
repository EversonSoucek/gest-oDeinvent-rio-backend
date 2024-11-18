const db = require('../database');

// Adicionar um item ao pedido
exports.addItem = (pedidoId, produtoId, quantidade, precoUnitario, callback) => {
  const query = `INSERT INTO itensPedido (pedidoId, produtoId, quantidade, precoUnitario) VALUES (?, ?, ?, ?)`;
  db.run(query, [pedidoId, produtoId, quantidade, precoUnitario], function (err) {
    callback(err, this.lastID);
  });
};

// Remover um item de um pedido
exports.deleteItem = (id, callback) => {
  const query = `DELETE FROM itensPedido WHERE id = ?`;
  db.run(query, [id], function (err) {
    callback(err, this.changes);
  });
};

// Listar itens de um pedido
exports.getItemsByPedidoId = (pedidoId, callback) => {
  const query = `SELECT ip.*, p.nome AS produtoNome 
                 FROM itensPedido ip
                 JOIN products p ON ip.produtoId = p.id
                 WHERE ip.pedidoId = ?`;
  db.all(query, [pedidoId], (err, rows) => {
    callback(err, rows);
  });
};

// Atualizar um item de pedido
exports.updateItem = (id, quantidade, precoUnitario, callback) => {
  const query = `UPDATE itensPedido SET quantidade = ?, precoUnitario = ? WHERE id = ?`;
  db.run(query, [quantidade, precoUnitario, id], function (err) {
    callback(err, this.changes);
  });
};
