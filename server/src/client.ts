import {
    ClientMessageJoin,
    ClientMessagePlayerPosition,
    ServerMessage,
    Unauthed,
} from "ld53-lib/types";
import * as ws from "ws";
import { Player } from "./player";
import { STATE } from "./state";
import { genUuid } from "./util";

export class Client {
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

    public join(info: ClientMessageJoin["payload"]) {
        this.player = new Player(info.id);
        this.player.setPosition(info.position);

        const playerJoinedPayload = [...STATE.clients.values()]
            .filter((c) => c.player && c.id !== this.id)
            .map<ClientMessageJoin["payload"]>((c) => ({
                id: c.id,
                position: c.player!.position,
            }));
        if (playerJoinedPayload.length > 0) {
            this.sendAuthed({
                type: "playerJoin",
                payload: playerJoinedPayload,
            });
        }

        STATE.server.broadcast(
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
        STATE.server.broadcast(
            {
                type: "playerLeave",
                payload: [{ id: this.id }],
            },
            this,
        );
    }

    public setPlayerPosition(payload: ClientMessagePlayerPosition["payload"]) {
        this.player?.setPosition(payload.position);

        STATE.server.broadcast(
            {
                type: "playerPosition",
                payload: [
                    {
                        id: this.id,
                        position: {
                            x: payload.position.x,
                            y: payload.position.y,
                        },
                    },
                ],
            },
            this,
        );
    }
}
