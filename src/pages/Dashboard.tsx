
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Wallet, TrendingUp, Calendar } from 'lucide-react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const {
    expenses,
    getTotalAmount,
    getWeeklyExpenses,
    getCategoryTotals,
    predictNextDayExpense,
    loading,
  } = useExpenses();
  const navigate = useNavigate();

  const totalAmount = getTotalAmount();
  const weeklyExpenses = getWeeklyExpenses();
  const categoryTotals = getCategoryTotals();
  const predictedExpense = predictNextDayExpense();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Format date strings for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // Calculate total expenses this week
  const thisWeekTotal = weeklyExpenses.reduce((sum, day) => sum + day.amount, 0);
  
  // Estimate if spending is increasing or decreasing
  const isIncreasing = weeklyExpenses.length >= 2 && 
    weeklyExpenses[weeklyExpenses.length - 1].amount > weeklyExpenses[weeklyExpenses.length - 2].amount;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your expense management dashboard
          </p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 expense-button"
          onClick={() => navigate('/add-expense')}
        >
          Add New Expense
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Spending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(thisWeekTotal)}</div>
            <div className="flex items-center pt-1">
              {isIncreasing ? (
                <ArrowUpRight className="h-4 w-4 text-destructive mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-accent mr-1" />
              )}
              <p className={`text-xs ${isIncreasing ? 'text-destructive' : 'text-accent'}`}>
                {isIncreasing ? 'Increasing' : 'Decreasing'} trend
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Predicted Expense</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(predictedExpense)}</div>
            <p className="text-xs text-muted-foreground">
              Expected tomorrow
            </p>
          </CardContent>
        </Card>
        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categoryTotals.length > 0
                ? categoryTotals.sort((a, b) => b.amount - a.amount)[0].category
                : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {categoryTotals.length > 0
                ? `${formatCurrency(categoryTotals.sort((a, b) => b.amount - a.amount)[0].amount)}`
                : 'No expenses yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Weekly Expense Chart */}
        <Card className="expense-card">
          <CardHeader>
            <CardTitle>Weekly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyExpenses}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${value}`, 'Amount']}
                    labelFormatter={formatDate}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#38a169" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="expense-card">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              {categoryTotals.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryTotals}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                    >
                      {categoryTotals.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  No category data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Chart */}
      <Card className="expense-card">
        <CardHeader>
          <CardTitle>Expense Prediction (Next 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  ...weeklyExpenses.slice(-3),
                  { date: 'Tomorrow', amount: predictedExpense },
                ]}
              >
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => value === 'Tomorrow' ? value : formatDate(value)}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelFormatter={(value) => value === 'Tomorrow' ? value : formatDate(value as string)}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#1a365d" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="expense-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.length > 0 ? (
              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <IndianRupee className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">{expense.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(expense.amount)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                {expenses.length > 5 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/expenses')}
                  >
                    View All Transactions
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No transactions yet</p>
                <Button 
                  className="mt-4 bg-accent hover:bg-accent/90"
                  onClick={() => navigate('/add-expense')}
                >
                  Add Your First Expense
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
