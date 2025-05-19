import { WebSocketServer, WebSocket } from "ws";
import { handleRegistration } from "./usersRegistration";
import { handleCreateRoom } from "./rooms/roomsHandler";
import { connectedUsers } from "./connectedUsers";

export function createWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New client connected");

    ws.on("message", (rawMessage) => {
      try {
        const message = JSON.parse(rawMessage.toString());

        if (!message.type) throw new Error("Type is required");
        if (message.id !== 0) throw new Error("Invalid message ID");

        switch (message.type) {
          case "reg":
            const data = JSON.parse(message.data);
            handleRegistration(ws, data);
            break;
          case "create_room":
            handleCreateRoom(ws, wss);
            break;

          default:
            throw new Error("Unknown command");
        }
      } catch (error) {
        const errorText =
          error instanceof Error ? error.message : "Unknown error";
        ws.send(
          JSON.stringify({
            type: "error",
            data: JSON.stringify({ errorText: errorText }),
            id: 0,
          }),
        );
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      connectedUsers.delete(ws);
    });
  });

  console.log(`WS server started on ws://localhost:${port}`);
  return wss;
}
