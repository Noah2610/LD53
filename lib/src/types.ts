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

export interface ServerMessagePlayerPosition extends AuthedMessage {
    type: "playerPosition";
    payload: PlayerInfo[];
}

export type ServerMessage = BaseMessage &
    (
        | ServerMessagePong
        | ServerMessageAuth
        | ServerMessagePlayerJoin
        | ServerMessagePlayerLeave
        | ServerMessagePlayerPosition
    );

// ----------------------------------------

export interface ClientMessagePing {
    type: "ping";
}

export interface ClientMessageJoin extends AuthedMessage {
    type: "join";
    payload: PlayerInfo;
}

export interface ClientMessageLeave extends AuthedMessage {
    type: "leave";
}

export interface ClientMessagePlayerPosition extends AuthedMessage {
    type: "playerPosition";
    payload: PlayerInfo;
}

export type ClientMessage = BaseMessage &
    (
        | ClientMessagePing
        | ClientMessageJoin
        | ClientMessageLeave
        | ClientMessagePlayerPosition
    );

// ----------------------------------------

export interface PlayerInfo {
    id: string;
    position: {
        x: number;
        y: number;
    };
}
