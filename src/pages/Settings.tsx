
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Bell, Shield, LogOut } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();

  // Profile settings
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [expenseReminders, setExpenseReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(false);
  const [shareData, setShareData] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Save profile handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // Simulate update
    setTimeout(() => {
      toast.success('Profile updated successfully');
    }, 500);
  };

  // Save notification settings
  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated');
  };

  // Save privacy settings
  const handleSavePrivacy = () => {
    toast.success('Privacy settings updated');
  };

  // Handle account deletion (demo only)
  const handleDeleteAccount = () => {
    toast.error('Account deletion is disabled in the demo');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="expense-card">
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-2xl">
                      {user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="expense-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="expense-input"
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="expense-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="expense-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="expense-input"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 expense-button">
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="expense-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="expense-reminders">Expense Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders to log your daily expenses
                    </p>
                  </div>
                  <Switch
                    id="expense-reminders"
                    checked={expenseReminders}
                    onCheckedChange={setExpenseReminders}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your spending patterns
                    </p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={weeklyReports}
                    onCheckedChange={setWeeklyReports}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="budget-alerts">Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you approach budget limits
                    </p>
                  </div>
                  <Switch
                    id="budget-alerts"
                    checked={budgetAlerts}
                    onCheckedChange={setBudgetAlerts}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-accent hover:bg-accent/90 expense-button w-full"
                onClick={handleSaveNotifications}
              >
                Save Notification Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card className="expense-card">
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Manage privacy settings and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your profile information
                    </p>
                  </div>
                  <Switch
                    id="public-profile"
                    checked={publicProfile}
                    onCheckedChange={setPublicProfile}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-data">Share Anonymous Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve our expense predictions with anonymized data
                    </p>
                  </div>
                  <Switch
                    id="share-data"
                    checked={shareData}
                    onCheckedChange={setShareData}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
              </div>
              
              <div className="pt-6 border-t">
                <h3 className="font-medium text-destructive mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Export Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Download all your expense data as CSV
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Log Out Everywhere</h4>
                      <p className="text-sm text-muted-foreground">
                        Log out from all devices except this one
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDeleteAccount}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-accent hover:bg-accent/90 expense-button w-full"
                onClick={handleSavePrivacy}
              >
                Save Privacy Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
