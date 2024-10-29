const fornecedorModel = require('../models/fornecedorModel');

// Adicionar novo fornecedor
exports.addFornecedor = (req, res) => {
  const { nome, cnpj, contato, endereco } = req.body;
  const fornecedor = { nome, cnpj, contato, endereco };
  
  fornecedorModel.addFornecedor(fornecedor, (err, fornecedorId) => {
    if (err) return res.status(500).json({ error: 'Erro ao adicionar fornecedor' });
    res.status(201).json({ message: 'Fornecedor adicionado com sucesso', fornecedorId });
  });
};

// Listar todos os fornecedores
exports.getAllFornecedores = (req, res) => {
  fornecedorModel.getAllFornecedores((err, fornecedores) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(fornecedores);
  });
};

// Obter fornecedor por ID
exports.getFornecedorById = (req, res) => {
  const { id } = req.params;
  
  fornecedorModel.getFornecedorById(id, (err, fornecedor) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!fornecedor) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json(fornecedor);
  });
};

// Atualizar fornecedor
exports.updateFornecedor = (req, res) => {
  const { id } = req.params;
  const { nome, cnpj, contato, endereco } = req.body;
  const fornecedor = { nome, cnpj, contato, endereco };
  
  fornecedorModel.updateFornecedor(id, fornecedor, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json({ message: 'Fornecedor atualizado com sucesso' });
  });
};

// Excluir fornecedor
exports.deleteFornecedor = (req, res) => {
  const { id } = req.params;
  
  fornecedorModel.deleteFornecedor(id, (err, changes) => {
    if (err) return res.status(400).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: 'Fornecedor não encontrado' });
    res.json({ message: 'Fornecedor excluído com sucesso' });
  });
};
