import { ShipData } from '../types/types';
import Ship from '../ships/ship';

const botShips: ShipData[] = [
  {
    position: { x: 0, y: 0 },
    direction: true,
    length: 4,
    type: 'huge',
  },
  {
    position: { x: 2, y: 2 },
    direction: false,
    length: 3,
    type: 'large',
  },
  {
    position: { x: 5, y: 5 },
    direction: true,
    length: 3,
    type: 'large',
  },
  {
    position: { x: 7, y: 1 },
    direction: true,
    length: 2,
    type: 'medium',
  },
  {
    position: { x: 4, y: 7 },
    direction: false,
    length: 2,
    type: 'medium',
  },
  {
    position: { x: 9, y: 0 },
    direction: true,
    length: 1,
    type: 'small',
  },
  {
    position: { x: 1, y: 9 },
    direction: false,
    length: 1,
    type: 'small',
  },
];

export function placeAllShips() {
  return botShips.map((ship) => new Ship(ship));
}
