import {
  attackResult,
  createAttackResponse,
  switchTurn,
  turnResponse,
} from '../game/game';
import { dataBase } from '../dataBase/dataBase';
import { AttackRequest } from '../types/types';
import { clients } from '../clients/clients';

export function gameController(data: string) {
  const { gameId, x, y, indexPlayer } = JSON.parse(data) as AttackRequest;
  const currentGame = dataBase.games.find((game) => game.gameId === gameId);

  if (!currentGame) {
    return;
  }

  const firstPlayer = clients.get(currentGame.players[0].id);
  const secondPlayer = clients.get(currentGame.players[1].id);

  if (!firstPlayer || !secondPlayer) {
    return;
  }

  const attackedShip = attackResult(currentGame, x, y, indexPlayer as string);
  const responses = [];

  if (!attackedShip) {
    switchTurn(currentGame);
    responses.push(createAttackResponse(indexPlayer, { x, y }, 'miss'));
  } else {
    const isDead = attackedShip.isDead();

    if (isDead) {
      responses.push(createAttackResponse(indexPlayer, { x, y }, 'killed'));
      const surroundingCoords = attackedShip.getSurroundingCoordinates();
      surroundingCoords.forEach((coord) => {
        const { x, y } = coord;
        responses.push(createAttackResponse(indexPlayer, { x, y }, 'miss'));
      });
    } else {
      responses.push(createAttackResponse(indexPlayer, { x, y }, 'shot'));
    }
  }
  responses.push(turnResponse(currentGame.currentTurn!));

  responses.forEach((response) => {
    firstPlayer.ws.send(response);
    secondPlayer.ws.send(response);
  });
  responses.length = 0;
}
