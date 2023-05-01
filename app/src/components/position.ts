import { BaseComponent } from "./_baseComponent";

export class Position implements BaseComponent {
    public readonly name = "position";
    public x: number;
    public y: number;

    constructor({ x, y }: { x: number; y: number }) {
        this.x = x;
        this.y = y;
    }
}
