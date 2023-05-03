import { Vector } from ".";
import { AuthedMessage, BaseMessage } from "./message";

export interface ClientMessagePing {
    type: "ping";
}

export interface ClientMessageJoin extends AuthedMessage {
    type: "join";
    payload: {
        name?: string;
        position: Vector;
    };
}

export interface ClientMessageLeave extends AuthedMessage {
    type: "leave";
}

export interface ClientMessagePlayerPosition extends AuthedMessage {
    type: "playerPosition";
    payload: {
        position: Vector;
        velocity?: Vector;
    };
}

export interface ClientMessagePlayerVelocity extends AuthedMessage {
    type: "playerVelocity";
    payload: {
        velocity: Vector;
    };
}

export interface ClientMessagePlayerName extends AuthedMessage {
    type: "playerName";
    payload: {
        name: string;
    };
}

export interface ClientMessagePlayerAttack extends AuthedMessage {
    type: "playerAttack";
}

export type ClientMessage = BaseMessage &
    (
        | ClientMessagePing
        | ClientMessageJoin
        | ClientMessageLeave
        | ClientMessagePlayerPosition
        | ClientMessagePlayerVelocity
        | ClientMessagePlayerName
        | ClientMessagePlayerAttack
    );
