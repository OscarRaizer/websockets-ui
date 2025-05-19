import { WebSocket } from "ws";
import { User } from "./types";

export const connectedUsers: Map<WebSocket, User> = new Map();
