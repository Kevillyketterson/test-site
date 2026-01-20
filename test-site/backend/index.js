// 🔐 Carregar variáveis de ambiente (.env local)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 DEBUG: ver se a DATABASE_URL está sendo lida
console.log('DATABASE_URL carregada?', !!process.env.DATABASE_URL);

// 🔗 Conexão com PostgreSQL (Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔍 Teste imediato de conexão com o banco
pool.query('SELECT 1')
  .then(() => console.log('✅ Conectado ao banco com sucesso'))
  .catch(err => console.error('❌ Erro ao conectar no banco:', err));

// =======================
// ROTA RAIZ (CORREÇÃO DO Cannot GET /)
// =======================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Integração funcionando 🎉'
  });
});

// =======================
// ROTA DE TESTE COM BANCO
// =======================
app.get('/test', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_logs (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query('INSERT INTO test_logs DEFAULT VALUES');

    res.json({
      success: true,
      message: 'Integração funcionando 🎉'
    });

  } catch (err) {
    console.error('❌ ERRO NA ROTA /test:', err);

    res.status(500).json({
      error: err.message || err.toString()
    });
  }
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
