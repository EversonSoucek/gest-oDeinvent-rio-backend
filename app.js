const express = require('express');
const session = require('express-session');
const path = require('path');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const fornecedorController = require('./controllers/fornecedorController');
const pedidoController = require('./controllers/pedidoController');
const itemPedidoController = require('./controllers/itemPedidoController');
const transacaoController = require('./controllers/transacaoController');

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração da sessão
app.use(session({
  secret: 'segredo_da_sessao',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

// Rotas de usuários
app.post('/register', userController.register);
app.post('/login', userController.login);
app.post('/logout', userController.logout);

// Rotas de produtos
app.post('/products', productController.addProduct);
app.get('/products', productController.getAllProducts);
app.get('/products/:id', productController.getProductById);
app.put('/products/:id', productController.updateProduct);
app.delete('/products/:id', productController.deleteProduct);

// Rotas de fornecedores
app.post('/fornecedores', fornecedorController.addFornecedor);
app.get('/fornecedores', fornecedorController.getAllFornecedores);
app.get('/fornecedores/:id', fornecedorController.getFornecedorById);
app.put('/fornecedores/:id', fornecedorController.updateFornecedor);
app.delete('/fornecedores/:id', fornecedorController.deleteFornecedor);


app.post('/pedidos', pedidoController.createPedido);
app.get('/pedidos', pedidoController.listPedidos);
app.put('/pedidos/:id', pedidoController.updatePedido);
app.delete('/pedidos/:id', pedidoController.deletePedido);

app.post('/itensPedido', itemPedidoController.addItem);
app.get('/itensPedido/:pedidoId', itemPedidoController.listItems);
app.put('/itensPedido/:id', itemPedidoController.updateItem);
app.delete('/itensPedido/:id', itemPedidoController.deleteItem);

app.post('/clientes', clienteController.createCliente);
app.get('/clientes', clienteController.listClientes);
app.put('/clientes/:id', clienteController.updateCliente);
app.delete('/clientes/:id', clienteController.deleteCliente);
app.post('/clientes/:id/deactivate', clienteController.deactivateCliente);

app.post('/transacoes', transacaoController.createTransacao);
app.get('/transacoes', transacaoController.listTransacoes);
app.put('/transacoes/:id', transacaoController.updateTransacao);
app.delete('/transacoes/:id', transacaoController.deleteTransacao);

// Configurar porta e iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
