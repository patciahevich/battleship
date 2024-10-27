import { WebSocketServer, WebSocket } from 'ws';
import { router } from './router/router';
import { randomUUID } from 'crypto';
import { clients } from './clients/clients';
import { technicalDefeat } from './game/game';

function startServer() {
  const wss = new WebSocketServer({ port: 3000 });

  wss.on('connection', (ws) => {
    const clientId = randomUUID();
    clients.set(clientId, { ws: ws });
    console.log(`New WebSocket connection: ${clientId}`);

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      router(clientId, parsedMessage);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      technicalDefeat(clientId);
      clients.delete(clientId);
    });
  });

  function shutdownWebSocketServer() {
    clients.forEach((client) => {
      client.ws.close(1000, 'Server shutting down');
    });

    wss.close(() => {
      console.log('WebSocket server closed');
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdownWebSocketServer);
  process.on('SIGTERM', shutdownWebSocketServer);

  console.log('ws server is open');
}

startServer();
