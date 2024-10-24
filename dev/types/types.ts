// login
export type LoginRequest = {
  name: string;
  password: string;
};

export type LoginResponse = {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
};

//winners
type Winner = {
  name: string;
  wins: number;
};

type Winners = Winner[];

// room
type IndexRoom = number | string;

type CreateGameResponse = {
  idGame: number | string;
  idPlayer: number | string;
};

type RoomUser = {
  name: string;
  index: number | string;
};

type UpdateRoomState = {
  roomId: string | number;
  roomUsers: RoomUser[];
};

//ships
type ShipType = 'small' | 'medium' | 'large' | 'huge';
type Position = {
  x: number;
  y: number;
};

type Ship = {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
};

type ShipsRequest = {
  gameId: string | number;
  ships: Ship[];
  indexPlayer: number | string;
};

type StartGameResponse = {
  gameId: string | number;
  ships: Ship[];
  currentPlayerIndex: number | string;
};

//game

type AttackStatus = 'miss' | 'killed' | 'shot';

type AttackRequest = {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
};

type AttackResponse = {
  position: Position;
  currentPlayer: number | string;
  status: AttackStatus;
};

type RandomAttackRequest = {
  gameId: number | string;
  indexPlayer: number | string;
};

type TurnInfo = {
  currentPlayer: number | string;
};

// finish game
type FinishResponse = {
  winPlayer: number | string;
};

// message
export enum MessageType {
  REG = 'reg',
  UPDATE_WINNERS = 'update_winners',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  CREATE_GAME = 'create_game',
  UPDATE_ROOM = 'update_room',
  ADD_SHIPS = 'add_ships',
  START_GAME = 'start_game',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  TURN = 'turn',
  FINISH = 'finish',
}

export type Message = {
  type: MessageType;
  data: LoginRequest;
  id: string;
};
