import * as express from "express";
import * as ws from "ws";

const PORT = 8090;
const HOST = "0.0.0.0";

const expressServer = express();
const wss = new ws.Server({ noServer: true });

wss.on("connection", (ws) => {
    ws.on("close", (code) => {
        console.log(`Client disconnected: ${code}`);
    });

    console.log("Client connected: ");
});

const server = expressServer.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
    });
});
