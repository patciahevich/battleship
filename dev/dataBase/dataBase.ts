type PlayerData = {
  id: string;
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

export type DataBase = {
  players: PlayerData[];
  rooms: Room[];
};

export const dataBase: DataBase = {
  players: [],
  rooms: [],
};
