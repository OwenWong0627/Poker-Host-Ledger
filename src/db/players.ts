import * as SQLite from 'expo-sqlite/legacy';
import { Player } from "./models";

export const addPlayer = async (db: SQLite.Database, player: Player): Promise<void> => {
  const query = `INSERT INTO Players (name, favHandRank1, favHandSuit1, favHandRank2, favHandSuit2, playerNotes) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    player.name,
    player.favHandRank1,
    player.favHandSuit1,
    player.favHandRank2,
    player.favHandSuit2,
    player.playerNotes,
  ];

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        values,
        () => {
          console.log(`Player ${player.name} added`)
          resolve()
        },
        (_, error) => {
          console.error(error);
          reject(`Failed to add player ${player.name}`);
          return false; // Stop the transaction
        }
      );
    });
  });
};

export const getPlayers = async (db: SQLite.Database): Promise<Player[]> => {
  const query = `SELECT * FROM Players`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [],
        (_, { rows }) => {
          let players: Player[] = [];
          for (let i = 0; i < rows.length; i++) {
            players.push(rows._array[i]);
          }
          console.log('Players fetched');
          resolve(players);
        },
        (_, error) => {
          console.error(error);
          reject(`Failed to get players`);
          return false; // Stop the transaction
        }
      );
    });
  });
};

export const getPlayerName = async (db: SQLite.Database, id: number): Promise<string> => {
  const query = `SELECT name FROM Players WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            const name = rows._array[0].name;
            console.log(`Player name fetched: ${name}`);
            resolve(name);
          } else {
            reject(`Player with id ${id} not found`);
            return false;
          }
        },
        (_, error) => {
          console.error(error);
          reject(`Failed to get player name`);
          return false; // Stop the transaction
        }
      );
    });
  });
}

export const updatePlayerCard = async (db: SQLite.Database, player: Player, handIndex: number) => {
  const queryCardOne = `
    UPDATE Players
    SET favHandRank1 = ?, favHandSuit1 = ?
    WHERE id = ?`;
  const valuesCardOne = [
    player.favHandRank1,
    player.favHandSuit1,
    player.id
  ];
  const queryCardTwo = `
    UPDATE Players
    SET favHandRank2 = ?, favHandSuit2 = ?
    WHERE id = ?`;
  const valuesCardTwo = [
    player.favHandRank2,
    player.favHandSuit2,
    player.id,
  ];

  if (handIndex === 0) {
    console.log('Updating card one')
    return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          queryCardOne,
          valuesCardOne.filter(value => value !== undefined) as SQLite.SQLStatementArg[], // Filter out undefined values
          () => {
            console.log(`Player ${player.id} updated`)
            resolve()
          },
          (_, error) => {
            console.error(error);
            reject(`Failed to update player ${player.name}`);
            return false;
          }
        );
      });
    });
  } else if (handIndex === 1) {
    console.log('Updating card two')
    return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          queryCardTwo,
          valuesCardTwo.filter(value => value !== undefined) as SQLite.SQLStatementArg[], // Filter out undefined values
          () => {
            console.log(`Player ${player.id} updated`)
            resolve()
          },
          (_, error) => {
            console.error(error);
            reject(`Failed to update player ${player.name}`);
            return false;
          }
        );
      });
    });
  }
};

export const updatePlayer = async (db: SQLite.Database, player: Player) => {
  const query = `
    UPDATE Players
    SET name = ?, playerNotes = ?
    WHERE id = ?`;
  const values = [
    player.name,
    player.playerNotes,
    player.id
  ];

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        values.filter(value => value !== undefined) as SQLite.SQLStatementArg[], // Filter out undefined values
        () => resolve(),
        (_, error) => {
          console.error(error);
          reject(`Failed to update player ${player.name}`);
          return false;
        }
      );
    });
  });
};


export const deletePlayer = async (db: SQLite.Database, id: number) => {
  const query = `DELETE FROM Players WHERE id = ?`;

  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        query,
        [id],
        () => {
          console.log(`Player ${id} deleted`);
          resolve()
        },
        (_, error) => {
          console.error(error);
          reject(`Failed to delete player ${id}`);
          return false;
        }
      );
    });
  });
};