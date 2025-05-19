import { User } from "../types";

export interface Room {
  roomId: number;
  roomUsers: User[];
}

let rooms: Room[] = [];
let roomIdCounter = 1;

export function createRoom(user: User): Room {
  const newRoom: Room = {
    roomId: roomIdCounter++,
    roomUsers: [user],
  };
  rooms.push(newRoom);
  return newRoom;
}

export function getRooms(): Room[] {
  return rooms.filter((room) => room.roomUsers.length === 1);
}

export function addUserToRoom(roomId: number, user: User): Room | null {
  const room = rooms.find((r) => r.roomId === roomId);
  if (room && room.roomUsers.length < 2) {
    room.roomUsers.push(user);
    return room;
  }
  return null;
}

export function removeRoom(roomId: number): void {
  rooms = rooms.filter((room) => room.roomId !== roomId);
}
