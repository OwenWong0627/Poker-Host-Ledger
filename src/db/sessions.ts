import * as SQLite from 'expo-sqlite';
import { Session } from './models';

export const addSession = async (db: SQLite.Database, session: Session): Promise<void> => {
  const query = `
    INSERT INTO Sessions (date, stakes, host, gameType) 
    VALUES (?, ?, ?, ?)
  `;
  const params = [session.date, session.stakes, session.host, session.gameType];

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(query, params,
        () => resolve(),
        (_, error) => {
          console.error('Error adding session:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getSessions = async (db: SQLite.Database): Promise<Session[]> => {
  const query = `SELECT * FROM Sessions`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(query, [],
        (_, { rows }) => resolve(rows._array as Session[]),
        (_, error) => {
          console.error('Error fetching sessions:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const updateSession = async (db: SQLite.Database, session: Session ): Promise<void> => {
  const query = `
    UPDATE Sessions
    SET date = ?, stakes=?, host = ?, gameType = ?
    WHERE id = ?
  `;
  const params = [
    session.date, 
    session.stakes,
    session.host, 
    session.gameType, 
    session.id
  ];

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query, 
        params.filter(param => param !== undefined) as SQLite.SQLStatementArg[], // Filter out undefined values and cast to SQLStatementArg[]
        () => resolve(),
        (_, error) => {
          console.error('Error updating session:', error);
          reject(error);
          return false; // To halt the transaction if there's an error
        }
      );
    });
  });
};

export const deleteSession = async (db: SQLite.Database, sessionId: number): Promise<void> => {
  const deleteSessionQuery = `DELETE FROM Sessions WHERE id = ?`;
  const deleteSessionPlayersQuery = `DELETE FROM session_players WHERE session_id = ?`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // First, remove the session-player associations
      tx.executeSql(deleteSessionPlayersQuery, [sessionId], 
        () => {
          // Then, delete the session itself
          tx.executeSql(deleteSessionQuery, [sessionId], 
            () => resolve(),
            (_, error) => {
              console.error('Error deleting session:', error);
              reject(error);
              return false;
            }
          );
        },
        (_, error) => {
          console.error('Error deleting session players:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};