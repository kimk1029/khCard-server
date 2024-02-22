import WebSocket, { WebSocketServer } from "ws";

function shuffle(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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

// Initialize and shuffle the deck at the start
let deck = shuffle(
  suits.flatMap((suit) => values.map((value) => `${value} of ${suit}`))
);

const wss = new WebSocketServer({ port: 8080 });
let numPlayers = 2; // Default number of players

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", (message: string) => {
    const { action, value } = JSON.parse(message);

    switch (action) {
      case "setPlayers":
        numPlayers = value;
        console.log(`Number of players set to: ${numPlayers}`);
        break;
      case "shuffle":
        // Reinitialize and shuffle the deck upon request
        deck = shuffle(
          suits.flatMap((suit) => values.map((value) => `[${value}  ${suit}]`))
        );
        const dealtCards = Array.from({ length: numPlayers }, () =>
          deck.splice(0, 2)
        );
        ws.send(JSON.stringify({ action: "deal", cards: dealtCards }));
        break;
      case "flop":
        // Draw 3 cards from the remaining deck for the flop
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

console.log("Card game WebSocket server started on ws://localhost:8080");
