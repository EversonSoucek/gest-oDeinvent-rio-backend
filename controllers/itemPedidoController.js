const ItemPedidoModel = require('../models/itemPedidoModel');

// Adicionar item ao pedido
exports.addItem = (req, res) => {
  const { pedidoId, produtoId, quantidade, precoUnitario } = req.body;

  if (!pedidoId || !produtoId || quantidade <= 0 || precoUnitario <= 0) {
    return res.status(400).json({ error: 'Dados inválidos. Verifique pedidoId, produtoId, quantidade e precoUnitario.' });
  }

  ItemPedidoModel.addItem(pedidoId, produtoId, quantidade, precoUnitario, (err, itemId) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao adicionar item ao pedido', details: err.message });
    }
    res.status(201).json({ message: 'Item adicionado com sucesso', itemId });
  });
};

// Remover item de pedido
exports.deleteItem = (req, res) => {
  const { id } = req.params;

  ItemPedidoModel.deleteItem(id, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao remover item do pedido', details: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.status(200).json({ message: 'Item removido com sucesso' });
  });
};

// Listar itens de um pedido
exports.listItems = (req, res) => {
  const { pedidoId } = req.params;

  ItemPedidoModel.getItemsByPedidoId(pedidoId, (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar itens do pedido', details: err.message });
    }
    res.status(200).json({ items });
  });
};

// Atualizar item de pedido
exports.updateItem = (req, res) => {
  const { id } = req.params;
  const { quantidade, precoUnitario } = req.body;

  if (quantidade <= 0 || precoUnitario <= 0) {
    return res.status(400).json({ error: 'Quantidade e precoUnitario devem ser maiores que 0' });
  }

  ItemPedidoModel.updateItem(id, quantidade, precoUnitario, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar item do pedido', details: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.status(200).json({ message: 'Item atualizado com sucesso' });
  });
};
