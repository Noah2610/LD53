import { Component, ComponentName, ComponentOfName } from "../components";
import { State, STATE, StateEntityApi } from "../state";

export type EntityId = string;

export class Entity implements StateEntityApi {
    public id: EntityId;

    public get: StateEntityApi["get"];
    public add: StateEntityApi["add"];
    public remove: StateEntityApi["remove"];
    public destroy: StateEntityApi["destroy"];

    private api: StateEntityApi;

    constructor(id: string, api: StateEntityApi) {
        this.id = id;
        this.api = api;

        this.get = this.api.get;
        this.add = this.api.add;
        this.remove = this.api.remove;
        this.destroy = this.api.destroy;
    }
}

export function setupPlayer() {
    // TODO
    const el = document.querySelector<HTMLElement>(".player.entity")!;

    if (!el) {
        throw new Error("Expected .player element");
    }

    STATE.createEntity("player").add(
        { name: "player", speed: 2 },
        { name: "sprite", el },
        { name: "position", x: 0, y: 0 },
    );
}
