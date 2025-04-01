
import React from 'react';
import { useEffect, useState } from 'react';
import { X, Database } from 'lucide-react';

interface QueryNotificationProps {
  query: string;
  onClose: () => void;
  duration?: number;
}

const QueryNotification = ({ query, onClose, duration = 5000 }: QueryNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete before removing
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-4 left-4 p-4 bg-card border border-primary/20 rounded-lg shadow-lg max-w-md z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
          <Database size={16} className="text-primary" />
          SQL Query Executed
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto max-h-24 overflow-y-auto">
        {query}
      </div>
    </div>
  );
};

export default QueryNotification;
