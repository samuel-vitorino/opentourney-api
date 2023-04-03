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
    return result.rows;
  } finally {
    client.release();
  }
}

// **** Export default **** //

export default {
  query,
} as const;




