export type Player = {
  id?: number;
  name: string;
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
  host: number;
  gameType: string;
}

export interface SessionPlayerDetail {
  session_id: number;
  player_id: number;
  cash_in: number;
  cash_out: number;
}