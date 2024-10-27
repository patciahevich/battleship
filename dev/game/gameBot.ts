import { createGameResponse } from '../room/room';
import { randomUUID } from 'crypto';
import { dataBase } from '../dataBase/dataBase';
import { clients } from '../clients/clients';

export function createBot(playerId: string) {
  const gameId = randomUUID();
  const client = clients.get(playerId);
  client && client.ws.send(createGameResponse(gameId, playerId));

  dataBase.games.push({
    gameId,
    players: [{ id: playerId }, { id: 'bot' }],
    currentTurn: null,
  });
}
