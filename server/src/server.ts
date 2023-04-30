import * as express from "express";
import * as ws from "ws";
import { v4 as genUuid } from "uuid";
import {
    ClientMessage,
    PlayerInfo,
    ServerMessage,
    Unauthed,
} from "ld53-lib/types";

const PORT = 8090;
const HOST = "0.0.0.0";

const expressServer = express();
const wss = new ws.Server({ noServer: true });

interface State {
    clients: Map<string, Client>;
}

class Player {
    public position: { x: number; y: number };

    constructor(info: PlayerInfo) {
        this.position = info.position;
    }
}

class Client {
    public id: string;
    public ws: ws.WebSocket;

    private auth: string;
    private player: Player | null;

    constructor(ws: ws.WebSocket) {
        const id = genUuid();
        this.id = id;
        this.ws = ws;
        this.auth = genUuid();
        this.player = null;
    }

    public send(message: ServerMessage) {
        this.ws.send(JSON.stringify(message));
    }

    public sendAuthed(message: Unauthed<ServerMessage>) {
        const authedMessage = {
            ...message,
            auth: this.auth,
        } as ServerMessage;
        this.send(authedMessage);
    }

    public sendAuth() {
        this.send({
            type: "auth",
            auth: this.auth,
            id: this.id,
        });
    }

    public isValidAuth(auth: string) {
        return this.auth === auth;
    }

    public join(info: PlayerInfo) {
        this.player = new Player(info);

        const playerJoinedPayload = [...STATE.clients.values()]
            .filter((c) => c.player && c.id !== this.id)
            .map<PlayerInfo>((c) => ({
                id: c.id,
                position: c.player!.position,
            }));
        if (playerJoinedPayload.length > 0) {
            this.sendAuthed({
                type: "playerJoin",
                payload: playerJoinedPayload,
            });
        }

        broadcast(
            {
                type: "playerJoin",
                payload: [
                    {
                        id: this.id,
                        position: {
                            x: this.player.position.x,
                            y: this.player.position.y,
                        },
                    },
                ],
            },
            this,
        );
    }

    public leave() {
        broadcast(
            {
                type: "playerLeave",
                payload: [{ id: this.id }],
            },
            this,
        );
    }
}

const STATE: State = {
    clients: new Map(),
};

function createClient(ws: ws.WebSocket) {
    const client = new Client(ws);
    STATE.clients.set(client.id, client);
    return client;
}

function removeClient(id: string) {
    const client = STATE.clients.get(id);
    if (client && client.ws.readyState === ws.OPEN) {
        client.ws.close(1000, "Client removed");
    }
    STATE.clients.delete(id);
}

wss.on("connection", (ws) => {
    const client = createClient(ws);
    client.sendAuth();
    console.log(`Client connected: ${client.id}`);

    ws.on("close", (code) => {
        console.log(`Client disconnected: ${code}`);
        client.leave();
        removeClient(client.id);
    });

    ws.on("message", (data) => {
        try {
            const json = JSON.parse(data.toString());
            onClientMessage(client, json);
        } catch (e) {
            console.error(`Error parsing client message: ${e}`);
        }
    });
});

function onClientMessage(client: Client, message: ClientMessage) {
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
        default: {
            console.error(`Unimplemented message type:`, message);
            break;
        }
    }
}

function broadcast(message: Unauthed<ServerMessage>, from: Client | null) {
    for (const client of STATE.clients.values()) {
        if (client === from) {
            continue;
        }
        client.sendAuthed(message);
    }
}

const server = expressServer.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
    });
});
