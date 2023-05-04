import { BaseComponent } from "./_baseComponent";

export type Direction = "up" | "down" | "left" | "right";

export class Facing implements BaseComponent {
    public readonly name = "facing";

    public direction: Direction;

    constructor(direction: Direction) {
        this.direction = direction;
    }
}
