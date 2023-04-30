import * as express from "express";
import * as ws from "ws";
import { v4 as genUuid } from "uuid";

const PORT = 8090;
const HOST = "0.0.0.0";

const expressServer = express();
const wss = new ws.Server({ noServer: true });

interface State {
    clients: Map<string, Client>;
}

interface Client {
    id: string;
    ws: ws.WebSocket;
}

const STATE: State = {
    clients: new Map(),
};

function createClient(ws: ws.WebSocket) {
    const id = genUuid();
    const client = { id, ws };
    STATE.clients.set(id, client);
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
    console.log(`Client connected: ${client.id}`);

    ws.on("close", (code) => {
        console.log(`Client disconnected: ${code}`);
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

// TODO
type Message = any;

function onClientMessage(client: Client, message: Message) {
    console.log("Client message", message);

    switch (message.type) {
        case "ping": {
            const message = { type: "pong" };
            client.ws.send(JSON.stringify(message));
            break;
        }
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
