
import { Pool, PoolClient } from 'pg';

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dbsexpensemanager',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Global event to notify of SQL queries
type QueryListener = (query: string) => void;
const queryListeners: QueryListener[] = [];

// Register a listener for query notifications
const registerQueryListener = (listener: QueryListener) => {
  queryListeners.push(listener);
  return () => {
    const index = queryListeners.indexOf(listener);
    if (index > -1) {
      queryListeners.splice(index, 1);
    }
  };
};

// Notify all listeners of a query
const notifyQueryExecution = (query: string) => {
  queryListeners.forEach(listener => listener(query));
};

// Test the database connection
const testConnection = async (): Promise<boolean> => {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    console.log('Database connection successful');
    notifyQueryExecution('SELECT 1'); // Simple test query
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  } finally {
    if (client) client.release();
  }
};

// Execute a query with parameters
const query = async (text: string, params: any[] = []): Promise<any> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    
    // Format parameters for display
    const formattedParams = params.map(p => 
      typeof p === 'string' ? `'${p}'` : p
    ).join(', ');
    
    // Format the query with parameters for display
    let displayQuery = text;
    if (params.length > 0) {
      let paramIndex = 0;
      displayQuery = text.replace(/\$\d+/g, () => {
        const param = params[paramIndex];
        paramIndex++;
        if (typeof param === 'string') {
          return `'${param}'`;
        } else {
          return String(param);
        }
      });
    }
    
    // Notify listeners of the query execution
    notifyQueryExecution(displayQuery);
    
    return res;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Execute a transaction
const transaction = async (callback: (client: PoolClient) => Promise<any>): Promise<any> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    notifyQueryExecution('BEGIN TRANSACTION');
    
    const result = await callback(client);
    
    await client.query('COMMIT');
    notifyQueryExecution('COMMIT');
    
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    notifyQueryExecution('ROLLBACK');
    
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default {
  query,
  transaction,
  testConnection,
  pool,
  registerQueryListener,
};
