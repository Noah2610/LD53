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

export function setupPlayer({
    id,
    isYou,
    position,
}: {
    id: string;
    isYou: boolean;
    position: { x: number; y: number };
}): Entity {
    // TODO move to Sprite component
    const el = document.createElement("div");
    el.classList.add("player", "entity");
    document.querySelector(".game-entities")!.appendChild(el);

    return STATE.createEntity(`player-${id}`).add(
        { name: "player", isYou, id, speed: 2 },
        { name: "sprite", el },
        { name: "position", x: position.x, y: position.y },
    );
}

// TODO
export function removePlayer(playerId: string) {
    for (const { entity, player, sprite } of STATE.query({
        with: ["player", "sprite"],
    })) {
        if (player.id !== playerId) {
            continue;
        }

        sprite.el.remove();
        entity.destroy();
    }
}

// TODO
export function setPlayerPosition(
    playerId: string,
    pos: { x: number; y: number },
) {
    for (const { player, position } of STATE.query({
        with: ["player", "position"],
    })) {
        if (player.id !== playerId) {
            continue;
        }

        position.x = pos.x;
        position.y = pos.y;
    }
}
