import { Vector } from "ld53-lib/types";
import { EntityId } from "../entities";
import { BaseComponent } from "./_baseComponent";

export class Follow implements BaseComponent {
    public readonly name = "follow";

    public entityId: EntityId;
    public offset: Vector | null;

    constructor(entityId: EntityId, { offset }: { offset?: Vector } = {}) {
        this.entityId = entityId;
        this.offset = offset || null;
    }
}
