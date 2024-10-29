const productModel = require('../models/productModel');

exports.addProduct = (req, res) => {
  const { nome, descricao, preco, quantidade, fornecedorId } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const product = { nome, descricao, preco, quantidade, imagem, fornecedorId };
  productModel.addProduct(product, (err, productId) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Produto adicionado com sucesso', productId });
  });
};

exports.getAllProducts = (req, res) => {
  productModel.getAllProducts((err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
};

exports.getProductById = (req, res) => {
  const { id } = req.params;
  productModel.getProductById(id, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  });
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, quantidade, fornecedorId } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const product = { nome, descricao, preco, quantidade, imagem, fornecedorId };
  productModel.updateProduct(id, product, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto atualizado com sucesso' });
  });
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  productModel.deleteProduct(id, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto excluído com sucesso' });
  });
};
