export interface BaseMessage {
    type: string;
}

export interface AuthedMessage {
    auth: string;
}

export type Authed<M extends object> = M & AuthedMessage;
export type Unauthed<M extends object> = M | Omit<M, "auth">;
