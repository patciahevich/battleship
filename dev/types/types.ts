import Ship from '../ships/ship';

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

export type IndexRoom = { indexRoom: string | number };

export type CreateGameResponse = {
  idGame: number | string;
  idPlayer: number | string;
};

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export type Position = {
  x: number;
  y: number;
};

export type ShipData = {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
};

export type ShipsRequest = {
  gameId: string | number;
  ships: Ship[];
  indexPlayer: number | string;
};

export type AttackStatus = 'miss' | 'killed' | 'shot';

export type AttackRequest = {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
};

export type RandomAttackRequest = {
  gameId: number | string;
  indexPlayer: number | string;
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
  SINGLE_PLAY = 'single_play',
}

export type Message = {
  type: MessageType;
  data: string;
  id: string;
};
