import { createServer } from "http";
import app from "./httpServer";
import { initializeWebSocketServer } from "./webSocketServer";

const port = 8080;
const server = createServer(app);

initializeWebSocketServer(server);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
