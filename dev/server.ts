import { WebSocketServer, WebSocket } from 'ws';
import { router } from './router/router';
import { randomUUID } from 'crypto';

export const clients = new Map<string, WebSocket>();

function startServer() {
  const wss = new WebSocketServer({ port: 3000 });

  wss.on('connection', (ws) => {
    const clientId = randomUUID();
    clients.set(clientId, ws);
    console.log(`New WebSocket connection: ${clientId}`);

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      router(clientId, parsedMessage);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('ws server is open');
}

startServer();
