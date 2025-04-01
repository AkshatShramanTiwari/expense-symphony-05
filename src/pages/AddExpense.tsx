
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Housing',
  'Health',
  'Education',
  'Travel',
  'Personal Care',
  'Gifts',
  'Other',
];

const AddExpense = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { addExpense, loading } = useExpenses();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount) newErrors.amount = 'Amount is required';
    else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    
    if (!category) newErrors.category = 'Category is required';
    if (!description) newErrors.description = 'Description is required';
    if (!date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    addExpense({
      amount: Number(amount),
      category,
      description,
      date: date.toISOString().split('T')[0],
    });
    
    // Clear form after submission
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date());
    
    // Redirect to expenses list
    navigate('/expenses');
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Add New Expense</h1>
      
      <Card className="expense-card">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>
            Enter the details of your expense below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="expense-form" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`pl-8 expense-input ${errors.amount ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className={`expense-input ${errors.category ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`expense-input ${errors.description ? 'border-destructive' : ''}`}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal expense-input",
                      !date && "text-muted-foreground",
                      errors.date ? 'border-destructive' : ''
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/expenses')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="expense-form"
            className="bg-accent hover:bg-accent/90 expense-button"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddExpense;
