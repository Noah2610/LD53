export class Player {
    public position: { x: number; y: number };
    public name: string;

    private id: string;

    constructor({
        id,
        position,
        name,
    }: {
        id: string;
        position?: { x: number; y: number };
        name?: string;
    }) {
        this.id = id;
        this.name = name || genName();
        this.position = position || { x: 0, y: 0 };
    }

    public setPosition(position: { x: number; y: number }) {
        this.position.x = position.x;
        this.position.y = position.y;
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
