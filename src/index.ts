import { httpServer } from "./http_server/index";
import { createWebSocketServer } from "./ws_server/index";
const HTTP_PORT = 8181;
const WS_PORT = 3000;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`);
});

createWebSocketServer(WS_PORT);
