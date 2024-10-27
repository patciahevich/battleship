import { randomUUID } from 'crypto';
import { dataBase, Game } from '../dataBase/dataBase';
import { Client, clients } from '../clients/clients';
import { getRandomCoordinates } from './randomAttack';
import { attackResult } from './game';
import { getAttackResult } from './attackResult';
import { createGameResponse } from '../room/room';

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

export function botShot(game: Game, client: Client) {
  console.log('bot shots');
  setTimeout(() => {
    const enemy = game.players.find((player) => player.id !== 'bot');

    if (enemy) {
      const coord = getRandomCoordinates(enemy);
      const attackedShip = attackResult(enemy, coord);
      const responses = getAttackResult(
        game,
        enemy,
        coord,
        'bot',
        attackedShip,
      );
      responses.forEach((response) => client.ws.send(response));

      if (attackedShip) {
        botShot(game, client);
      }
    }
  }, 6000);
}
