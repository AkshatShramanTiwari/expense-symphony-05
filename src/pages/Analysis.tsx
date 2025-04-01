
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useExpenses } from '@/contexts/ExpenseContext';

const Analysis = () => {
  const { expenses, getWeeklyExpenses, getCategoryTotals, predictNextDayExpense, loading } = useExpenses();
  const [timeRange, setTimeRange] = useState('week');
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date strings for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get weekly data
  const weeklyData = getWeeklyExpenses();
  
  // Get category totals
  const categoryData = getCategoryTotals();
  
  // Predicted expense
  const prediction = predictNextDayExpense();

  // Generate trend data
  const trendData = [
    ...weeklyData.slice(-3),
    { date: 'Tomorrow', amount: prediction },
  ];

  // Daily average
  const dailyAverage = weeklyData.reduce((sum, day) => sum + day.amount, 0) / weeklyData.length;

  // Find day with highest expense
  const maxExpenseDay = weeklyData.reduce(
    (max, day) => (day.amount > max.amount ? day : max),
    { date: '', amount: 0 }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading analysis data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Expense Analysis</h1>
        <p className="text-muted-foreground">
          Visualize and analyze your spending patterns
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="expense-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dailyAverage)}</div>
            <p className="text-xs text-muted-foreground">
              Based on the last 7 days
            </p>
          </CardContent>
        </Card>
        <Card className="expense-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Spending Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maxExpenseDay.date ? formatDate(maxExpenseDay.date) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {maxExpenseDay.amount ? formatCurrency(maxExpenseDay.amount) : 'No data'}
            </p>
          </CardContent>
        </Card>
        <Card className="expense-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Predicted Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(prediction)}</div>
            <p className="text-xs text-muted-foreground">
              Expected for tomorrow
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline">
          <Card className="expense-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Expense Timeline</CardTitle>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
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
                    <Legend />
                    <Bar 
                      name="Expense Amount"
                      dataKey="amount" 
                      fill="#38a169" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card className="expense-card">
            <CardHeader>
              <CardTitle>Expense by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Amount']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prediction">
          <Card className="expense-card">
            <CardHeader>
              <CardTitle>Expense Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
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
                    <Legend />
                    <Line 
                      type="monotone" 
                      name="Actual Expense"
                      dataKey="amount" 
                      stroke="#1a365d" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium text-lg mb-2">How is this predicted?</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI prediction model analyzes your spending patterns over time to estimate future expenses. 
                  The prediction is based on your spending history, day-of-week patterns, and recent trends.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Tomorrow's predicted expense: <span className="font-medium">{formatCurrency(prediction)}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Spending Insights */}
      <Card className="expense-card">
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.length > 0 ? (
              <>
                <p>
                  Your top spending category is <span className="font-medium">{categoryData[0].category}</span> at {formatCurrency(categoryData[0].amount)}, 
                  representing {((categoryData[0].amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(0)}% of your total expenses.
                </p>
                
                <p>
                  Your average daily spending is {formatCurrency(dailyAverage)}. 
                  {maxExpenseDay.date && (
                    <> You spent the most on {formatDate(maxExpenseDay.date)} ({formatCurrency(maxExpenseDay.amount)}).</>
                  )}
                </p>
                
                {weeklyData.length >= 4 && (
                  <p>
                    {trendData[3].amount > trendData[2].amount 
                      ? 'Your spending is predicted to increase tomorrow.' 
                      : 'Your spending is predicted to decrease tomorrow.'}
                  </p>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Add some expenses to see your spending insights.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analysis;
