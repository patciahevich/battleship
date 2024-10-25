import { randomUUID } from 'crypto';
import { login } from '../login/login';
import { Message, MessageType } from '../types/types';

export function router(message: Message) {
  switch (message.type) {
    case MessageType.REG:
      const response: Message = {
        type: MessageType.REG,
        data: login(message.data),
        id: randomUUID(),
      };
      return JSON.stringify(response);
  }
}
