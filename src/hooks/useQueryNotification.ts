
import { useEffect } from 'react';
import { useQuery } from '@/contexts/QueryContext';
import dbConfig from '@/db/dbConfig';

export const useQueryNotification = () => {
  const { showQuery } = useQuery();

  useEffect(() => {
    // Register a listener for database queries
    const unregister = dbConfig.registerQueryListener((query) => {
      showQuery(query);
    });

    // Clean up listener on component unmount
    return () => {
      unregister();
    };
  }, [showQuery]);

  return null;
};

export default useQueryNotification;
