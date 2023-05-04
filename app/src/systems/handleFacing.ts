import { System } from ".";
import { Direction, Facing } from "../components";
import { Entity, EntityId } from "../entities";
import { STATE } from "../state";

export class HandleFacing implements System {
    private directions: Map<EntityId, Direction>;

    constructor() {
        this.directions = new Map();
    }

    public update() {
        for (const { entity, sprite, facing } of STATE.query({
            with: ["sprite", "facing"],
        })) {
            this.handleFacing({ entity, element: sprite.el, facing });
        }
        for (const { entity, element, facing } of STATE.query({
            with: ["element", "facing"],
        })) {
            this.handleFacing({ entity, element: element.element, facing });
        }
    }

    private handleFacing({
        entity,
        element,
        facing,
    }: {
        entity: Entity;
        element: HTMLElement;
        facing: Facing;
    }) {
        if (this.directions.get(entity.id) === facing.direction) {
            return;
        }

        element.classList.remove(
            "facing-up",
            "facing-down",
            "facing-left",
            "facing-right",
        );
        element.classList.add(`facing-${facing.direction}`);

        this.directions.set(entity.id, facing.direction);
    }
}
