"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocketServer = void 0;
const express_1 = __importDefault(require("express"));
// import mysql from "mysql";
// import session from "express-session";
const ws_1 = require("ws");
const http_1 = require("http");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
1;
const port = 3000;
function initializeWebSocketServer(server) {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (ws) => {
        console.log("Client connected!!!");
        ws.on("message", (message) => {
            const { action, value } = JSON.parse(message);
            switch (action) {
                case "setPlayers":
                    numPlayers = value;
                    console.log(`Number of players set to: ${numPlayers}`);
                    break;
                case "shuffle":
                    deck = shuffle(suits.flatMap((suit) => values.map((value) => `[${value} ${suit}]`)));
                    const dealtCards = Array.from({ length: numPlayers }, () => deck.splice(0, 2));
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
        ws.send(JSON.stringify({
            action: "welcome",
            message: "Welcome to the card game server!",
        }));
    });
}
exports.initializeWebSocketServer = initializeWebSocketServer;
// WebSocket server setup
const wss = new ws_1.WebSocketServer({ noServer: true });
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
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
let deck = shuffle(suits.flatMap((suit) => values.map((value) => `${value} of ${suit}`)));
let numPlayers = 2;
