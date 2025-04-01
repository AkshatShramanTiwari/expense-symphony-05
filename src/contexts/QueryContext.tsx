
import React, { createContext, useContext, useState, ReactNode } from 'react';
import QueryNotification from '@/components/QueryNotification';

interface QueryContextType {
  showQuery: (query: string) => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const useQuery = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQuery must be used within a QueryProvider');
  }
  return context;
};

interface QueryProviderProps {
  children: ReactNode;
}

interface QueryItem {
  id: string;
  query: string;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queries, setQueries] = useState<QueryItem[]>([]);

  const showQuery = (query: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setQueries((prev) => [...prev, { id, query }]);
  };

  const removeQuery = (id: string) => {
    setQueries((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <QueryContext.Provider value={{ showQuery }}>
      {children}
      {queries.map((q) => (
        <QueryNotification
          key={q.id}
          query={q.query}
          onClose={() => removeQuery(q.id)}
        />
      ))}
    </QueryContext.Provider>
  );
};
