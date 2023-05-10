import { BaseComponent } from "./_baseComponent";

export interface Rect {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class Hitbox implements BaseComponent {
    public readonly name = "hitbox";

    public hitboxes: Rect[];

    constructor(hitboxes: Rect[]) {
        this.hitboxes = hitboxes;
    }
}
