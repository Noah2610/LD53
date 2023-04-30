import { Component, ComponentName, ComponentOfName } from "../components";
import { STATE } from "../state";

export class Entity {
    public id: string;
    private components: Component[];

    constructor(id: string, components: Component[]) {
        this.id = id;
        this.components = components;
    }

    public getComponent<N extends ComponentName>(
        name: N,
    ): ComponentOfName<N> | null {
        return (
            (this.components.find(
                (c) => c.name === name,
            ) as ComponentOfName<N> | null) ?? null
        );
    }
}

export function setupPlayer() {
    // TODO
    const el = document.querySelector<HTMLElement>(".player.entity")!;

    if (!el) {
        throw new Error("Expected .player element");
    }

    const player = new Entity("player", [
        { name: "player", speed: 2 },
        { name: "sprite", el },
        { name: "position", x: 0, y: 0 },
    ]);

    STATE.entities.push(player);
}
