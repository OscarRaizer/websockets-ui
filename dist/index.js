"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./http_server/index");
const index_2 = require("./ws_server/index");
const HTTP_PORT = 8181;
const WS_PORT = 3000;
index_1.httpServer.listen(HTTP_PORT, () => {
    console.log(`Server is running on http://localhost:${HTTP_PORT}`);
});
(0, index_2.createWebSocketServer)(WS_PORT);
