import Ship from '../ships/ship';
import { ShipType } from '../types/types';

function createEmptyBoard(size: number = 10): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function isPlacementValid(
  board: number[][],
  x: number,
  y: number,
  length: number,
  direction: boolean,
): boolean {
  for (let i = 0; i < length; i++) {
    const nx = x + (direction ? i : 0);
    const ny = y + (direction ? 0 : i);

    if (nx < 0 || nx >= 10 || ny < 0 || ny >= 10 || board[ny][nx] !== 0) {
      return false;
    }

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const ax = nx + dx;
        const ay = ny + dy;

        if (ax >= 0 && ax < 10 && ay >= 0 && ay < 10 && board[ay][ax] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

function placeShip(board: number[][], length: number, type: ShipType): Ship {
  let placed = false;
  let ship: Ship | null = null;

  while (!placed) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const direction = Math.random() < 0.5; // true - horizontal, false - vertical

    if (isPlacementValid(board, x, y, length, direction)) {
      for (let i = 0; i < length; i++) {
        board[y + (direction ? 0 : i)][x + (direction ? i : 0)] = length;
      }
      ship = new Ship({
        position: { x, y },
        direction,
        length,
        type,
      });
      placed = true;
    }
  }
  return ship as Ship;
}

export function placeAllShips(): Ship[] {
  const board = createEmptyBoard();
  const shipsData = [
    { length: 4, type: 'huge' as ShipType },
    { length: 3, type: 'large' as ShipType },
    { length: 3, type: 'large' as ShipType },
    { length: 2, type: 'medium' as ShipType },
    { length: 2, type: 'medium' as ShipType },
    { length: 2, type: 'medium' as ShipType },
    { length: 1, type: 'small' as ShipType },
    { length: 1, type: 'small' as ShipType },
    { length: 1, type: 'small' as ShipType },
    { length: 1, type: 'small' as ShipType },
  ];

  return shipsData.map(({ length, type }) => placeShip(board, length, type));
}
