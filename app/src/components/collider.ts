import { BaseComponent } from "./_baseComponent";

export type CollisionTag = string;

export class Collider implements BaseComponent {
    public readonly name = "collider";

    public tag: CollisionTag;
    public collidesWith: Set<CollisionTag>;

    constructor({
        tag,
        collidesWith,
    }: {
        tag: CollisionTag;
        collidesWith: CollisionTag[];
    }) {
        this.tag = tag;
        this.collidesWith = new Set(collidesWith);
    }
}
