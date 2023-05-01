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
    };
}

export interface ClientMessagePlayerName extends AuthedMessage {
    type: "playerName";
    payload: {
        name: string;
    };
}

export type ClientMessage = BaseMessage &
    (
        | ClientMessagePing
        | ClientMessageJoin
        | ClientMessageLeave
        | ClientMessagePlayerPosition
        | ClientMessagePlayerName
    );
