import { Message, MessageType } from '../types/types';
import {
  loginController,
  roomsController,
  shipsController,
} from '../controller/appController';
import { gameController } from '../controller/gameController';
import { createBot } from '../game/gameBot';

export function router(id: string, message: Message) {
  // message.data = string
  console.log(message.type);
  switch (message.type) {
    case MessageType.REG:
      loginController(id, message.data);
      break;
    case MessageType.CREATE_ROOM:
      roomsController(id, 'create');
      break;

    case MessageType.ADD_USER_TO_ROOM:
      roomsController(id, 'update', message.data);
      break;

    case MessageType.ADD_SHIPS:
      shipsController(message.data);
      break;

    case MessageType.ATTACK:
      gameController(message.data, 'attack');
      break;

    case MessageType.RANDOM_ATTACK:
      gameController(message.data, 'random');
      break;
    case MessageType.SINGLE_PLAY:
      createBot(id);
      break;
  }
}
