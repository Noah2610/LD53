import { Client } from "./client";
import { Server } from "./server";

export interface State {
    server: Server;
    clients: Map<string, Client>;
}

export const STATE: State = {
    server: new Server(),
    clients: new Map(),
};
