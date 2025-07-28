const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'segredo123'; // Você pode trocar

const { Pool } = require('pg');

// Substitua com os dados reais do seu banco PostgreSQL
const pool = new Pool({
  user: 'postgres',   //nome que você criou
  host: 'localhost',
  database: 'orcamento_db',   //nome do banco de dados (conforme pgAdmin)
  password: 'Al4n$!lv@',   //a senha que você definiu no pgAdmin
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Simulação de banco de dados
const usuarios = [
  { id: 1, nome: 'Alan', email: 'alan@email.com', senha: '123456', perfil: 'diretor' },
  { id: 2, nome: 'Carlos', email: 'gestor@email.com', senha: '123456', perfil: 'gestor' }
];

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, nome, perfil FROM usuarios WHERE email = $1 AND senha = $2',
      [email, senha]
    );
    if (result.rows.length > 0) {
      const usuario = result.rows[0];
      // Gera o token JWT
      const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({
        nome: usuario.nome,
        perfil: usuario.perfil,
        token: token
      });
    } else {
      res.status(401).json({ mensagem: 'Usuário ou senha inválidos' });
    }
  } catch (error) {
    console.error('Erro ao verificar login:', error);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  } finally {
    client.release();
  }
});

// Rota protegida (exemplo de painel)
app.get('/painel', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ mensagem: 'Token não fornecido' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    return res.json({ mensagem: `Bem-vindo ao painel`, perfil: decoded.perfil });
  } catch (err) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});
