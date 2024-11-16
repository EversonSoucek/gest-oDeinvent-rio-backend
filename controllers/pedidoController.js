const PedidoModel = require('../models/pedidoModel');

// Criar pedido
exports.createPedido = (req, res) => {
  const { clienteId, status, items } = req.body;
  if (!clienteId || !items || !items.length) {
    return res.status(400).json({ error: 'Cliente e itens são obrigatórios.' });
  }

  PedidoModel.addPedido(clienteId, status, items, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar pedido', details: err.message });
    }
    PedidoModel.calculateTotal(result.id, (err, total) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao calcular total', details: err.message });
      }
      res.status(201).json({ message: 'Pedido criado com sucesso', pedidoId: result.id, total });
    });
  });
};

// Listar pedidos
exports.listPedidos = (req, res) => {
  const filters = req.query;
  PedidoModel.getPedidos(filters, (err, pedidos) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar pedidos', details: err.message });
    }
    res.status(200).json({ pedidos });
  });
};

// Atualizar pedido
exports.updatePedido = (req, res) => {
  const { id } = req.params;
  const { clienteId, status } = req.body;

  PedidoModel.updatePedido(id, clienteId, status, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar pedido', details: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.status(200).json({ message: 'Pedido atualizado com sucesso' });
  });
};

// Excluir pedido
exports.deletePedido = (req, res) => {
  const { id } = req.params;
  PedidoModel.deletePedido(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir pedido', details: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.status(200).json({ message: 'Pedido excluído com sucesso' });
  });
};
