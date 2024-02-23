export type Player = {
  id?: number;
  name: string;
  profit: number;
  favHandRank1: string;
  favHandSuit1: string;
  favHandRank2: string;
  favHandSuit2: string;
  playerNotes: string;
}

export type Session = {
  id?: number;
  date: string;
  stakes: string;
  cashIn: number;
  cashOut: number;
  location: string;
  host: number;
  gameType: string;
}

export type SessionPlayer = {
  sessionId: number;
  playerId: number;
}