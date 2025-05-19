"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketServer = createWebSocketServer;
const ws_1 = require("ws");
const registration_1 = require("./registration");
function createWebSocketServer(port) {
    const wss = new ws_1.WebSocketServer({ port });
    wss.on("connection", (ws) => {
        console.log("New client connected");
        ws.on("message", (rawMessage) => {
            try {
                const message = JSON.parse(rawMessage.toString());
                if (!message.type)
                    throw new Error("Type is required");
                if (message.id !== 0)
                    throw new Error("Invalid message ID");
                switch (message.type) {
                    case "reg":
                        const data = JSON.parse(message.data);
                        (0, registration_1.handleRegistration)(ws, data);
                        break;
                    default:
                        throw new Error("Unknown command");
                }
            }
            catch (error) {
                const errorText = error instanceof Error ? error.message : "Unknown error";
                ws.send(JSON.stringify({
                    type: "error",
                    data: JSON.stringify({ errorText: errorText }),
                    id: 0,
                }));
            }
        });
        ws.on("close", () => console.log("Client disconnected"));
    });
    console.log(`WS server started on ws://localhost:${port}`);
    return wss;
}
