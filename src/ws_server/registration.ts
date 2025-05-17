import { WebSocket } from "ws";
import { User, RegistrationRequest, RegistrationResponse } from "./types";

const users: User[] = [];

export function handleRegistration(ws: WebSocket, data: unknown) {
  try {
    const request = data as RegistrationRequest;

    if (!request?.name?.trim() || !request?.password?.trim()) {
      throw new Error("Name and password are required");
    }

    if (users.some((u) => u.name === request.name)) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      name: request.name,
      password: request.password,
    };
    users.push(newUser);

    const response: RegistrationResponse = {
      name: newUser.name,
      index: users.length - 1,
      error: false,
    };

    ws.send(
      JSON.stringify({
        type: "reg",
        data: JSON.stringify(response),
        id: 0,
      }),
    );
  } catch (error) {
    const response: RegistrationResponse = {
      name: (data as any)?.name || "",
      index: -1,
      error: true,
      errorText: error instanceof Error ? error.message : "Unknown error",
    };

    ws.send(
      JSON.stringify({
        type: "reg",
        data: JSON.stringify(response),
        id: 0,
      }),
    );
  }
}
