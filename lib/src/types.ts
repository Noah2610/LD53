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
    payload: {
        id: string;
        name: string;
        position: { x: number; y: number };
    }[];
}

export interface ServerMessagePlayerLeave extends AuthedMessage {
    type: "playerLeave";
    payload: { id: string }[];
}

export interface ServerMessagePlayerPosition extends AuthedMessage {
    type: "playerPosition";
    payload: {
        id: string;
        position: { x: number; y: number };
    }[];
}

export interface ServerMessagePlayerName extends AuthedMessage {
    type: "playerName";
    payload: {
        id: string;
        name: string;
    }[];
}

export type ServerMessage = BaseMessage &
    (
        | ServerMessagePong
        | ServerMessageAuth
        | ServerMessagePlayerJoin
        | ServerMessagePlayerLeave
        | ServerMessagePlayerPosition
        | ServerMessagePlayerName
    );

// ----------------------------------------

export interface ClientMessagePing {
    type: "ping";
}

export interface ClientMessageJoin extends AuthedMessage {
    type: "join";
    payload: {
        name?: string;
        position: { x: number; y: number };
    };
}

export interface ClientMessageLeave extends AuthedMessage {
    type: "leave";
}

export interface ClientMessagePlayerPosition extends AuthedMessage {
    type: "playerPosition";
    payload: {
        position: { x: number; y: number };
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
