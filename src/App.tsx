
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { QueryProvider } from "@/contexts/QueryContext";
import PageLayout from "@/components/PageLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import ExpensesList from "./pages/ExpensesList";
import Analysis from "./pages/Analysis";
import Chat from "./pages/Chat";
import Share from "./pages/Share";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ExpenseProvider>
          <ChatProvider>
            <QueryProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <PageLayout>
                          <Dashboard />
                        </PageLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/add-expense" 
                    element={
                      <ProtectedRoute>
                        <PageLayout>
                          <AddExpense />
                        </PageLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/expenses" 
                    element={
                      <ProtectedRoute>
                        <PageLayout>
                          <ExpensesList />
                        </PageLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analysis" 
                    element={
                      <ProtectedRoute>
                        <PageLayout>
                          <Analysis />
                        </PageLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/chat" 
                    element={
                      <ProtectedRoute>
                        <PageLayout>
                          <Chat />
                        </PageLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/share" 
                    element={
                      <ProtectedRoute>
                        <PageLayout>
                          <Share />
                        </PageLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <PageLayout>
                          <Settings />
                        </PageLayout>
                      </ProtectedRoute>
                    } 
                  />

                  {/* Admin routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <PageLayout>
                          <AdminDashboard />
                        </PageLayout>
                      </AdminRoute>
                    } 
                  />

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </QueryProvider>
          </ChatProvider>
        </ExpenseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
