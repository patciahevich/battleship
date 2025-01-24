import { Game, GamePlayer } from '../dataBase/dataBase';
import {
  checkFinish,
  createAttackResponse,
  createFinishGameResponse,
  deleteGame,
  switchTurn,
  turnResponse,
  updateWinners,
} from './game';
import { Position } from '../types/types';
import Ship from '../ships/ship';

export function getAttackResult(
  game: Game,
  enemy: GamePlayer,
  coord: Position,
  playerId: string,
  ship: Ship | undefined,
) {
  const responses = [];

  if (!ship) {
    switchTurn(game);
    responses.push(
      createAttackResponse(playerId, coord, 'miss'),
      turnResponse(game.currentTurn!),
    );
  } else {
    const isDead = ship.isDead();

    if (isDead) {
      responses.push(createAttackResponse(playerId, coord, 'killed'));
      const surroundingCoords = ship.getSurroundingCoordinates();

      surroundingCoords.forEach((coord) => {
        enemy.hits?.push(coord);
        responses.push(createAttackResponse(playerId, coord, 'miss'));
      });

      const isFinish = checkFinish(enemy);

      if (isFinish) {
        deleteGame(game.gameId);
        updateWinners(playerId as string);
        responses.push(createFinishGameResponse(playerId));
      } else {
        responses.push(turnResponse(game.currentTurn!));
      }
    } else {
      responses.push(createAttackResponse(playerId, coord, 'shot'));
    }
  }

  return responses;
}
