export type PlayerData = {
  name: string;
  password: string;
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

export type Game = {
  gameId: string;
  firstPlayerId: string;
  secondPlayerId: string;
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
