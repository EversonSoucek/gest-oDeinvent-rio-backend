const db = require("../database");

module.exports = {
  addProduct: (product, callback) => {
    const { nome, descricao, preco, quantidade, imagem, fornecedorId } =
      product;
    const query = `INSERT INTO products (nome, descricao, preco, quantidade, imagem, fornecedorId) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(
      query,
      [nome, descricao, preco, quantidade, imagem, fornecedorId],
      function (err) {
        callback(err, this.lastID);
      }
    );
  },

  getAllProducts: (callback) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
      callback(err, rows);
    });
  },

  getProductById: (id, callback) => {
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
      callback(err, row);
    });
  },

  updateProduct: (id, product, callback) => {
    const { nome, descricao, preco, quantidade, imagem, fornecedorId } =
      product;
    const query = `UPDATE products SET nome = ?, descricao = ?, preco = ?, quantidade = ?, imagem = ?, fornecedorId = ? WHERE id = ?`;
    db.run(
      query,
      [nome, descricao, preco, quantidade, imagem, fornecedorId, id],
      function (err) {
        callback(err, this.changes);
      }
    );
  },

  deleteProduct: (id, callback) => {
    db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
      callback(err, this.changes);
    });
  },
};
