import * as SQLite from 'expo-sqlite';
import { Player, SessionPlayerDetail } from './models';

export const addPlayerToSession = async (
  db: SQLite.Database, 
  sessionId: number, 
  playerId: number, 
  cashIn: number, 
  cashOut: number
): Promise<void> => {
  const query = `INSERT INTO session_players (session_id, player_id, cash_in, cash_out) VALUES (?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [sessionId, playerId, cashIn, cashOut],
        () => {
          console.log(`Player ${playerId} added to session ${sessionId}`);
          resolve();
        },
        (_, error) => {
          console.error(error);
          reject(`Failed to add player ${playerId} to session ${sessionId}`);
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
export const getPlayersForSession = async (db: SQLite.Database, sessionId: number): Promise<SessionPlayerDetail[]> => {
  const query = `
    SELECT sp.session_id, sp.player_id, sp.cash_in, sp.cash_out
    FROM session_players sp
    JOIN Players p ON sp.player_id = p.id
    WHERE sp.session_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [sessionId],
        (_, { rows }) => {
          let sessionPlayers: SessionPlayerDetail[] = [];
          for (let i = 0; i < rows.length; i++) {
            // You will need to define your SessionPlayerDetail type to include the player name.
            sessionPlayers.push({
              ...rows._array[i],
            });
          }
          resolve(sessionPlayers);
        },
        (_, error) => {
          console.error(error);
          reject(`Failed to get session players for session_id ${sessionId}`);
          return false; // Stop the transaction
        }
      );
    });
  });
};

export const updatePlayerCashIn = async (db: SQLite.Database, sessionId: number, playerId: number, cashIn: number): Promise<void> => {
  const query = `UPDATE session_players SET cash_in = ? WHERE session_id = ? AND player_id = ?`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [cashIn, sessionId, playerId],
        () => resolve(),
        (_, error) => {
          console.error('Error updating player cash in:', error);
          reject(error);
          return false;
        }
      );
    });
  });
}

export const updatePlayerCashOut = async (db: SQLite.Database, sessionId: number, playerId: number, cashOut: number): Promise<void> => {
  const query = `UPDATE session_players SET cash_out = ? WHERE session_id = ? AND player_id = ?`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [cashOut, sessionId, playerId],
        () => resolve(),
        (_, error) => {
          console.error('Error updating player cash out:', error);
          reject(error);
          return false;
        }
      );
    });
  });
}