
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Define the Message interface
export interface Message {
  id: number;
  senderId: number;
  receiverId: number | null; // null for broadcasts
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Define the ChatContext interface
interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string, receiverId?: number | null) => void;
  markAsRead: (id: number) => void;
  getUserMessages: (userId: number) => Message[];
  loading: boolean;
}

// Create the context with a default value
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock message data for demo
const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 2, // User
    receiverId: 1, // Admin
    content: 'How do I add a new expense?',
    timestamp: '2023-06-19T10:30:00Z',
    isRead: true,
  },
  {
    id: 2,
    senderId: 1, // Admin
    receiverId: 2, // User
    content: 'You can add a new expense by clicking on the "Add Expense" button in the dashboard.',
    timestamp: '2023-06-19T10:35:00Z',
    isRead: false,
  },
  {
    id: 3,
    senderId: 2, // User
    receiverId: 1, // Admin
    content: 'How do I view my expense trends?',
    timestamp: '2023-06-19T11:00:00Z',
    isRead: true,
  },
  {
    id: 4,
    senderId: 1, // Admin
    receiverId: null, // Broadcast
    content: 'Welcome to the new expense management system! Let us know if you have any questions.',
    timestamp: '2023-06-18T09:00:00Z',
    isRead: false,
  },
];

// Custom hook to use the ChatContext
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// ChatProvider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages on mount and when user changes
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter messages for the current user or broadcasts
        const userMessages = user
          ? mockMessages.filter(
              message =>
                message.senderId === user.id ||
                message.receiverId === user.id ||
                message.receiverId === null
            )
          : [];
        
        setMessages(userMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMessages();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [user]);

  // Send a message
  const sendMessage = (content: string, receiverId?: number | null) => {
    if (!user) {
      toast.error('You must be logged in to send messages.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const newMessage: Message = {
          id: Math.floor(Math.random() * 10000),
          senderId: user.id,
          receiverId: receiverId ?? null,
          content,
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        
        setMessages(prev => [...prev, newMessage]);
        setLoading(false);
        toast.success('Message sent successfully!');
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message.');
      setLoading(false);
    }
  };

  // Mark a message as read
  const markAsRead = (id: number) => {
    setMessages(prev =>
      prev.map(message =>
        message.id === id ? { ...message, isRead: true } : message
      )
    );
  };

  // Get messages for a specific user
  const getUserMessages = (userId: number) => {
    return messages.filter(
      message =>
        (message.senderId === userId || message.receiverId === userId) ||
        message.receiverId === null
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        markAsRead,
        getUserMessages,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
