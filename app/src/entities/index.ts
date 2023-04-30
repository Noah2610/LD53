import { Component } from "../components";

export interface Entity {
    id: string;
    components: Component[];
}

export function setupPlayer() {
    // TODO
    const el = document.querySelector<HTMLElement>(".player.entity")!;

    if (!el) {
        throw new Error("Expected .player element");
    }

    const player: Entity = {
        id: "player",
        components: [
            { name: "player", speed: 2 },
            { name: "sprite", el },
            { name: "position", x: 0, y: 0 },
        ],
    };

    STATE.entities.push(player);
}
