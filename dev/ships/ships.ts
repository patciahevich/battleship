import { ShipsRequest } from '../types/types';
import { dataBase, Game } from '../dataBase/dataBase';

export function addShips(data: string) {
  const { gameId, ships, indexPlayer } = JSON.parse(data) as ShipsRequest;
  const currentGame = dataBase.games.find((game) => game.gameId === gameId);

  if (!currentGame) {
    return;
  }

  const player = currentGame.players.find(
    (player) => player.id === indexPlayer,
  );
  player && (player.ships = ships);

  return currentGame;
}

export function checkReadyForBattle(game: Game) {
  return game.players.every((player) => player.ships && player.ships.length > 0)
    ? true
    : false;
}
