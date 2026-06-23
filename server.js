const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./loja.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        titulo TEXT, 
        preco REAL, 
        qtd INTEGER, 
        img TEXT,
        categoria TEXT
    )`);
    // A tabela de vendas agora tem a coluna TAMANHO
    db.run(`CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        titulo TEXT, 
        preco REAL, 
        tamanho TEXT,
        data TEXT
    )`);
});

app.get('/produtos', (req, res) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => { res.json(rows); });
});

app.post('/produtos', (req, res) => {
    const { titulo, preco, qtd, img, categoria } = req.body;
    db.run("INSERT INTO produtos (titulo, preco, qtd, img, categoria) VALUES (?, ?, ?, ?, ?)", 
        [titulo, preco, qtd, img, categoria || 'Outros'], function() { res.json({ id: this.lastID }); });
});

app.delete('/produtos/:id', (req, res) => {
    db.run("DELETE FROM produtos WHERE id = ?", [req.params.id], () => { res.json({ success: true }); });
});

app.post('/produtos/reset', (req, res) => {
    db.run("DELETE FROM produtos", [], () => { res.json({ success: true }); });
});

app.get('/vendas', (req, res) => {
    db.all("SELECT * FROM vendas ORDER BY id DESC", [], (err, rows) => { res.json(rows); });
});

app.post('/vender', (req, res) => {
    const { id, titulo, preco, tamanho } = req.body;
    db.get("SELECT qtd FROM produtos WHERE id = ?", [id], (err, row) => {
        if (!row || row.qtd <= 0) return res.status(400).json({ error: "Sem estoque" });
        
        db.run("UPDATE produtos SET qtd = qtd - 1 WHERE id = ?", [id], () => {
            // Salva o tamanho escolhido junto com a venda
            db.run("INSERT INTO vendas (titulo, preco, tamanho, data) VALUES (?, ?, ?, ?)", 
                [titulo, preco, tamanho, new Date().toLocaleString()], () => {
                res.json({ success: true });
            });
        });
    });
});

app.post('/vendas/reset', (req, res) => {
    db.run("DELETE FROM vendas", [], () => { res.json({ success: true }); });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
