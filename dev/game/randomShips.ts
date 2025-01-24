import { ShipData } from '../types/types';
import Ship from '../ships/ship';

const botShips: ShipData[] = [
  {
    position: { x: 1, y: 1 },
    direction: true,
    length: 4,
    type: 'huge',
  },
  {
    position: { x: 4, y: 1 },
    direction: false,
    length: 3,
    type: 'large',
  },
  {
    position: { x: 8, y: 3 },
    direction: true,
    length: 3,
    type: 'large',
  },
  {
    position: { x: 5, y: 3 },
    direction: true,
    length: 2,
    type: 'medium',
  },
  {
    position: { x: 3, y: 6 },
    direction: false,
    length: 2,
    type: 'medium',
  },
  {
    position: { x: 1, y: 8 },
    direction: false,
    length: 2,
    type: 'medium',
  },
  {
    position: { x: 8, y: 1 },
    direction: true,
    length: 1,
    type: 'small',
  },
  {
    position: { x: 3, y: 3 },
    direction: false,
    length: 1,
    type: 'small',
  },
  {
    position: { x: 7, y: 7 },
    direction: false,
    length: 1,
    type: 'small',
  },
  {
    position: { x: 5, y: 8 },
    direction: false,
    length: 1,
    type: 'small',
  },
];

export function placeAllShips() {
  return botShips.map((ship) => new Ship(ship));
}
