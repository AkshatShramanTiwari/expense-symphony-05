
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Define the Expense interface
export interface Expense {
  id: number;
  userId: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Define the ExpenseContext interface
interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  deleteExpense: (id: number) => void;
  updateExpense: (id: number, expense: Partial<Omit<Expense, 'id' | 'userId'>>) => void;
  loading: boolean;
  getTotalAmount: () => number;
  getWeeklyExpenses: () => { date: string; amount: number }[];
  getCategoryTotals: () => { category: string; amount: number }[];
  predictNextDayExpense: () => number;
}

// Create the context with a default value
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Mock expense data for demo
const mockExpenses: Expense[] = [
  {
    id: 1,
    userId: 2,
    amount: 1500,
    category: 'Food',
    description: 'Dinner with friends',
    date: '2023-06-19',
  },
  {
    id: 2,
    userId: 2,
    amount: 500,
    category: 'Transportation',
    description: 'Taxi fare',
    date: '2023-06-18',
  },
  {
    id: 3,
    userId: 2,
    amount: 3000,
    category: 'Shopping',
    description: 'New clothes',
    date: '2023-06-17',
  },
  {
    id: 4,
    userId: 2,
    amount: 1000,
    category: 'Entertainment',
    description: 'Movie tickets',
    date: '2023-06-16',
  },
  {
    id: 5,
    userId: 2,
    amount: 2000,
    category: 'Groceries',
    description: 'Weekly groceries',
    date: '2023-06-15',
  },
  {
    id: 6,
    userId: 1,
    amount: 2500,
    category: 'Office supplies',
    description: 'New keyboard',
    date: '2023-06-19',
  },
  {
    id: 7,
    userId: 1,
    amount: 1800,
    category: 'Food',
    description: 'Team lunch',
    date: '2023-06-18',
  },
];

// Generate current week's dates for demo data
const generateWeekDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Update mock expenses with current week dates
const updateMockExpensesWithCurrentDates = () => {
  const dates = generateWeekDates();
  
  // Replace dates in mock data
  return mockExpenses.map((expense, index) => ({
    ...expense,
    date: dates[index % dates.length]
  }));
};

// Custom hook to use the ExpenseContext
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

// ExpenseProvider component
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses on mount and when user changes
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update expenses with current week dates
        const updatedExpenses = updateMockExpensesWithCurrentDates();
        
        // Filter expenses for the current user
        const userExpenses = user 
          ? updatedExpenses.filter(expense => expense.userId === user.id)
          : [];
        
        setExpenses(userExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error('Failed to load expenses.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  // Add a new expense
  const addExpense = (expense: Omit<Expense, 'id' | 'userId'>) => {
    if (!user) {
      toast.error('You must be logged in to add expenses.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const newExpense: Expense = {
          ...expense,
          id: Math.floor(Math.random() * 10000),
          userId: user.id,
        };
        
        setExpenses(prev => [...prev, newExpense]);
        setLoading(false);
        toast.success('Expense added successfully!');
      }, 500);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense.');
      setLoading(false);
    }
  };

  // Delete an expense
  const deleteExpense = (id: number) => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setExpenses(prev => prev.filter(expense => expense.id !== id));
        setLoading(false);
        toast.success('Expense deleted successfully!');
      }, 500);
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense.');
      setLoading(false);
    }
  };

  // Update an expense
  const updateExpense = (id: number, updatedFields: Partial<Omit<Expense, 'id' | 'userId'>>) => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setExpenses(prev =>
          prev.map(expense =>
            expense.id === id ? { ...expense, ...updatedFields } : expense
          )
        );
        setLoading(false);
        toast.success('Expense updated successfully!');
      }, 500);
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense.');
      setLoading(false);
    }
  };

  // Get total expense amount
  const getTotalAmount = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Get weekly expenses
  const getWeeklyExpenses = () => {
    // Get the last 7 days
    const dates = generateWeekDates();
    
    // Initialize with all dates having zero amount
    const weeklyData = dates.map(date => ({
      date,
      amount: 0,
    }));
    
    // Sum up expenses for each date
    expenses.forEach(expense => {
      const index = weeklyData.findIndex(item => item.date === expense.date);
      if (index !== -1) {
        weeklyData[index].amount += expense.amount;
      }
    });
    
    return weeklyData;
  };

  // Get total amount by category
  const getCategoryTotals = () => {
    const categories: Record<string, number> = {};
    
    expenses.forEach(expense => {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    });
    
    return Object.entries(categories).map(([category, amount]) => ({
      category,
      amount,
    }));
  };

  // AI-based prediction for next day expense
  const predictNextDayExpense = () => {
    if (expenses.length === 0) return 0;
    
    // Simple prediction based on average of last 3 days
    const weeklyData = getWeeklyExpenses();
    const recentDays = weeklyData.slice(-3);
    const averageAmount = recentDays.reduce((sum, day) => sum + day.amount, 0) / recentDays.length;
    
    // Add a small random factor for variability
    const variationFactor = 0.9 + Math.random() * 0.2; // Random factor between 0.9 and 1.1
    
    return Math.round(averageAmount * variationFactor);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        loading,
        getTotalAmount,
        getWeeklyExpenses,
        getCategoryTotals,
        predictNextDayExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
