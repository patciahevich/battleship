import { WebSocketServer } from 'ws';
import { router } from './router/router';

function startServer() {
  const wss = new WebSocketServer({ port: 3000 });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
      console.log(`Receive a message`);
      const parsedMessage = JSON.parse(message.toString());
      const response = router(parsedMessage);

      // temporally check
      if (!response) {
        return;
      }

      ws.send(response);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log('ws server is open');
}

startServer();
