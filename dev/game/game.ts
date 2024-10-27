import { Game } from '../dataBase/dataBase';
import { AttackStatus, MessageType, Position } from '../types/types';

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

export function attackResult(
  game: Game,
  x: number,
  y: number,
  attackerId: string,
) {
  const attacked = game.players.find((player) => player.id !== attackerId);

  if (!attacked) {
    // attacked player not found
    return;
  }

  return attacked.ships!.find((ship) => ship.checkHit({ x, y }));
}

export function checkFinish(game: Game, attackerId: string | number) {
  const attacked = game.players.find((player) => player.id !== attackerId);

  return attacked && attacked.ships?.every((ship) => ship.isDead());
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
