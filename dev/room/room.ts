import { randomUUID } from 'crypto';
import { dataBase } from '../dataBase/dataBase';
import { MessageType } from '../types/types';

function createPlayer(id: string, index: number) {
  const name =
    dataBase.players.find((player) => player.id === id)?.name ?? 'player 1';
  return {
    id,
    name,
    index,
  };
}

export function createRoom(id: string) {
  const newRoom = {
    roomId: randomUUID(),
    roomUsers: [createPlayer(id, 1)],
  };
  dataBase.rooms.push(newRoom);
}

function updateRooms() {
  return JSON.stringify(dataBase.rooms);
}

export function updateRoomsResponse() {
  const rooms = {
    type: MessageType.UPDATE_ROOM,
    data: updateRooms(),
    id: randomUUID(),
  };

  return JSON.stringify(rooms);
}

export function addUserToRoom(id: string, data: string) {
  const { indexRoom } = JSON.parse(data);
  const currentRoomIndex = dataBase.rooms.findIndex(
    (room) => room.roomId === indexRoom,
  );

  console.log(currentRoomIndex);

  if (currentRoomIndex === -1) {
    // message
    return;
  }

  const currentRoom = dataBase.rooms[currentRoomIndex];

  if (id === currentRoom.roomUsers[0].id) {
    console.error('the same user try to enter the room');
    return;
  }
  currentRoom.roomUsers.push(createPlayer(id, 2));
  // delete this room from available rooms
  dataBase.rooms.splice(currentRoomIndex, 1);
  return currentRoom;
}

export function createStartGameResponse(idGame: string) {
  const payload = {
    idGame,
    idPlayer: randomUUID(),
  };

  const response = {
    type: MessageType.CREATE_GAME,
    data: JSON.stringify(payload),
    id: randomUUID(),
  };

  return JSON.stringify(response);
}
