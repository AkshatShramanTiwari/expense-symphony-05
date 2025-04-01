
// Mock/client-safe database implementation for browser environment
import { toast } from "sonner";

// Type definitions
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

// Mock database connection test
const testConnection = async (): Promise<boolean> => {
  console.log('Testing database connection (client-side mock)');
  // Simulate successful connection in browser
  notifyQueryExecution('SELECT 1'); // Simple test query
  return true;
};

// Mock query execution
const query = async (text: string, params: any[] = []): Promise<any> => {
  console.log('Executing query (client-side mock):', { text, params });
  
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
  
  // This is a client-side mock - we'll return mock data based on the query
  // In a real app, this would be an API call to a backend
  return mockQueryResponse(text, params);
};

// Mock transaction
const transaction = async (callback: (client: any) => Promise<any>): Promise<any> => {
  console.log('Beginning transaction (client-side mock)');
  notifyQueryExecution('BEGIN TRANSACTION');
  
  try {
    const result = await callback({
      query: async (text: string, params: any[] = []) => query(text, params)
    });
    
    notifyQueryExecution('COMMIT');
    return result;
  } catch (error) {
    notifyQueryExecution('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  }
};

// Helper function to generate mock responses based on query type
const mockQueryResponse = (text: string, params: any[]): any => {
  // Based on the query text, return appropriate mock data
  
  // Mock user login
  if (text.includes('SELECT id, username, email, role, password_hash FROM users')) {
    return {
      rows: [
        {
          id: 1,
          username: params[0] === 'admin' ? 'admin' : 'user',
          email: params[0] === 'admin' ? 'admin@example.com' : 'user@example.com',
          role: params[0] === 'admin' ? 'admin' : 'user',
          password_hash: '$2a$10$fake_hash' // Just a mock
        }
      ],
      rowCount: 1
    };
  }
  
  // Mock user expenses
  if (text.includes('SELECT id, user_id as userId, amount, category, description, date::text FROM expenses')) {
    return {
      rows: [
        { id: 1, userId: params[0], amount: 120.50, category: 'Food', description: 'Lunch', date: '2023-04-01' },
        { id: 2, userId: params[0], amount: 75.00, category: 'Transport', description: 'Uber', date: '2023-04-02' },
        { id: 3, userId: params[0], amount: 200.00, category: 'Entertainment', description: 'Movie tickets', date: '2023-04-03' }
      ],
      rowCount: 3
    };
  }
  
  // Mock add expense
  if (text.includes('INSERT INTO expenses')) {
    return {
      rows: [{
        id: Math.floor(Math.random() * 1000),
        userId: params[0],
        amount: params[1],
        category: params[2],
        description: params[3],
        date: params[4]
      }],
      rowCount: 1
    };
  }
  
  // Mock weekly expenses
  if (text.includes('SELECT date::text, SUM(amount) as amount FROM expenses')) {
    return {
      rows: [
        { date: '2023-03-26', amount: '45.00' },
        { date: '2023-03-27', amount: '60.00' },
        { date: '2023-03-28', amount: '35.50' },
        { date: '2023-03-29', amount: '120.75' },
        { date: '2023-03-30', amount: '85.25' },
        { date: '2023-03-31', amount: '95.50' },
        { date: '2023-04-01', amount: '70.80' }
      ],
      rowCount: 7
    };
  }
  
  // Mock category totals
  if (text.includes('SELECT category, SUM(amount) as amount FROM expenses')) {
    return {
      rows: [
        { category: 'Food', amount: '320.50' },
        { category: 'Transport', amount: '150.00' },
        { category: 'Entertainment', amount: '280.75' },
        { category: 'Shopping', amount: '420.25' },
        { category: 'Utilities', amount: '180.00' }
      ],
      rowCount: 5
    };
  }
  
  // Mock total expense amount
  if (text.includes('SELECT SUM(amount) as total FROM expenses')) {
    return {
      rows: [{ total: '1351.50' }],
      rowCount: 1
    };
  }
  
  // Default empty response
  return { rows: [], rowCount: 0 };
};

// Export a mock of the pool for type compatibility
const pool = {
  connect: async () => {
    return {
      query: async (text: string, params: any[] = []) => query(text, params),
      release: () => {}
    };
  },
  query: async (text: string, params: any[] = []) => query(text, params)
};

export default {
  query,
  transaction,
  testConnection,
  pool,
  registerQueryListener,
};
