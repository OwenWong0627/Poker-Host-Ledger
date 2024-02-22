import * as SQLite from 'expo-sqlite';
import { Database } from 'expo-sqlite';

const databaseName = 'PokerDBv16.db';

// Initialize the database
export const getDBConnection = async (): Promise<Database> => {
  try {
    if (!databaseName || databaseName.trim() === '') {
      throw new Error('Database name is missing or empty');
    }
    const db = await SQLite.openDatabase(databaseName);
    console.log('Database opened.');
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw new Error('Error opening database');
  }
};

export const createTable = async (db: Database): Promise<void> => {
  // SQL query to create the Players table
  const playersQuery = `
    CREATE TABLE IF NOT EXISTS Players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      profit REAL,
      favHandRank1 TEXT,
      favHandSuit1 TEXT,
      favHandRank2 TEXT,
      favHandSuit2 TEXT,
      playerNotes TEXT
    );`;

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(playersQuery, [], () => {
        console.log('Player Table Created.');
        resolve();
      }, (_txError, error) => {
        console.error('Failed to create tables:', error);
        reject(new Error(`Failed to create tables: ${error?.message}`));
        return false;
      });
    });
  });
};
