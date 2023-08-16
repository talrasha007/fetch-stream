import WebSocket from 'ws';
import { getWsEvents } from 'fetch-stream-parser';

(async function () {
  const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
  setTimeout(() => ws.send('{"op":1,"d":6}'), 1000);
  setTimeout(() => ws.close(), 5000);

  for await (const event of getWsEvents(ws)) {
    console.log(event);
  }

  console.log('socket closed.');
})(console.error);