import { dataBase } from '../dataBase/dataBase';
import { LoginRequest, LoginResponse, Message } from '../types/types';

type PlayerData = {
  name: string;
  password: string;
};

export type DataBase = {
  players: PlayerData[];
};

export function login(data: string) {
  const { name, password } = JSON.parse(data);

  let loginResponse: LoginResponse;
  const player = dataBase.players.find((player) => player.name === name);

  if (player) {
    player.password === password
      ? (loginResponse = {
          name,
          index: 1,
          error: false,
          errorText: '',
        })
      : (loginResponse = {
          name,
          index: 1,
          error: true,
          errorText: 'incorrect password',
        });
  } else {
    dataBase.players.push({ name, password });
    loginResponse = {
      name,
      index: 1,
      error: false,
      errorText: '',
    };
  }

  return JSON.stringify(loginResponse);
}
