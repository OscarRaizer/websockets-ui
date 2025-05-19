import { WebSocket, WebSocketServer } from "ws";
import { createRoom, getRooms } from "./rooms";
import { connectedUsers } from "../connectedUsers";

export function handleCreateRoom(ws: WebSocket, wss: WebSocketServer) {
  const user = connectedUsers.get(ws);
  if (!user) {
    ws.send(
      JSON.stringify({
        type: "error",
        data: JSON.stringify({ errorText: "User not registered" }),
        id: 0,
      }),
    );
    return;
  }

  const newRoom = createRoom(user);

  broadcastUpdateRooms(wss);

  ws.send(
    JSON.stringify({
      type: "create_room",
      data: JSON.stringify({
        roomId: newRoom.roomId,
        roomUsers: newRoom.roomUsers,
      }),
      id: 0,
    }),
  );
}

export function broadcastUpdateRooms(wss: WebSocketServer) {
  const rooms = getRooms();
  const updateMessage = JSON.stringify({
    type: "update_room",
    data: JSON.stringify(rooms),
    id: 0,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(updateMessage);
    }
  });
}
