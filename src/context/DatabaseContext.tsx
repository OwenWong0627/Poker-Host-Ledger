import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { createTable, getDBConnection } from '../db/db-service';

interface DatabaseContextType {
  db: SQLite.Database | null;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.Database | null>(null);

  useEffect(() => {
    async function initializeDB() {
      const db = await getDBConnection();
      setDb(db);
      await createTable(db);
    }

    initializeDB();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): SQLite.Database => {
  const context = useContext(DatabaseContext);
  if (!context || !context.db) {
    throw new Error('useDatabase must be used within a DatabaseProvider and db must be initialized');
  }
  return context.db;
};
