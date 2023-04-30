interface BaseMessage {
    type: string;
}

interface AuthedMessage {
    auth: string;
}

export type Authed<M extends object> = M & AuthedMessage;
export type Unauthed<M extends object> = M | Omit<M, "auth">;

// ----------------------------------------

export interface ServerMessagePong {
    type: "pong";
}

export interface ServerMessageAuth {
    type: "auth";
    auth: string;
    id: string;
}

export interface ServerMessagePlayerJoin extends AuthedMessage {
    type: "playerJoin";
    payload: PlayerInfo[];
}

export interface ServerMessagePlayerLeave extends AuthedMessage {
    type: "playerLeave";
    payload: Omit<PlayerInfo, "position">[];
}

export type ServerMessage = BaseMessage &
    (
        | ServerMessagePong
        | ServerMessageAuth
        | ServerMessagePlayerJoin
        | ServerMessagePlayerLeave
    );

// ----------------------------------------

export interface ClientMessagePing {
    type: "ping";
}

export interface ClientMessageJoin extends AuthedMessage {
    type: "join";
    auth: string;
    payload: PlayerInfo;
}

export interface ClientMessageLeave extends AuthedMessage {
    type: "leave";
    auth: string;
}

export type ClientMessage = BaseMessage &
    (ClientMessagePing | ClientMessageJoin | ClientMessageLeave);

// ----------------------------------------

export interface PlayerInfo {
    id: string;
    position: {
        x: number;
        y: number;
    };
}
