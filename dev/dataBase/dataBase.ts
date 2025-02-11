import { Position } from '../types/types';
import Ship from '../ships/ship';

export type PlayerData = {
  name: string;
  password: string;
  wins: number;
};

type RoomUser = {
  id: string;
  name: string;
  index: number | string;
};

export type Room = {
  roomId: string | number;
  roomUsers: RoomUser[];
};

export type GamePlayer = {
  id: string;
  ships?: Ship[];
  hits?: Position[];
};

export type Game = {
  gameId: string;
  players: GamePlayer[];
  currentTurn: null | string;
};

export type DataBase = {
  players: PlayerData[];
  rooms: Room[];
  games: Game[];
};

export const dataBase: DataBase = {
  players: [],
  rooms: [],
  games: [],
};
