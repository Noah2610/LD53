import {
    ClientMessage,
    ServerMessage,
    ServerMessageAuth,
    ServerMessagePlayerAttack,
    ServerMessagePlayerJoin,
    ServerMessagePlayerLeave,
    ServerMessagePlayerName,
    ServerMessagePlayerPosition,
    Unauthed,
} from "ld53-lib/types";
import { expectNever } from "ts-expect";
import { SERVER_URL } from "./config";
import {
    doPlayerAttack,
    removePlayer,
    setPlayerName,
    setPlayerPosition,
    setupPlayer,
} from "./entities/player";
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
                let json;

                try {
                    json = JSON.parse(event.data);
                } catch (err) {
                    console.error("Error parsing server message", err);
                    addNotification(
                        "error",
                        `Error parsing server message: ${event.data}`,
                    );
                    return;
                }

                this.onServerMessage(json);
            });
        });
    }

    public setPlayerName(name: string) {
        this.sendAuthed({
            type: "playerName",
            payload: {
                name,
            },
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
                return;
            }
            case "playerName": {
                this.onPlayerName(message);
                return;
            }
            case "playerAttack": {
                this.onPlayerAttack(message);
                return;
            }
            default: {
                expectNever(message);
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
            // if (payload.id === this.clientId) {
            //     continue;
            // }

            const isYou = payload.id === this.clientId;

            // TODO
            setupPlayer({
                id: payload.id,
                playerName: payload.name,
                isYou,
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

    private onPlayerName(message: ServerMessagePlayerName) {
        for (const payload of message.payload) {
            setPlayerName(payload.id, payload.name);
        }
    }

    private onPlayerAttack(message: ServerMessagePlayerAttack) {
        doPlayerAttack(message.payload.id);
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
