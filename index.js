// index.js

const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');

const app = express();
app.set('view engine', 'ejs');

// Desativar a adição automática das colunas createdAt e updatedAt
const sequelize = new Sequelize('minha_aplicacao', 'root', 'fatec', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
      timestamps: false // Desativa a adição automática das colunas de data
    }
  });
  

// Definição dos modelos (tabelas)
const Usuario = sequelize.define('usuario', {
  nome: Sequelize.STRING,
  email: Sequelize.STRING,
});

const Produto = sequelize.define('produto', {
  nome: Sequelize.STRING,
  preco: Sequelize.FLOAT,
});

const Pedido = sequelize.define('pedido', {
  quantidade: Sequelize.INTEGER,
});

// Definição das associações (relacionamentos)
Usuario.belongsToMany(Produto, { through: Pedido });
Produto.belongsToMany(Usuario, { through: Pedido });

// Sincronização dos modelos com o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Banco de dados conectado e modelos sincronizados.');
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

// Middleware para analisar corpos das requisições
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.get('/', (req, res) => {
  res.render('home')
});

// Rota para a página de input
app.get('/input', (req, res) => {
    res.render('input');
  });
  
  // Rota para processar o formulário de input
  app.post('/processar-input', async (req, res) => {
    try {
      const { nome, email } = req.body;
      // Salvar os dados no banco de dados
      await Usuario.create({ nome, email });
      res.redirect('usuarios');
    } catch (error) {
      res.status(500).send('Erro ao salvar os dados no banco de dados.');
    }
  });

// Exemplo de rota com template EJS
app.get('/usuarios', async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.render('usuarios', { usuarios });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

