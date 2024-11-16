const TransacaoModel = require('../models/transacaoModel');

// Criar uma nova transação
exports.createTransacao = (req, res) => {
  const { data, tipo, valor, produtoId, pedidoId } = req.body;

  if (!data || !tipo || !valor || !produtoId) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  if (valor <= 0 || !['Entrada', 'Saída'].includes(tipo)) {
    return res.status(400).json({ error: 'Valor inválido ou tipo inválido' });
  }

  TransacaoModel.addTransacao(data, tipo, valor, produtoId, pedidoId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar transação', details: err.message });
    }
    res.status(201).json({ message: 'Transação criada com sucesso', transacaoId: result.id });
  });
};

// Listar transações
exports.listTransacoes = (req, res) => {
  const { tipo, dataInicio, dataFim } = req.query;

  TransacaoModel.getTransacoes(tipo, dataInicio, dataFim, (err, transacoes) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar transações', details: err.message });
    }
    res.status(200).json({ transacoes });
  });
};

// Atualizar uma transação
exports.updateTransacao = (req, res) => {
  const { id } = req.params;
  const { data, tipo, valor, produtoId, pedidoId } = req.body;

  if (!data || !tipo || !valor || !produtoId) {
    return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
  }

  if (valor <= 0 || !['Entrada', 'Saída'].includes(tipo)) {
    return res.status(400).json({ error: 'Valor inválido ou tipo inválido' });
  }

  TransacaoModel.updateTransacao(id, data, tipo, valor, produtoId, pedidoId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar transação', details: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.status(200).json({ message: 'Transação atualizada com sucesso' });
  });
};

// Deletar uma transação
exports.deleteTransacao = (req, res) => {
  const { id } = req.params;

  TransacaoModel.deleteTransacao(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar transação', details: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.status(200).json({ message: 'Transação deletada com sucesso' });
  });
};
