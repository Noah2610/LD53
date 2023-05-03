import { Vector } from "ld53-lib/types";
import { BaseComponent } from "./_baseComponent";

export class MaxVelocity implements BaseComponent {
    public readonly name = "maxVelocity";

    public x: number | null;
    public y: number | null;

    constructor({ x, y }: Vector<number | null>) {
        this.x = x;
        this.y = y;
    }
}
