
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat, Message } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';

const Chat = () => {
  const { messages, sendMessage, loading } = useChat();
  const { user, isAdmin } = useAuth();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // If admin, send to the last user who sent a message
    const receiverId = isAdmin
      ? messages.filter(m => m.senderId !== user?.id).pop()?.senderId || null
      : 1; // Admin's ID is 1

    sendMessage(messageText, receiverId);
    setMessageText('');
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach(message => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Support Chat</h1>
        <p className="text-muted-foreground">
          {isAdmin ? 'Respond to user queries' : 'Get help with any questions you have'}
        </p>
      </div>

      <Card className="expense-card h-[70vh] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <CardTitle>
            {isAdmin ? 'Admin Support Channel' : 'Chat with Support'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4">
          {Object.keys(groupedMessages).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="sticky top-0 z-10 flex justify-center my-4">
                    <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                      {new Date(date).toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {dateMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex max-w-[80%] ${
                            message.senderId === user?.id ? 'flex-row-reverse' : 'flex-row'
                          }`}
                        >
                          <Avatar className={`h-8 w-8 ${message.senderId === user?.id ? 'ml-2' : 'mr-2'}`}>
                            <AvatarFallback>
                              {message.senderId === 1 ? 'AD' : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className={`rounded-lg p-3 ${
                                message.senderId === user?.id
                                  ? 'bg-accent text-accent-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {message.content}
                            </div>
                            <div
                              className={`text-xs text-muted-foreground mt-1 ${
                                message.senderId === user?.id ? 'text-right' : 'text-left'
                              }`}
                            >
                              {formatTimestamp(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-muted rounded-full p-4 mb-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No messages yet</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                {isAdmin
                  ? 'Wait for users to send you messages or send a broadcast message to all users.'
                  : 'Send a message to get help from our support team.'}
              </p>
            </div>
          )}
        </CardContent>
        <div className="flex-shrink-0 p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder={isAdmin ? "Type your response..." : "Type your question..."}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-grow expense-input"
            />
            <Button 
              type="submit" 
              disabled={loading || !messageText.trim()}
              className="bg-accent hover:bg-accent/90 expense-button"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
