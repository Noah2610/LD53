import {
    ClientMessage,
    ServerMessage,
    ServerMessageAuth,
    ServerMessagePlayerJoin,
    ServerMessagePlayerLeave,
    ServerMessagePlayerPosition,
    Unauthed,
} from "ld53-lib/types";
import { SERVER_URL } from "./config";
import { removePlayer, setPlayerPosition, setupPlayer } from "./entities";
import { STATE } from "./state";
import { addNotification } from "./ui";

export class Conn {
    public clientId: string | null;

    private ws: WebSocket;
    private auth: string | null;

    private _onConnected?: (conn: this) => void;
    private _onAuthed?: (conn: this) => void;
    private _onDisconnected?: (conn: this) => void;

    constructor(ws: WebSocket) {
        this.clientId = null;
        this.ws = ws;
        this.auth = null;
    }

    public send(message: ClientMessage) {
        if (this.ws.readyState !== WebSocket.OPEN) {
            console.error(
                `Attempted to send "${message.type}" message to closed socket`,
                message,
            );
            addNotification(
                "error",
                `Attempted to send "${message.type}" message to closed socket`,
            );
            return;
        }

        console.log("ClientMessage:", message);

        this.ws.send(JSON.stringify(message));
    }

    public sendAuthed(message: Unauthed<ClientMessage>) {
        if (!this.isAuthed()) {
            console.error(
                `Attempted to send "${message.type}" message without auth`,
                message,
            );
            return;
        }

        const authedMessage = {
            ...message,
            auth: this.auth,
        } as ClientMessage;
        this.send(authedMessage);
    }

    public setup(
        opts: {
            onConnected?: (conn: Conn) => void;
            onAuthed?: (conn: Conn) => void;
            onDisconnected?: (conn: Conn) => void;
        } = {},
    ): Promise<this> {
        this._onConnected = opts?.onConnected;
        this._onAuthed = opts?.onAuthed;
        this._onDisconnected = opts?.onDisconnected;

        return new Promise((resolve) => {
            this.ws.addEventListener("open", () => {
                console.log("Connected to server");
                addNotification("success", "Connected to server", {
                    timeoutMs: 2000,
                });

                if (this._onConnected) {
                    this._onConnected(this);
                }

                resolve(this);
            });

            this.ws.addEventListener("error", () => {
                console.error("Error connecting to server");
                addNotification("error", "Error connecting to server");
                // this.ws.close();
                // this.auth = null;
            });

            this.ws.addEventListener("close", (e) => {
                console.log(`Disconnected from server: ${e.code} ${e.reason}`);
                addNotification(
                    "warning",
                    `Disconnected from server: ${e.code} ${e.reason}`,
                );

                if (this._onDisconnected) {
                    this._onDisconnected(this);
                }

                this.ws.close();
                this.auth = null;
            });

            this.ws.addEventListener("message", (event) => {
                try {
                    const json = JSON.parse(event.data);
                    this.onServerMessage(json);
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

    private onServerMessage(message: ServerMessage) {
        console.log("ServerMessage:", message);

        switch (message.type) {
            case "pong": {
                addNotification("success", "Received pong from server", {
                    timeoutMs: 2000,
                });
                return;
            }
            case "auth": {
                this.onAuth(message);
                return;
            }
        }

        if (!this.isValidAuth(message.auth)) {
            console.log(`Unauthed message from server:`, message);
            return;
        }

        switch (message.type) {
            case "playerJoin": {
                this.onPlayerJoin(message);
                return;
            }
            case "playerLeave": {
                this.onPlayerLeave(message);
                return;
            }
            case "playerPosition": {
                this.onPlayerPosition(message);
            }
        }
    }

    private onAuth(message: ServerMessageAuth) {
        if (this.isAuthed()) {
            console.error("[Conn] Attempted to auth again", message);
            return;
        }

        this.clientId = message.id;
        this.auth = message.auth;

        if (this._onAuthed) {
            this._onAuthed(this);
        }
    }

    private isAuthed() {
        return this.auth !== null;
    }

    private isValidAuth(auth: string) {
        return this.auth === auth;
    }

    private onPlayerJoin(message: ServerMessagePlayerJoin) {
        for (const payload of message.payload) {
            if (payload.id === this.clientId) {
                continue;
            }

            // TODO
            setupPlayer({
                id: payload.id,
                isYou: false,
                position: payload.position,
            });
        }
    }

    private onPlayerLeave(message: ServerMessagePlayerLeave) {
        for (const payload of message.payload) {
            removePlayer(payload.id);
        }
    }

    private onPlayerPosition(message: ServerMessagePlayerPosition) {
        for (const payload of message.payload) {
            setPlayerPosition(payload.id, payload.position);
        }
    }
}

export function setupSocket(
    opts: Parameters<Conn["setup"]>[0] = {},
): Promise<Conn> {
    const ws = new WebSocket(`ws://${SERVER_URL}`);
    const conn = new Conn(ws);
    STATE.conn = conn;
    return conn.setup(opts);
}
