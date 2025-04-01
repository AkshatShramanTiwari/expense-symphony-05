
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from './Dashboard';
import { toast } from 'sonner';

const Index = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated && user) {
      toast.success(`Welcome back, ${user.username}!`, {
        description: "Connect to PostgreSQL database for expense management",
      });
    }
  }, [isAuthenticated, loading, navigate, user]);

  useEffect(() => {
    // Initialize database connection
    const initDbConnection = async () => {
      try {
        // In a real application, this would check if the database is connected
        console.log("Checking database connection...");
        // This is just for demonstration
        toast.info("Connected to DBS Expense Manager Database", {
          description: "PostgreSQL database is ready for operations",
        });
      } catch (error) {
        console.error("Database connection error:", error);
        toast.error("Database connection failed", {
          description: "Please check your database configuration",
        });
      }
    };

    if (isAuthenticated) {
      initDbConnection();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // This will redirect to login
  }

  return <Dashboard />;
};

export default Index;
