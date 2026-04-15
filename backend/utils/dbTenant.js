// backend/utils/dbTenant.js
// ============================================================
// Utilitário que encapsula queries com isolamento de tenant.
// Usa uma transação para garantir que o SET LOCAL
// só vale durante aquela query específica — sem vazamento
// de contexto entre requests concorrentes.
// ============================================================

/**
 * Executa uma query com o tenant_id configurado na sessão do PostgreSQL.
 * O SET LOCAL garante que a variável é resetada ao fim da transação.
 *
 * @param {import('pg').Pool} pool       - Pool de conexões do pg
 * @param {string}            tenantId   - UUID do tenant autenticado
 * @param {string}            query      - SQL a ser executado
 * @param {Array}             params     - Parâmetros da query
 * @returns {Promise<import('pg').QueryResult>}
 */
async function queryComTenant(pool, tenantId, query, params = []) {
  // Pega uma conexão dedicada do pool
  const client = await pool.connect()

  try {
    // Inicia transação — SET LOCAL só vale dentro dela
    await client.query('BEGIN')

    // Configura o tenant_id na sessão do PostgreSQL
    // O RLS vai usar esse valor para filtrar as linhas
    await client.query(
      `SET LOCAL app.current_tenant_id = $1`,
      [tenantId]
    )

    // Executa a query real — o RLS filtra automaticamente
    const resultado = await client.query(query, params)

    // Confirma a transação
    await client.query('COMMIT')

    return resultado

  } catch (erro) {
    // Desfaz tudo em caso de erro
    await client.query('ROLLBACK')
    throw erro

  } finally {
    // SEMPRE devolve a conexão ao pool, mesmo com erro
    client.release()
  }
}

module.exports = { queryComTenant }


// ============================================================
// EXEMPLO DE USO em uma rota:
//
// const { queryComTenant } = require('./utils/dbTenant')
//
// app.get('/faturas', verificaAutenticacao, async (req, res) => {
//   const resultado = await queryComTenant(
//     pool,
//     req.usuario.tenantId,       // vem do JWT decodificado
//     'SELECT * FROM faturas',
//     []
//   )
//   res.json(resultado.rows)
// })
// ============================================================