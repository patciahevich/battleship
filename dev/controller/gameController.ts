import { attackResult, findEnemy, getHitData } from '../game/game';
import { dataBase, GamePlayer } from '../dataBase/dataBase';
import { Client, clients } from '../clients/clients';
import { Position } from '../types/types';
import { getRandomCoordinates } from '../game/randomAttack';
import { getAttackResult } from '../game/attackResult';

function addPlayer(playerData: GamePlayer, arr: Client[]) {
  const player = clients.get(playerData.id);
  player && arr.push(player);
}

export function gameController(data: string, flag: 'attack' | 'random') {
  const { gameId, indexPlayer, x, y } = getHitData(data, flag);

  const currentGame = dataBase.games.find((game) => game.gameId === gameId);

  if (!currentGame || indexPlayer !== currentGame.currentTurn) {
    console.log('no turn', currentGame, indexPlayer);
    return;
  }

  const players: Client[] = [];
  const bot = currentGame.players.find((player) => player.id === 'bot');
  const realPlayer = currentGame.players.find((player) => player.id !== 'bot');

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

  const responses = getAttackResult(
    currentGame,
    enemy,
    attackCoordinates,
    indexPlayer as string,
    attackedShip,
  );

  responses.forEach((response) => {
    players.forEach((player) => player.ws.send(response));
  });
  responses.length = 0;

  if (currentGame.currentTurn === 'bot') {
    setTimeout(() => {
      gameController(JSON.stringify({ gameId, indexPlayer: 'bot' }), 'random');
    }, 2500);
  }
}
