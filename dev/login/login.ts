import { dataBase } from '../dataBase/dataBase';
import { MessageType } from '../types/types';

export function login(name: string, password: string) {
  const player = dataBase.players.find((player) => player.name === name);

  if (player) {
    return player.password === password ? true : false;
  } else {
    dataBase.players.push({ name, password });
    return true;
  }
}

export function createLoginResponse(isLogin: boolean, name: string) {
  const payload = {
    name,
    index: 0,
    error: !isLogin,
    errorText: isLogin ? '' : 'Invalid password',
  };
  const response = {
    type: MessageType.REG,
    data: JSON.stringify(payload),
    id: 0,
  };

  return JSON.stringify(response);
}
