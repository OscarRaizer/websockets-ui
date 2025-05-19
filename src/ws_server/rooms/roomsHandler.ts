import { WebSocket, WebSocketServer } from "ws";
import { createRoom, getRooms, removeRoom, addUserToRoom } from "./rooms";
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

export function handleAddUserToRoom(
  ws: WebSocket,
  wss: WebSocketServer,
  data: { indexRoom: number | string },
) {
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

  const roomId = data.indexRoom;
  const room = addUserToRoom(Number(roomId), user);

  if (!room) {
    ws.send(
      JSON.stringify({
        type: "error",
        data: JSON.stringify({ errorText: "Room not found or full" }),
        id: 0,
      }),
    );
    return;
  }

  if (room.roomUsers.length === 2) {
    removeRoom(room.roomId);
  }

  broadcastUpdateRooms(wss);

  room.roomUsers.forEach((roomUser) => {
    const client = Array.from(connectedUsers.entries()).find(
      ([_, u]) => u.name === roomUser.name,
    )?.[0];
    if (client) {
      client.send(
        JSON.stringify({
          type: "create_game",
          data: JSON.stringify({
            idGame: room.roomId,
            idPlayer: roomUser.name,
          }),
          id: 0,
        }),
      );
    }
  });
}
