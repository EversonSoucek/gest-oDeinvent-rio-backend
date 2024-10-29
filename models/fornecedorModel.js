const db = require('../database');

// Adicionar novo fornecedor
exports.addFornecedor = (fornecedor, callback) => {
  const { nome, cnpj, contato, endereco } = fornecedor;
  const query = `INSERT INTO fornecedores (nome, cnpj, contato, endereco) VALUES (?, ?, ?, ?)`;
  db.run(query, [nome, cnpj, contato, endereco], function (err) {
    callback(err, this.lastID);
  });
};

// Obter todos os fornecedores
exports.getAllFornecedores = (callback) => {
  db.all('SELECT * FROM fornecedores', [], (err, rows) => {
    callback(err, rows);
  });
};

// Obter fornecedor por ID
exports.getFornecedorById = (id, callback) => {
  db.get('SELECT * FROM fornecedores WHERE id = ?', [id], (err, row) => {
    callback(err, row);
  });
};

// Atualizar dados de fornecedor
exports.updateFornecedor = (id, fornecedor, callback) => {
  const { nome, cnpj, contato, endereco } = fornecedor;
  const query = `UPDATE fornecedores SET nome = ?, cnpj = ?, contato = ?, endereco = ? WHERE id = ?`;
  db.run(query, [nome, cnpj, contato, endereco, id], function (err) {
    callback(err, this.changes);
  });
};

// Excluir fornecedor (somente se não tiver produtos associados)
exports.deleteFornecedor = (id, callback) => {
  // Verificar se o fornecedor possui produtos associados
  db.get('SELECT COUNT(*) as count FROM products WHERE fornecedorId = ?', [id], (err, result) => {
    if (err) return callback(err);

    if (result.count > 0) {
      // Fornecedor possui produtos associados
      callback(new Error('Fornecedor possui produtos associados e não pode ser excluído.'));
    } else {
      // Excluir o fornecedor
      db.run('DELETE FROM fornecedores WHERE id = ?', [id], function (err) {
        callback(err, this.changes);
      });
    }
  });
};
