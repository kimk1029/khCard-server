import express from "express";
// import mysql from "mysql";
// import session from "express-session";
import { WebSocketServer } from "ws";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
1;
const port = 3000;
export function initializeWebSocketServer(server: any): void {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected!!!");

    ws.on("message", (message: string) => {
      const { action, value } = JSON.parse(message);

      switch (action) {
        case "setPlayers":
          numPlayers = value;
          console.log(`Number of players set to: ${numPlayers}`);
          break;
        case "shuffle":
          deck = shuffle(
            suits.flatMap((suit) => values.map((value) => `[${value} ${suit}]`))
          );
          const dealtCards = Array.from({ length: numPlayers }, () =>
            deck.splice(0, 2)
          );
          ws.send(JSON.stringify({ action: "deal", cards: dealtCards }));
          break;
        case "flop":
          const flopCards = deck.splice(0, 3);
          ws.send(JSON.stringify({ action: "flop", cards: flopCards }));
          break;
        default:
          console.log("Unknown action:", action);
      }
    });

    ws.send(
      JSON.stringify({
        action: "welcome",
        message: "Welcome to the card game server!",
      })
    );
  });
}
// WebSocket server setup
const wss = new WebSocketServer({ noServer: true });
const suits = ["♥", "◆", "♧", "♤"];
const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let deck = shuffle(
  suits.flatMap((suit) => values.map((value) => `${value} of ${suit}`))
);
let numPlayers = 2;
