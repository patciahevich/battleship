import { GamePlayer } from '../dataBase/dataBase';

const size = 10;

export function getRandomCoordinates(enemy: GamePlayer) {
  const x = Math.floor(Math.random() * size);
  const y = Math.floor(Math.random() * size);
  const isUsedCoord =
    enemy.hits && enemy.hits.find((hit) => hit.x === x && hit.y === y);

  if (isUsedCoord) {
    return getRandomCoordinates(enemy);
  }

  return { x, y };
}
