import * as SQLite from 'expo-sqlite';
import { Database } from 'expo-sqlite';
import { Player } from "./models";

export const addPlayer = async (db: Database, player: Player): Promise<void> => {
  const query = `INSERT INTO Players (name, profit, favHandRank1, favHandSuit1, favHandRank2, favHandSuit2, playerNotes) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    player.name,
    player.profit,
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

export const getPlayers = async (db: Database): Promise<Player[]> => {
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

export const updatePlayerCard = async (db: Database, player: Player, handIndex: number) => {
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

export const updatePlayer = async (db: Database, player: Player) => {
  const query = `
    UPDATE Players
    SET name = ?, profit = ?, playerNotes = ?
    WHERE id = ?`;
  const values = [
    player.name,
    player.profit,
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

export const deletePlayer = async (db: Database, id: number) => {
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