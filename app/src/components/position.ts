export class Position {
    public readonly name: "position";
    public x: number;
    public y: number;

    constructor({ x, y }: { x: number; y: number }) {
        this.name = "position";
        this.x = x;
        this.y = y;
    }
}
