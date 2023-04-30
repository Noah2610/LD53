export class Player {
    public position: { x: number; y: number };

    private id: string;

    constructor(id: string) {
        this.id = id;
        this.position = { x: 0, y: 0 };
    }

    public setPosition(position: { x: number; y: number }) {
        this.position.x = position.x;
        this.position.y = position.y;
    }
}
