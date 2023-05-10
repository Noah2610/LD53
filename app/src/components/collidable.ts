import { CollisionTag } from "./collider";
import { BaseComponent } from "./_baseComponent";

export class Collidable implements BaseComponent {
    public readonly name = "collidable";

    public tag: CollisionTag;

    constructor(tag: CollisionTag) {
        this.tag = tag;
    }
}
