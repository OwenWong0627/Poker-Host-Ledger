import * as SQLite from 'expo-sqlite/legacy';
import { SessionPlayerDetail } from './models';

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

export const deletePlayerFromAllSession = async (db: SQLite.Database, playerId: number): Promise<void> => {
  const query = `DELETE FROM session_players WHERE player_id = ?`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [playerId],
        () => resolve(),
        (_, error) => {
          console.error('Error deleting player from all sessions:', error);
          reject(error);
          return false;
        }
      );
    });
  });
}


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

export const getPlayerProfit = async (db: SQLite.Database, playerId: number): Promise<number> => {
  const query = `
    SELECT SUM(cash_out - cash_in) as profit
    FROM session_players
    WHERE player_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [playerId],
        (_, { rows }) => {
          const profit = rows._array[0].profit;
          resolve(profit);
        },
        (_, error) => {
          console.error(error);
          reject(`Failed to get profit for player_id ${playerId}`);
          return false;
        }
      );
    });
  });
}

export const calculateTotalMoneyLost = async (db: SQLite.Database): Promise<number> => {
  const query = `
    SELECT SUM(cash_out - cash_in) AS total_money_lost
    FROM session_players;
  `;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            const totalMoneyLost = rows._array[0].total_money_lost || 0;
            console.log(`Total Money Lost: ${totalMoneyLost}`);
            resolve(totalMoneyLost);
          } else {
            resolve(0); // Resolve with 0 if no data found
          }
        },
        (_, error) => {
          console.error(error);
          reject(`Failed to calculate total money lost: ${error}`);
          return false;
        }
      );
    });
  });
};

