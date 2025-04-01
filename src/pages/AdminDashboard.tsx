
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useChat, Message } from '@/contexts/ChatContext';
import { Search, MessageCircle, Users, PieChart as PieChartIcon, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const { expenses, getTotalAmount, getCategoryTotals } = useExpenses();
  const { messages } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to access the admin dashboard.
        </p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock user data for admin view
  const mockUsers = [
    { id: 2, username: 'user1', email: 'user1@example.com', status: 'active', expenses: 5 },
    { id: 3, username: 'user2', email: 'user2@example.com', status: 'inactive', expenses: 2 },
    { id: 4, username: 'user3', email: 'user3@example.com', status: 'active', expenses: 8 },
  ];

  // Filter users based on search term
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group messages by user
  const messagesByUser: Record<number, Message[]> = {};
  messages.forEach(message => {
    const userId = message.senderId !== 1 ? message.senderId : message.receiverId;
    if (userId && userId !== 1) {
      if (!messagesByUser[userId]) {
        messagesByUser[userId] = [];
      }
      messagesByUser[userId].push(message);
    }
  });

  // Count unread messages
  const unreadCount = messages.filter(
    (message) => message.receiverId === 1 && !message.isRead
  ).length;

  // Get category totals for pie chart
  const categoryData = getCategoryTotals();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Mock weekly user registrations for bar chart
  const userRegistrationData = [
    { date: '07/01', count: 3 },
    { date: '07/02', count: 5 },
    { date: '07/03', count: 2 },
    { date: '07/04', count: 7 },
    { date: '07/05', count: 4 },
    { date: '07/06', count: 6 },
    { date: '07/07', count: 8 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and monitor system performance
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockUsers.filter(u => u.status === 'active').length} active users
            </p>
          </CardContent>
        </Card>
        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(getTotalAmount())} total value
            </p>
          </CardContent>
        </Card>
        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Support Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <div className="flex items-center">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="expense-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card className="expense-card">
            <CardHeader className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <CardTitle>User Management</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 expense-input"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expenses</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.expenses}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="expense-card">
              <CardHeader>
                <CardTitle>User Registrations</CardTitle>
                <CardDescription>New users in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userRegistrationData}>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        name="New Users"
                        dataKey="count" 
                        fill="#1a365d" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="expense-card">
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Distribution of expenses by category</CardDescription>
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="expense-card mt-4">
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Performance metrics and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Average Expense</h3>
                  <p className="text-2xl font-bold">
                    {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0) / (expenses.length || 1))}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Most Active User</h3>
                  <p className="text-2xl font-bold">
                    {mockUsers.sort((a, b) => b.expenses - a.expenses)[0]?.username || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockUsers.sort((a, b) => b.expenses - a.expenses)[0]?.expenses || 0} expenses
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Top Category</h3>
                  <p className="text-2xl font-bold">
                    {categoryData.length > 0 
                      ? categoryData.sort((a, b) => b.amount - a.amount)[0].category 
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {categoryData.length > 0 
                      ? formatCurrency(categoryData.sort((a, b) => b.amount - a.amount)[0].amount)
                      : 'No data'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card className="expense-card">
            <CardHeader>
              <CardTitle>Support Messages</CardTitle>
              <CardDescription>User queries requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(messagesByUser).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(messagesByUser).map(([userId, userMessages]) => {
                    const user = mockUsers.find(u => u.id === Number(userId));
                    const unreadUserMessages = userMessages.filter(
                      m => m.receiverId === 1 && !m.isRead
                    ).length;
                    
                    return (
                      <div key={userId} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{user?.username || `User ${userId}`}</div>
                            {unreadUserMessages > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {unreadUserMessages} new
                              </Badge>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = '/chat'}
                          >
                            Reply
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Last message: {new Date(userMessages[userMessages.length - 1].timestamp).toLocaleString()}
                        </div>
                        <div className="bg-muted p-3 rounded text-sm">
                          {userMessages[userMessages.length - 1].content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No support messages to display</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
