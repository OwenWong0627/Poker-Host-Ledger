import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite/legacy';
import { createTable, getDBConnection } from '../db/db-service';

interface DatabaseContextType {
  db: SQLite.Database | null;
  isLoading: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeDB() {
      try {
        const database = await getDBConnection();
        await createTable(database);
        setDb(database);
        setIsLoading(false);  // Set loading to false once the DB is initialized
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    }
    initializeDB();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isLoading }}>
      {!isLoading ? children : null}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): SQLite.Database => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  if (context.isLoading || !context.db) {
    throw new Error('Database is initializing');
  }
  return context.db;
};

export default DatabaseProvider;
