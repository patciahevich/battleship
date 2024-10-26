import { Game } from '../dataBase/dataBase';
import { MessageType } from '../types/types';

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

export function turnResponse(id: string) {
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
