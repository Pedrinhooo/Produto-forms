const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());


const mongoURL = 'teste';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch((error) => {
        console.log('Erro ao conectar ao MongoDB:', error);
    });
// Definição do esquema do produto
const produtoSchema = new mongoose.Schema({
    nome: String,
    descricao: String,
    preco: Number
});

// Modelo do produto
const Produto = mongoose.model('Produto', produtoSchema);

// Configuração do middleware para tratar requisições com JSON
app.use(express.json());

// Rotas
app.get('/produtos', (req, res) => {
    Produto.find()
        .then((produtos) => {
            res.json(produtos);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        });
});

app.post('/produtos', (req, res) => {
    const { nome, descricao, preco } = req.body;
    console.log(nome, descricao, preco)
    const produto = new Produto({ nome, descricao, preco });
    produto.save()
        .then((dados) => {
            console.log(dados)
            res.sendStatus(201);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao salvar produto' });
        });
});

app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco } = req.body;
    console.log(nome,descricao,preco)
    Produto.findByIdAndUpdate(id, { nome, descricao, preco })
        .then((dados) => {
            console.log(dados)
            res.sendStatus(204);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao atualizar produto' });
        });
});

app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    Produto.findByIdAndDelete(id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erro ao excluir produto' });
        });
});

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
