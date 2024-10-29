const express = require('express');
const session = require('express-session');
const path = require('path');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const fornecedorController = require('./controllers/fornecedorController');

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

// Configurar porta e iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
