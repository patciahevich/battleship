import { randomUUID } from 'crypto';

import { dataBase } from '../dataBase/dataBase';
import { clients } from '../clients/clients';
import { createLoginResponse, login } from '../login/login';
import {
  addUserToRoom,
  createRoom,
  createGameResponse,
  updateRoomsResponse,
} from '../room/room';
import {
  addShips,
  checkReadyForBattle,
  createStartGameResponse,
} from '../ships/ships';
import { switchTurn, turnResponse } from '../game/game';

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

    const gameId = randomUUID();
    const firstPlayerId = roomForGame.roomUsers[0].id;
    const secondPlayerId = roomForGame.roomUsers[1].id;

    const firstPlayer = clients.get(firstPlayerId);
    const secondPlayer = clients.get(secondPlayerId);

    if (!firstPlayer || !secondPlayer) {
      return;
    }

    dataBase.games.push({
      gameId,
      players: [{ id: firstPlayerId }, { id: secondPlayerId }],
      currentTurn: null,
    });

    firstPlayer.ws.send(createGameResponse(gameId, firstPlayerId));
    secondPlayer.ws.send(createGameResponse(gameId, secondPlayerId));

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
    // start game!!
    const firstPlayer = clients.get(currentGame.players[0].id);
    const secondPlayer = clients.get(currentGame.players[1].id);

    if (!firstPlayer || !secondPlayer) {
      return;
    }

    switchTurn(currentGame);

    firstPlayer.ws.send(createStartGameResponse(currentGame.players[0]));
    firstPlayer.ws.send(turnResponse(currentGame.currentTurn!));
    secondPlayer.ws.send(createStartGameResponse(currentGame.players[1]));
    secondPlayer.ws.send(turnResponse(currentGame.currentTurn!));
  }
}
