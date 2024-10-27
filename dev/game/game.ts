import { clients } from '../clients/clients';
import { dataBase, Game, GamePlayer } from '../dataBase/dataBase';
import { createWinsResponse } from '../room/room';
import {
  AttackRequest,
  AttackStatus,
  MessageType,
  Position,
  RandomAttackRequest,
} from '../types/types';

export function getHitData(data: string, flag: 'attack' | 'random') {
  if (flag === 'attack') {
    const { gameId, x, y, indexPlayer } = JSON.parse(data) as AttackRequest;
    return { gameId, x, y, indexPlayer };
  } else {
    const { gameId, indexPlayer } = JSON.parse(data) as RandomAttackRequest;
    return { gameId, indexPlayer };
  }
}

export function switchTurn(game: Game) {
  if (game.currentTurn === null) {
    game.currentTurn = game.players[0].id;
  } else {
    const playerToTurn = game.players.find(
      (player) => player.id !== game.currentTurn,
    );
    game.currentTurn = (playerToTurn && playerToTurn.id) || game.players[0].id;
  }
}

export function turnResponse(id: string | number) {
  const payload = {
    currentPlayer: id,
  };

  const response = {
    type: MessageType.TURN,
    data: JSON.stringify(payload),
    id: 0,
  };

  return JSON.stringify(response);
}

export function findEnemy(game: Game, attackerId: string | number) {
  return game.players.find((player) => player.id !== attackerId);
}

export function attackResult(enemy: GamePlayer, coord: Position) {
  enemy.hits?.push(coord);
  return enemy.ships!.find((ship) => ship.checkHit(coord));
}

export function randomAttack() {}

export function checkFinish(enemy: GamePlayer) {
  return enemy && enemy.ships?.every((ship) => ship.isDead());
}

export function createAttackResponse(
  id: string | number,
  position: Position,
  status: AttackStatus,
) {
  const payload = {
    position,
    currentPlayer: id,
    status,
  };

  const response = {
    type: MessageType.ATTACK,
    data: JSON.stringify(payload),
    id: 0,
  };

  return JSON.stringify(response);
}

export function createFinishGameResponse(winPlayer: string | number) {
  const payload = {
    winPlayer,
  };

  const response = {
    type: MessageType.FINISH,
    data: JSON.stringify(payload),
    id: 0,
  };

  return JSON.stringify(response);
}

export function deleteGame(gameId: string | number) {
  const currentGameIndex = dataBase.games.findIndex(
    (game) => game.gameId === gameId,
  );
  currentGameIndex && dataBase.games.splice(currentGameIndex, 1);
}

export function updateWinners(winnerIndex: string) {
  const winnerName = clients.get(winnerIndex)?.user?.name;
  const winner = dataBase.players.find((player) => player.name === winnerName);

  if (winner) {
    winner.wins += 1;
  }

  clients.forEach((client) => client.ws.send(createWinsResponse()));
}
