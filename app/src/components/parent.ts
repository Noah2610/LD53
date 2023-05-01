import { EntityId } from "../entities";
import { BaseComponent } from "./_baseComponent";

export class Parent implements BaseComponent {
    public readonly name = "parent";
    public parentId: EntityId;

    constructor(parentId: EntityId) {
        this.parentId = parentId;
    }
}
