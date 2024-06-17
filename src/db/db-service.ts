import * as SQLite from 'expo-sqlite/legacy';

const databaseName = 'PokerDBv94.db';

// Initialize the database
export const getDBConnection = async (): Promise<SQLite.Database> => {
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

export const createTable = async (db: SQLite.Database): Promise<void> => {
  // SQL query to create the Players table
  const playersQuery = `
    CREATE TABLE IF NOT EXISTS Players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      favHandRank1 TEXT,
      favHandSuit1 TEXT,
      favHandRank2 TEXT,
      favHandSuit2 TEXT,
      playerNotes TEXT
    );`;
  
  const sessionsQuery = `
    CREATE TABLE IF NOT EXISTS Sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      stakes TEXT,
      host INTEGER,
      gameType TEXT,
      FOREIGN KEY (host) REFERENCES Players(id)
    );
  `;

  const sessionPlayersQuery = `
    CREATE TABLE IF NOT EXISTS session_players (
      session_id INTEGER,
      player_id INTEGER,
      cash_in REAL,
      cash_out REAL,
      FOREIGN KEY (session_id) REFERENCES Sessions(id),
      FOREIGN KEY (player_id) REFERENCES Players(id),
      PRIMARY KEY (session_id, player_id)
    );
  `;

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

      tx.executeSql(sessionsQuery, [], () => {
        console.log('Sessions Table Created.');
        resolve();
      }, (_txError, error) => {
        console.error('Failed to create tables:', error);
        reject(new Error(`Failed to create tables: ${error?.message}`));
        return false;
      });

      tx.executeSql(sessionPlayersQuery, [], () => {
        console.log('Session Players Joint Table Created.');
        resolve();
      }, (_txError, error) => {
        console.error('Failed to create tables:', error);
        reject(new Error(`Failed to create tables: ${error?.message}`));
        return false;
      });
    }, (transactionError) => {
      console.error('Transaction error:', transactionError);
      reject(new Error('Failed to create tables within the transaction.'));
    }, () => {
      console.log('All tables created successfully.');
      resolve();
    });
  });
};
