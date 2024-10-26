import { MessageType, ShipsRequest } from '../types/types';
import { dataBase, Game, GamePlayer } from '../dataBase/dataBase';
import Ship from './ship';

export function addShips(data: string) {
  const { gameId, ships, indexPlayer } = JSON.parse(data) as ShipsRequest;
  const currentGame = dataBase.games.find((game) => game.gameId === gameId);

  if (!currentGame) {
    return;
  }

  const player = currentGame.players.find(
    (player) => player.id === indexPlayer,
  );
  player && (player.ships = ships.map((ship) => new Ship(ship)));

  return currentGame;
}

export function checkReadyForBattle(game: Game) {
  return game.players.every((player) => player.ships && player.ships.length > 0)
    ? true
    : false;
}

export function createStartGameResponse(player: GamePlayer) {
  const payload = {
    ships: player.ships,
    currentPlayerIndex: player.id,
  };

  const response = {
    type: MessageType.START_GAME,
    data: JSON.stringify(payload),
    id: 0,
  };

  return JSON.stringify(response);
}
