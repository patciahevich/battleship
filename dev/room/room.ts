import { randomUUID } from 'crypto';
import { dataBase } from '../dataBase/dataBase';
import { MessageType } from '../types/types';
import { clients } from '../clients/clients';

function createPlayer(id: string, index: number) {
  const name = clients.get(id)?.user?.name ?? 'player 1';
  return {
    id,
    name,
    index,
  };
}

export function createWinsResponse() {
  const payload = dataBase.players.filter((player) => player.wins > 0);
  const response = {
    type: MessageType.UPDATE_WINNERS,
    data: JSON.stringify(payload),
    id: 0,
  };

  return JSON.stringify(response);
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
    id: 0,
  };

  return JSON.stringify(rooms);
}

export function addUserToRoom(id: string, data: string) {
  const { indexRoom } = JSON.parse(data);
  const currentRoomIndex = dataBase.rooms.findIndex(
    (room) => room.roomId === indexRoom,
  );

  if (currentRoomIndex === -1) {
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

export function createGameResponse(idGame: string, idPlayer: string) {
  const payload = {
    idGame,
    idPlayer,
  };

  const response = {
    type: MessageType.CREATE_GAME,
    data: JSON.stringify(payload),
    id: 0,
  };

  return JSON.stringify(response);
}

export function removeRooms(firstPlayerId: string, secondPlayerId?: string) {
  const roomsIndexes = dataBase.rooms.reduce((acc: number[], room, index) => {
    if (
      room.roomUsers.find(
        (user) => user.id === firstPlayerId || user.id === secondPlayerId,
      )
    ) {
      acc.push(index);
    }
    return acc;
  }, []);

  if (roomsIndexes) {
    roomsIndexes.forEach((roomIndex) => dataBase.rooms.splice(roomIndex, 1));
  }
}
