// 🔐 Carregar variáveis de ambiente (.env local)
//require('dotenv').config();

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
// ROTA DE TESTE
// =======================
app.get('/test', async (req, res) => {
  try {
    // Criar tabela se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_logs (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Inserir registro
    await pool.query('INSERT INTO test_logs DEFAULT VALUES');

    res.json({
      success: true,
      message: 'Integração funcionando 🎉'
    });

  } catch (err) {
    // 🔥 MOSTRAR ERRO REAL
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

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
