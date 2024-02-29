"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const httpServer_1 = __importDefault(require("./httpServer"));
const webSocketServer_1 = require("./webSocketServer");
const port = 8080;
const server = (0, http_1.createServer)(httpServer_1.default);
(0, webSocketServer_1.initializeWebSocketServer)(server);
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
