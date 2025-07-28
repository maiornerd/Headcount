// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // Nome do usuário (geralmente postgres)
  host: 'localhost',         // Onde está o banco
  database: 'orcamento_db',  // Nome do banco que você criou
  password: 'Al4n$!lv@',        // Coloque a senha que você usou na instalação
  port: 5432,                // Porta padrão do PostgreSQL
});

module.exports = pool;
