import { randomUUID } from 'crypto';
import { dataBase } from '../dataBase/dataBase';
import { clients } from '../clients/clients';
import {
  createGameResponse,
  removeRooms,
  updateRoomsResponse,
} from '../room/room';

export function createBot(playerId: string) {
  const gameId = randomUUID();
  const client = clients.get(playerId);
  client && client.ws.send(createGameResponse(gameId, playerId));

  removeRooms(playerId);
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(updateRoomsResponse());
    }
  });

  dataBase.games.push({
    gameId,
    players: [{ id: playerId }, { id: 'bot' }],
    currentTurn: null,
  });
}
