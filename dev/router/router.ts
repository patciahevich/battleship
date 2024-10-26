import { Message, MessageType } from '../types/types';
import {
  loginController,
  roomsController,
  shipsController,
} from '../controller/controller';

export function router(id: string, message: Message) {
  // message.data = string
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
  }
}
