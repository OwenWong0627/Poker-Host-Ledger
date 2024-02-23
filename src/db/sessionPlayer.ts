import * as SQLite from 'expo-sqlite';
import { Player } from './models';

export const addPlayerToSession = async (db: SQLite.Database, sessionId: number, playerId: number): Promise<void> => {
  const query = `INSERT INTO session_players (session_id, player_id) VALUES (?, ?)`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [sessionId, playerId],
        () => resolve(),
        (_, error) => {
          console.error('Error adding player to session:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const removePlayerFromSession = async (db: SQLite.Database, sessionId: number, playerId: number): Promise<void> => {
  const query = `DELETE FROM session_players WHERE session_id = ? AND player_id = ?`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [sessionId, playerId],
        () => resolve(),
        (_, error) => {
          console.error('Error removing player from session:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Get all players for a specific session
export const getPlayersForSession = async (db: SQLite.Database, sessionId: number): Promise<Player[]> => {
  const query = `
    SELECT Players.* FROM Players
    INNER JOIN session_players ON Players.id = session_players.player_id
    WHERE session_players.session_id = ?
  `;

  return new Promise<Player[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query, 
        [sessionId],
        (_, result) => resolve(result.rows._array as Player[]),
        (_, error) => {
          console.error('Error fetching players for session:', error);
          reject(error);
          return false; // To halt the transaction if there's an error
        }
      );
    });
  });
};
