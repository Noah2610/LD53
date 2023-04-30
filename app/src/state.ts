import { ActionName } from "./config";
import { Entity } from "./entities";

interface State {
    entities: Entity[];
    actions: Map<ActionName, "down" | "press" | "up">;
    ws: WebSocket | null;
}

export const STATE: State = {
    entities: [],
    actions: new Map(),
    ws: null,
};

// @ts-ignore
window.STATE = STATE;
