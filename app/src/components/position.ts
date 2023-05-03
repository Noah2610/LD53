import { Vector } from "ld53-lib/types";
import { BaseComponent } from "./_baseComponent";

export class Position implements BaseComponent {
    public readonly name = "position";
    public x: number;
    public y: number;

    constructor({ x, y }: Vector) {
        this.x = x;
        this.y = y;
    }

    public set({ x, y }: Vector) {
        this.x = x;
        this.y = y;
    }

    public add({ x, y }: Vector) {
        this.x += x;
        this.y += y;
    }
}
