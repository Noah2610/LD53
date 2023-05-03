import { Vector } from "ld53-lib/types";
import { BaseComponent } from "./_baseComponent";

export class DecreaseVelocity implements BaseComponent {
    public readonly name = "decreaseVelocity";

    public x: number | null;
    public y: number | null;

    constructor({ x, y }: Vector<number | null>) {
        this.x = x;
        this.y = y;
    }
}
