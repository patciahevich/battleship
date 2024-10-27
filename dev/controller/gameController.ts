import {
  attackResult,
  checkFinish,
  createAttackResponse,
  createFinishGameResponse,
  deleteGame,
  findEnemy,
  getHitData,
  switchTurn,
  turnResponse,
  updateWinners,
} from '../game/game';
import { dataBase } from '../dataBase/dataBase';
import { clients } from '../clients/clients';
import { Position } from '../types/types';
import { getRandomCoordinates } from '../game/randomAttack';

export function gameController(data: string, flag: 'attack' | 'random') {
  const { gameId, indexPlayer, x, y } = getHitData(data, flag);
  const currentGame = dataBase.games.find((game) => game.gameId === gameId);

  if (!currentGame) {
    return;
  }

  const firstPlayer = clients.get(currentGame.players[0].id);
  const secondPlayer = clients.get(currentGame.players[1].id);
  const enemy = findEnemy(currentGame, indexPlayer);

  if (!firstPlayer || !secondPlayer || !enemy) {
    return;
  }

  const attackCoordinates: Position =
    typeof x === 'number' && typeof y === 'number'
      ? { x, y }
      : getRandomCoordinates(enemy);

  const attackedShip = attackResult(enemy, attackCoordinates);
  const responses = [];

  if (!attackedShip) {
    switchTurn(currentGame);
    responses.push(
      createAttackResponse(indexPlayer, attackCoordinates, 'miss'),
    );
  } else {
    const isDead = attackedShip.isDead();

    if (isDead) {
      responses.push(
        createAttackResponse(indexPlayer, attackCoordinates, 'killed'),
      );
      const surroundingCoords = attackedShip.getSurroundingCoordinates();
      surroundingCoords.forEach((coord) => {
        enemy.hits?.push(coord);
        responses.push(createAttackResponse(indexPlayer, coord, 'miss'));
      });
    } else {
      responses.push(
        createAttackResponse(indexPlayer, attackCoordinates, 'shot'),
      );
    }
  }

  const isFinish = checkFinish(enemy);

  if (isFinish) {
    deleteGame(gameId);
    updateWinners(indexPlayer as string);
    responses.push(createFinishGameResponse(indexPlayer));
  } else {
    responses.push(turnResponse(currentGame.currentTurn!));
  }

  responses.forEach((response) => {
    firstPlayer.ws.send(response);
    secondPlayer.ws.send(response);
  });
  responses.length = 0;
}
