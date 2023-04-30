import { SERVER_URL } from "./config";
import { STATE } from "./state";
import { addNotification } from "./ui";

// TODO
type Message = any;

export function setupSocket(): Promise<WebSocket> {
    return new Promise((resolve) => {
        const ws = new WebSocket(`ws://${SERVER_URL}`);
        STATE.ws = ws;

        ws.addEventListener("open", (e) => {
            console.log("Connected to server");
            addNotification("success", "Connected to server", {
                timeoutMs: 2000,
            });

            resolve(ws);
        });

        ws.addEventListener("error", (e) => {
            console.error("Error connecting to server");
            addNotification("error", "Error connecting to server");
            ws.close();
        });

        ws.addEventListener("close", (e) => {
            console.log(`Disconnected from server: ${e.code} ${e.reason}`);
            addNotification(
                "warning",
                `Disconnected from server: ${e.code} ${e.reason}`,
            );
            ws.close();
        });

        ws.addEventListener("message", (event) => {
            try {
                const json = JSON.parse(event.data);
                onServerMessage(json);
            } catch (err) {
                console.error("Error parsing server message", err);
                addNotification(
                    "error",
                    `Error parsing server message: ${event.data}`,
                );
            }
        });
    });
}

function onServerMessage(message: Message) {
    switch (message.type) {
        case "pong": {
            console.log("Received pong from server");
            addNotification("success", "Received pong from server", {
                timeoutMs: 2000,
            });
            break;
        }
    }
}

export function sendMessage(message: Message) {
    if (!STATE.ws) {
        throw new Error("No websocket connection");
    }

    STATE.ws.send(JSON.stringify(message));
}
