import { Vector } from "ld53-lib/types";
import { BaseComponent } from "./_baseComponent";

export class Velocity implements BaseComponent {
    public readonly name = "velocity";

    public x: number;
    public y: number;

    constructor({ x, y }: Vector) {
        this.x = x;
        this.y = y;
    }

    public set({ x, y }: { x?: number; y?: number }) {
        if (x !== undefined) {
            this.x = x;
        }
        if (y !== undefined) {
            this.y = y;
        }
    }

    public add({ x, y }: { x?: number; y?: number }) {
        if (x !== undefined) {
            this.x += x;
        }
        if (y !== undefined) {
            this.y += y;
        }
    }
}
