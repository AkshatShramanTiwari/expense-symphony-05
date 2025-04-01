
import React from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, PieChart, Plus, List, Settings, LogOut, MessageCircle, HelpCircle, Share2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: Home,
      path: '/',
      active: location.pathname === '/',
    },
    {
      name: 'Add Expense',
      icon: Plus,
      path: '/add-expense',
      active: location.pathname === '/add-expense',
    },
    {
      name: 'Expenses List',
      icon: List,
      path: '/expenses',
      active: location.pathname === '/expenses',
    },
    {
      name: 'Analysis',
      icon: PieChart,
      path: '/analysis',
      active: location.pathname === '/analysis',
    },
    {
      name: 'Support Chat',
      icon: MessageCircle,
      path: '/chat',
      active: location.pathname === '/chat',
    },
    {
      name: 'Share',
      icon: Share2,
      path: '/share',
      active: location.pathname === '/share',
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      active: location.pathname === '/settings',
    },
  ];

  // Admin has additional routes
  const adminItems = [
    {
      name: 'Admin Dashboard',
      icon: Settings,
      path: '/admin',
      active: location.pathname === '/admin',
    },
  ];

  const sidebarItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  if (!isAuthenticated) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar className="border-r border-border">
            <div className="mb-2 p-4">
              <h2 className="text-lg font-bold expense-text-gradient">
                dbsexpensemanagerproject
              </h2>
            </div>
            <SidebarContent className="flex flex-col gap-1 p-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.name}
                  variant={item.active ? "default" : "ghost"}
                  className={`justify-start ${item.active ? 'bg-accent/20 text-accent-foreground' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              ))}
              <Button variant="ghost" className="justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </SidebarContent>
            <div className="mt-auto p-4 border-t border-border">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-sm font-medium flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-accent" /> 
                  Need Help?
                </h3>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>Akshat Shraman Tiwari</p>
                  <p>+91-7389100645</p>
                  <p className="mt-2">Saarthak Singhal</p>
                  <p>+91-7042429175</p>
                </div>
              </div>
            </div>
          </Sidebar>
          <div className="flex-1 overflow-auto">
            <div className="flex items-center border-b border-border p-4">
              <SidebarTrigger />
              <div className="ml-auto flex items-center gap-4">
                {isAdmin && (
                  <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <main className="p-4 md:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PageLayout;
