import { Position, ShipData, ShipType } from '../types/types';

class Ship {
  position: { x: number; y: number };
  direction: boolean; // true - вертикально, false - горизонтально
  type: ShipType;
  length: number;
  hits: Position[];
  coordinates: Position[];

  constructor({ position, direction, type, length }: ShipData) {
    this.position = position;
    this.direction = direction;
    this.type = type;
    this.length = length;
    this.hits = [];
    this.coordinates = this.getCoordinates();
  }

  getCoordinates() {
    const coordinates = [];
    for (let i = 0; i < this.length; i++) {
      const x = this.direction ? this.position.x : this.position.x + i;
      const y = this.direction ? this.position.y + i : this.position.y;
      coordinates.push({ x, y });
    }
    return coordinates;
  }

  checkHit(hit: Position) {
    const isHeat = this.coordinates.find(
      (coord) => coord.x === hit.x && coord.y === hit.y,
    );

    if (isHeat) {
      this.hits.push(hit);
    }

    return isHeat;
  }

  isDead() {
    return this.hits.length === this.length;
  }

  getSurroundingCoordinates() {
    const surroundingCoords = [];

    if (this.direction) {
      surroundingCoords.push({
        x: this.position.x - 1,
        y: this.position.y - 1,
      }); // Top-Left
      surroundingCoords.push({
        x: this.position.x + 1,
        y: this.position.y - 1,
      }); // Top-Right
      surroundingCoords.push({ x: this.position.x, y: this.position.y - 1 }); // Top-Center
      surroundingCoords.push({
        x: this.position.x - 1,
        y: this.position.y + this.length,
      }); // Bottom-Left
      surroundingCoords.push({
        x: this.position.x + 1,
        y: this.position.y + this.length,
      }); // Bottom-Right
      surroundingCoords.push({
        x: this.position.x,
        y: this.position.y + this.length,
      }); // Bottom-Center

      for (let i = 0; i < this.length; i++) {
        surroundingCoords.push({
          x: this.position.x - 1,
          y: this.position.y + i,
        }); // Left
        surroundingCoords.push({
          x: this.position.x + 1,
          y: this.position.y + i,
        }); // Right
      }
    } else {
      surroundingCoords.push({
        x: this.position.x - 1,
        y: this.position.y - 1,
      }); // Top-Left

      surroundingCoords.push({
        x: this.position.x - 1,
        y: this.position.y + 1,
      }); // Bottom-Left

      surroundingCoords.push({
        x: this.position.x - 1,
        y: this.position.y,
      }); // Center-Left

      surroundingCoords.push({
        x: this.position.x + this.length,
        y: this.position.y - 1,
      }); // Top-Right

      surroundingCoords.push({
        x: this.position.x + this.length,
        y: this.position.y + 1,
      }); // Bottom-Right

      surroundingCoords.push({
        x: this.position.x + this.length,
        y: this.position.y,
      }); // Center-Right

      for (let i = 0; i < this.length; i++) {
        surroundingCoords.push({
          x: this.position.x + i,
          y: this.position.y - 1,
        });

        surroundingCoords.push({
          x: this.position.x + i,
          y: this.position.y + 1,
        });
      }
    }

    return surroundingCoords.filter((coord) => coord.x >= 0 && coord.y >= 0);
  }
}

export default Ship;
