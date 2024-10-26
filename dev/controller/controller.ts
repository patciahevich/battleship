import { dataBase } from '../dataBase/dataBase';
import { clients } from '../clients/clients';
import { createLoginResponse, login } from '../login/login';
import {
  addUserToRoom,
  createRoom,
  createStartGameResponse,
  updateRoomsResponse,
} from '../room/room';
import { randomUUID } from 'crypto';
import { addShips, checkReadyForBattle } from '../ships/ships';

export function loginController(clientId: string, data: string) {
  const client = clients.get(clientId);

  if (!client) {
    return;
  }

  const { name, password } = JSON.parse(data);
  const isLogin = login(name, password);

  client.ws.send(createLoginResponse(isLogin, name));

  if (isLogin) {
    client.ws.send(updateRoomsResponse());
    client.user = { name, password };
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

    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(updateRoomsResponse());
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
    const firstPlayerId = randomUUID();
    const secondPlayerId = randomUUID();

    dataBase.games.push({
      gameId,
      players: [{ id: firstPlayerId }, { id: secondPlayerId }],
    });

    firstPlayer.ws.send(createStartGameResponse(gameId, firstPlayerId));
    secondPlayer.ws.send(createStartGameResponse(gameId, secondPlayerId));

    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(updateRoomsResponse());
      }
    });
  }
}

export function shipsController(data: string) {
  const currentGame = addShips(data);
  const isReady = currentGame && checkReadyForBattle(currentGame);

  if (isReady) {
    console.log('ready');
    // start battle
  }
}
