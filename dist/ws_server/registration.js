"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegistration = handleRegistration;
const users = [];
function handleRegistration(ws, data) {
    try {
        const request = data;
        if (!request?.name?.trim() || !request?.password?.trim()) {
            throw new Error("Name and password are required");
        }
        if (users.some((u) => u.name === request.name)) {
            throw new Error("User already exists");
        }
        const newUser = {
            name: request.name,
            password: request.password,
        };
        users.push(newUser);
        const response = {
            name: newUser.name,
            index: users.length - 1,
            error: false,
        };
        ws.send(JSON.stringify({
            type: "reg",
            data: JSON.stringify(response),
            id: 0,
        }));
    }
    catch (error) {
        const response = {
            name: data?.name || "",
            index: -1,
            error: true,
            errorText: error instanceof Error ? error.message : "Unknown error",
        };
        ws.send(JSON.stringify({
            type: "reg",
            data: JSON.stringify(response),
            id: 0,
        }));
    }
}
