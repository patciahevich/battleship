import { GamePlayer } from '../dataBase/dataBase';

const size = 10;

export function getRandomCoordinates(enemy: GamePlayer) {
  let x = Math.floor(Math.random() * size);
  let y = Math.floor(Math.random() * size);
  let isUsedCoord =
    enemy.hits && enemy.hits.find((hit) => hit.x === x && hit.y === y);

  if (isUsedCoord) {
    return getRandomCoordinates(enemy);
  }

  return { x, y };
}
