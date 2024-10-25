import { clients } from '../server';
import { createLoginResponse, login } from '../login/login';
import {
  addUserToRoom,
  createRoom,
  createStartGameResponse,
  updateRoomsResponse,
} from '../room/room';
import { randomUUID } from 'crypto';

export function loginController(clientId: string, data: string) {
  const ws = clients.get(clientId);

  if (!ws) {
    return;
  }

  const { name, password } = JSON.parse(data);
  const isLogin = login(clientId, name, password);

  ws.send(createLoginResponse(isLogin, name));

  if (isLogin) {
    ws.send(updateRoomsResponse());
    // send winners
  }
}

export function roomsController(
  clientId: string,
  flag: 'create' | 'update',
  data?: string,
) {
  if (flag === 'create') {
    createRoom(clientId);

    clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(updateRoomsResponse());
      }
    });
  } else if (flag === 'update' && data) {
    const roomForGame = addUserToRoom(clientId, data);

    if (!roomForGame) {
      return;
    }

    const firstPlayer = clients.get(roomForGame.roomUsers[0].id);
    const secondPlayer = clients.get(roomForGame.roomUsers[1].id);

    if (!firstPlayer || !secondPlayer) {
      return;
    }

    const gameId = randomUUID();

    firstPlayer.send(createStartGameResponse(gameId));
    secondPlayer.send(createStartGameResponse(gameId));

    clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(updateRoomsResponse());
      }
    });
  }
}
