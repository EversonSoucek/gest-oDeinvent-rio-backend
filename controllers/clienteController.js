const ClienteModel = require("../models/clienteModel");

// Função para criar um novo cliente
// Função para criar um novo cliente
const createCliente = (req, res) => {
  const { nome, cpf_cnpj, endereco, contato, email, tipo } = req.body;

  // Validação para campos obrigatórios
  if (!nome || !cpf_cnpj) {
    return res.status(400).json({ error: "Nome e CPF/CNPJ são obrigatórios" });
  }

  // Adiciona cliente no banco usando o modelo
  ClienteModel.addCliente(
    nome,
    cpf_cnpj,
    email || null, // Usa null se o email não for fornecido
    endereco || null, // Usa null se o endereço não for fornecido
    contato || null, // Usa null se o contato não for fornecido
    tipo || "individual", // Define um valor padrão para tipo
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Erro ao adicionar cliente", details: err.message });
      }
      return res.status(201).json({
        message: "Cliente adicionado com sucesso",
        clienteId: result.id,
      });
    }
  );
};

// Função para listar os clientes
const listClientes = (req, res) => {
  const { nome, cpf_cnpj } = req.query;

  ClienteModel.getClientes(nome, cpf_cnpj, (err, clientes) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro ao listar clientes", details: err.message });
    } else {
      return res.status(200).json({ clientes });
    }
  });
};

// Função para buscar cliente por ID
const getClienteById = (req, res) => {
  const { id } = req.params;

  ClienteModel.getClienteById(id, (err, cliente) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar cliente", details: err.message });
    }

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.status(200).json(cliente);
  });
};

// Função para atualizar informações de um cliente
const updateCliente = (req, res) => {
  const { id } = req.params;
  const { nome, cpf_cnpj, email, endereco, contato, tipo } = req.body; // Incluímos `email` e `tipo`

  ClienteModel.updateCliente(
    id,
    nome,
    cpf_cnpj,
    email,
    endereco,
    contato,
    tipo,
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Erro ao atualizar cliente", details: err.message });
      }

      if (result.changes === 0) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      return res
        .status(200)
        .json({ message: "Cliente atualizado com sucesso" });
    }
  );
};

// Função para desativar (não excluir) um cliente
const deactivateCliente = (req, res) => {
  const { id } = req.params;

  ClienteModel.deactivateCliente(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro ao desativar cliente", details: err.message });
    } else {
      if (result.changes === 0) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      return res
        .status(200)
        .json({ message: "Cliente desativado com sucesso" });
    }
  });
};

// Função para excluir um cliente
const deleteCliente = (req, res) => {
  const { id } = req.params;

  // Verifique se o cliente pode ser excluído (exemplo de verificação: se tem pedidos ou transações associadas)
  // Para este exemplo, vamos permitir excluir qualquer cliente.
  ClienteModel.deleteCliente(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro ao excluir cliente", details: err.message });
    } else {
      if (result.changes === 0) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      return res.status(200).json({ message: "Cliente excluído com sucesso" });
    }
  });
};

module.exports = {
  createCliente,
  listClientes,
  updateCliente,
  deactivateCliente,
  deleteCliente,
  getClienteById,
};
