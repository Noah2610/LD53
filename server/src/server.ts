import * as cors from "cors";
import * as express from "express";
import { ClientMessage, ServerMessage, Unauthed } from "ld53-lib/types";
import * as ws from "ws";
import { expectNever } from "ts-expect";
import { Client } from "./client";
import { APP_URL, HOST, PORT } from "./config";
import { STATE } from "./state";

export class Server {
    private wss: ws.Server;
    private express: express.Express;

    constructor() {
        this.wss = new ws.Server({ noServer: true });
        this.express = express();
    }

    public launch() {
        this.express.use(
            cors({
                origin: APP_URL,
            }),
        );

        this.wss.on("connection", this.onConnection.bind(this));

        const server = this.express.listen(PORT, HOST, () => {
            console.log(`Server listening on ${HOST}:${PORT}`);
        });

        server.on("upgrade", (req, socket, head) => {
            this.wss.handleUpgrade(req, socket, head, (ws) => {
                this.wss.emit("connection", ws, req);
            });
        });
    }

    public broadcast(message: Unauthed<ServerMessage>, from: Client | null) {
        for (const client of STATE.clients.values()) {
            if (from && client.id === from.id) {
                continue;
            }
            client.sendAuthed(message);
        }
    }

    private onConnection(ws: ws.WebSocket) {
        const client = this.createClient(ws);
        client.sendAuth();
        console.log(`Client connected: ${client.id}`);

        ws.on("close", (code) => {
            console.log(`Client disconnected: ${code}`);
            client.leave();
            this.removeClient(client.id);
        });

        ws.on("message", (data) => {
            try {
                const json = JSON.parse(data.toString());
                this.onClientMessage(client, json);
            } catch (e) {
                console.error(`Error parsing client message: ${e}`);
            }
        });
    }

    private createClient(ws: ws.WebSocket) {
        const client = new Client(ws);
        STATE.clients.set(client.id, client);
        return client;
    }

    private removeClient(id: string) {
        const client = STATE.clients.get(id);
        if (client && client.ws.readyState === ws.OPEN) {
            client.ws.close(1000, "Client removed");
        }
        STATE.clients.delete(id);
    }

    private onClientMessage(client: Client, message: ClientMessage) {
        console.log("Client message", message);

        switch (message.type) {
            case "ping": {
                client.send({ type: "pong" });
                return;
            }
        }

        if (!client.isValidAuth(message.auth)) {
            console.log(`Unauthed message from user "${client.id}":`, message);
            return;
        }

        switch (message.type) {
            case "join": {
                client.join(message.payload);
                break;
            }
            case "leave": {
                client.leave();
                break;
            }
            case "playerPosition": {
                client.setPlayerPosition(
                    message.payload.position,
                    message.payload.velocity,
                );
                break;
            }
            case "playerName": {
                client.setPlayerName(message.payload.name);
                break;
            }
            case "playerAttack": {
                client.playerAttack();
                break;
            }
            case "playerVelocity": {
                client.setPlayerVelocity(message.payload.velocity);
                break;
            }
            default: {
                console.error(`Unimplemented message type:`, message);
                expectNever(message);
            }
        }
    }
}
