import db from '../db/dbConfig';
import { Expense } from '@/contexts/ExpenseContext';

// Interface for expense creation
interface ExpenseInput {
  userId: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Get all expenses for a user
export const getUserExpenses = async (userId: number): Promise<Expense[]> => {
  try {
    const result = await db.query(
      'SELECT id, user_id as userId, amount, category, description, date::text FROM expenses WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching user expenses:', error);
    throw new Error('Failed to fetch expenses');
  }
};

// Add a new expense
export const addExpense = async (expense: ExpenseInput): Promise<Expense> => {
  try {
    const result = await db.query(
      'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id as userId, amount, category, description, date::text',
      [expense.userId, expense.amount, expense.category, expense.description, expense.date]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding expense:', error);
    throw new Error('Failed to add expense');
  }
};

// Update an expense
export const updateExpense = async (id: number, expense: Partial<ExpenseInput>, userId: number): Promise<Expense> => {
  try {
    // Get current expense data
    const currentExpense = await db.query(
      'SELECT amount, category, description, date FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (currentExpense.rows.length === 0) {
      throw new Error('Expense not found or not authorized');
    }
    
    const current = currentExpense.rows[0];
    
    // Update with new values or keep existing ones
    const result = await db.query(
      `UPDATE expenses 
       SET amount = $1, category = $2, description = $3, date = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 AND user_id = $6 
       RETURNING id, user_id as userId, amount, category, description, date::text`,
      [
        expense.amount ?? current.amount,
        expense.category ?? current.category,
        expense.description ?? current.description,
        expense.date ?? current.date,
        id,
        userId
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating expense:', error);
    throw new Error('Failed to update expense');
  }
};

// Delete an expense
export const deleteExpense = async (id: number, userId: number): Promise<boolean> => {
  try {
    const result = await db.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Failed to delete expense');
  }
};

// Get expense analysis data (weekly expenses for the last 7 days)
export const getWeeklyExpenses = async (userId: number): Promise<{ date: string; amount: number }[]> => {
  try {
    const result = await db.query(
      `SELECT date::text, SUM(amount) as amount
       FROM expenses
       WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '6 days'
       GROUP BY date
       ORDER BY date`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching weekly expenses:', error);
    throw new Error('Failed to fetch weekly expenses');
  }
};

// Get expense totals by category
export const getCategoryTotals = async (userId: number): Promise<{ category: string; amount: number }[]> => {
  try {
    const result = await db.query(
      `SELECT category, SUM(amount) as amount
       FROM expenses
       WHERE user_id = $1
       GROUP BY category
       ORDER BY amount DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching category totals:', error);
    throw new Error('Failed to fetch category totals');
  }
};

// Get total amount of expenses for a user
export const getTotalExpenseAmount = async (userId: number): Promise<number> => {
  try {
    const result = await db.query(
      'SELECT SUM(amount) as total FROM expenses WHERE user_id = $1',
      [userId]
    );
    return parseFloat(result.rows[0]?.total || '0');
  } catch (error) {
    console.error('Error fetching total expense amount:', error);
    throw new Error('Failed to fetch total expense amount');
  }
};

// AI-based prediction for next day expense
export const predictNextDayExpense = async (userId: number): Promise<number> => {
  try {
    // Get the last 7 days of expenses
    const result = await db.query(
      `SELECT date::text, SUM(amount) as daily_total
       FROM expenses
       WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '7 days'
       GROUP BY date
       ORDER BY date DESC
       LIMIT 7`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return 0;
    }
    
    // Use a simple algorithm: average of last 3 days with a random variation
    const recentDays = result.rows.slice(0, Math.min(3, result.rows.length));
    const averageAmount = recentDays.reduce((sum, day) => sum + parseFloat(day.daily_total), 0) / recentDays.length;
    
    // Add a small random factor for variability (between 0.9 and 1.1)
    const variationFactor = 0.9 + Math.random() * 0.2;
    
    return Math.round(averageAmount * variationFactor);
  } catch (error) {
    console.error('Error predicting next day expense:', error);
    throw new Error('Failed to predict next day expense');
  }
};
