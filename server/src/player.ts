import { Vector } from "ld53-lib/types";

export class Player {
    public position: Vector;
    public velocity: Vector;
    public name: string;

    private id: string;

    constructor({
        id,
        position,
        velocity,
        name,
    }: {
        id: string;
        position?: Vector;
        velocity?: Vector;
        name?: string;
    }) {
        this.id = id;
        this.name = name || genName();
        this.position = position || { x: 0, y: 0 };
        this.velocity = velocity || { x: 0, y: 0 };
    }

    public setPosition({ x, y }: Vector, velocity?: Vector) {
        this.position.x = x;
        this.position.y = y;

        if (velocity) {
            this.setVelocity(velocity);
        }
    }

    public setVelocity({ x, y }: Vector) {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    public setName(name: string) {
        this.name = name;
    }
}

function genName() {
    const ADJECTIVES = [
        "Long Leg",
        "Short Leg",
        "Hairy",
        "Smelly",
        "Nerdy",
        "Tired",
        "Excited",
        "Engaged",
        "Hardcore",
        "Softcore",
    ];
    const NAMES = [
        "Larry",
        "Gamer",
        "Rizzler",
        "Bad Boy",
        "Dude",
        "Bro",
        "Guy",
        "Girl",
        "Person",
        "Human",
    ];
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    return `${pick(ADJECTIVES)} ${pick(NAMES)}`;
}
