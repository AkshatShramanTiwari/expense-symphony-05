
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock users for demo purposes
const MOCK_USERS = {
  user: { email: 'user@example.com', password: 'user123', role: 'user' },
  admin: { email: 'admin@example.com', password: 'admin@123', role: 'admin' }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // Populate form based on role selection
  useEffect(() => {
    if (role === 'admin') {
      setEmail(MOCK_USERS.admin.email);
      setPassword(MOCK_USERS.admin.password);
    } else if (role === 'user' && !email) {
      setEmail(MOCK_USERS.user.email);
      setPassword(MOCK_USERS.user.password);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for mock users first
    if (role === 'admin' && email === MOCK_USERS.admin.email && password === MOCK_USERS.admin.password) {
      const success = await login(email, password, 'admin');
      if (success) {
        toast.success('Admin login successful', {
          description: 'Welcome to DBS Expense Manager'
        });
        navigate('/');
      }
    } else if (role === 'user' && email === MOCK_USERS.user.email && password === MOCK_USERS.user.password) {
      const success = await login(email, password, 'user');
      if (success) {
        toast.success('User login successful', {
          description: 'Welcome to DBS Expense Manager'
        });
        navigate('/');
      }
    } else {
      // Regular login for non-mock users
      const success = await login(email, password, role);
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-slide-in">
        <Card className="border-accent/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center expense-text-gradient">
              dbsexpensemanagerproject
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger 
                  value="user" 
                  onClick={() => setRole('user')}
                  className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200"
                >
                  User
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  onClick={() => setRole('admin')}
                  className="data-[state=active]:bg-expense-blue data-[state=active]:text-white transition-all duration-200"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
              <TabsContent value="user">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="expense-input focus:ring-accent focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-accent hover:underline hover:text-accent/80 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="expense-input focus:ring-accent focus:border-accent"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Default user credentials: <br />
                    Email: user@example.com <br />
                    Password: user123
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 expense-button"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="admin">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="expense-input focus:ring-expense-blue focus:border-expense-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="expense-input focus:ring-expense-blue focus:border-expense-blue"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Default admin credentials: <br />
                    Email: admin@example.com <br />
                    Password: admin@123
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-expense-blue hover:bg-expense-blue-light expense-button"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Admin Login'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:underline hover:text-accent/80 transition-colors">
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
