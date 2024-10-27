import WebSocket from 'ws';
import { PlayerData } from '../dataBase/dataBase';

export type Client = {
  ws: WebSocket;
  user?: Partial<PlayerData>;
};

export const clients = new Map<string, Client>();
