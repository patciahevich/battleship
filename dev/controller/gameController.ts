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
import { dataBase, GamePlayer } from '../dataBase/dataBase';
import { Client, clients } from '../clients/clients';
import { Position } from '../types/types';
import { getRandomCoordinates } from '../game/randomAttack';

function addPlayer(playerData: GamePlayer, arr: Client[]) {
  const player = clients.get(playerData.id);
  player && arr.push(player);
}

export function gameController(data: string, flag: 'attack' | 'random') {
  const { gameId, indexPlayer, x, y } = getHitData(data, flag);
  const currentGame = dataBase.games.find((game) => game.gameId === gameId);

  if (!currentGame) {
    return;
  }

  const players: Client[] = [];
  const bot = currentGame.players.find((player) => player.id === 'bot');

  if (bot) {
    const playerData = currentGame.players.find(
      (player) => player.id !== 'bot',
    );

    if (playerData) {
      addPlayer(playerData, players);
    }
  } else {
    currentGame.players.forEach((playerData) => {
      addPlayer(playerData, players);
    });
  }

  const enemy = findEnemy(currentGame, indexPlayer);

  if (!enemy) {
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
      turnResponse(currentGame.currentTurn!),
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

      const isFinish = checkFinish(enemy);

      if (isFinish) {
        deleteGame(gameId);
        updateWinners(indexPlayer as string);
        responses.push(createFinishGameResponse(indexPlayer));
      } else {
        responses.push(turnResponse(currentGame.currentTurn!));
      }
    } else {
      responses.push(
        createAttackResponse(indexPlayer, attackCoordinates, 'shot'),
      );
    }
  }

  responses.forEach((response) => {
    players.forEach((player) => player.ws.send(response));
  });
  responses.length = 0;
}
