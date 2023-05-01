import { EntityId } from "../entities";
import { BaseComponent } from "./_baseComponent";

export class Parent implements BaseComponent {
    public name: "parent";
    public parentId: EntityId;

    constructor(parentId: EntityId) {
        this.name = "parent";
        this.parentId = parentId;
    }
}
