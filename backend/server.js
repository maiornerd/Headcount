// ...existing code...


// ===== ROTAS =====
// Rota GET para buscar todos os orçamentos (headcount)
app.get('/orcamentos', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM headcount ORDER BY id ASC');
    client.release();
    // Mapeia os campos do banco (snake_case) para camelCase para o frontend
    const dados = result.rows.map(row => ({
      numEmpresa: row.num_empresa,
      nomeEmpresa: row.nome_empresa,
      centroCustoContabil: row.centro_custo_contabil,
      centroCustoFolha: row.centro_custo_folha,
      codSecao: row.cod_secao,
      atividade: row.atividade,
      superintendente: row.superintendente,
      gestorArea: row.gestor_area,
      responsavelSetor: row.responsavel_setor,
      descSetor: row.desc_setor,
      codigo: row.codigo,
      funcao: row.funcao,
      jul25: row.jul25,
      ago25: row.ago25,
      set25: row.set25,
      out25: row.out25,
      nov25: row.nov25,
      dez25: row.dez25,
      total: row.total,
      realizado: row.realizado
    }));
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar orçamentos' });
  }
});

// ...imports e configuração do app...
// Rota para salvar novo orçamento (agora no local correto, após a configuração do app)
// ...imports e configuração do app...
// Rota para salvar novo orçamento (agora no local correto, após a configuração do app)
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
// ...restante do código permanece igual...
// Rota para download do arquivo .xlsx (deve ficar após todas as outras rotas e antes do app.listen)
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

// Rota para salvar novo orçamento
app.post('/orcamentos', async (req, res) => {
  const {
    numEmpresa, nomeEmpresa, centroCustoContabil, centroCustoFolha, codSecao, atividade,
    superintendente, gestorArea, responsavelSetor, descSetor,
    codigo, funcao, jul25, ago25, set25, out25, nov25, dez25, total, realizado
  } = req.body;
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO headcount (
        num_empresa, nome_empresa, centro_custo_contabil, centro_custo_folha, cod_secao, atividade,
        superintendente, gestor_area, responsavel_setor, desc_setor,
        codigo, funcao, jul25, ago25, set25, out25, nov25, dez25, total, realizado
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)` ,
      [
        numEmpresa, nomeEmpresa, centroCustoContabil, centroCustoFolha, codSecao, atividade,
        superintendente, gestorArea, responsavelSetor, descSetor,
        codigo, funcao, jul25, ago25, set25, out25, nov25, dez25, total, realizado
      ]
    );
    res.status(201).json({ mensagem: 'Orçamento salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    res.status(500).json({ mensagem: 'Erro ao salvar orçamento' });
  } finally {
    client.release();
  }
});

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

// Rota para download do arquivo .xlsx
app.get('/download/xlsx', async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orçamentos');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Nº da Empresa', key: 'num_empresa', width: 15 },
      { header: 'Nome da Empresa', key: 'nome_empresa', width: 25 },
      { header: 'Centro de Custo Contábil', key: 'centro_custo_contabil', width: 20 },
      { header: 'Centro de Custo Folha', key: 'centro_custo_folha', width: 20 },
      { header: 'Código da Seção', key: 'cod_secao', width: 15 },
      { header: 'Atividade', key: 'atividade', width: 20 },
      { header: 'Superintendente', key: 'superintendente', width: 20 },
      { header: 'Gestor da Área', key: 'gestor_area', width: 20 },
      { header: 'Responsável pelo Setor', key: 'responsavel_setor', width: 20 },
      { header: 'Descrição do Setor', key: 'desc_setor', width: 25 },
      { header: 'Código', key: 'codigo', width: 12 },
      { header: 'Função', key: 'funcao', width: 20 },
      { header: 'Jul/25', key: 'jul25', width: 10 },
      { header: 'Ago/25', key: 'ago25', width: 10 },
      { header: 'Set/25', key: 'set25', width: 10 },
      { header: 'Out/25', key: 'out25', width: 10 },
      { header: 'Nov/25', key: 'nov25', width: 10 },
      { header: 'Dez/25', key: 'dez25', width: 10 },
      { header: 'Total', key: 'total', width: 10 },
      { header: 'Realizado', key: 'realizado', width: 12 }
    ];

    const client = await pool.connect();
    const result = await client.query('SELECT * FROM headcount ORDER BY id ASC');
    client.release();

    result.rows.forEach(row => worksheet.addRow(row));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=orcamentos.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao gerar arquivo xlsx:', error);
    res.status(500).json({ mensagem: 'Erro ao gerar arquivo xlsx' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});
