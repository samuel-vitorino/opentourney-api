import { Pool, PoolClient } from 'pg';

// **** Variables **** //

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// **** Functions **** //

// get a new client from the pool
async function getClient(): Promise<PoolClient> {
  const client = await pool.connect();
  return client;
}

// execute a SQL query using a client
async function query(sql: string, values?: any[]): Promise<any> {
  const client = await getClient();
  try {
    const result = await client.query(sql, values);
    console.log("<result>\n", result)
    return result.rows;
  } finally {
    client.release();
  }
}

// execute multiple queries in a transaction
async function transact(queries: string[], values?: any[][]): Promise<any> {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const results = [];
    for (let idx = 0; idx < queries.length; idx++) {
      let vals = values ? values[idx] : undefined;
      vals = vals == null ? undefined : vals;
      results.push(await client.query(queries[idx], vals));
    }
    await client.query('COMMIT');
    return results;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}


// begin transaction
async function beginTransaction(): Promise<PoolClient> {
  const client = await getClient();
  await client.query('BEGIN');
  return client;
}

//query in transaction
async function queryInTransaction(client: PoolClient, sql: string, values?: any[]): Promise<any> {
  const result = await client.query(sql, values);
  return result.rows;
}

// end transaction
async function endTransaction(client: PoolClient): Promise<void> {
  await client.query('COMMIT');
  client.release();
}

// **** Export default **** //

export default {
  query,
  transact,
  beginTransaction,
  queryInTransaction,
  endTransaction
} as const;




