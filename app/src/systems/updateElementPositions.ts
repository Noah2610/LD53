import { Vector } from "ld53-lib/types";
import { System } from ".";
import { Parent, Position } from "../components";
import { STATE } from "../state";

export class UpdateElementPositions implements System {
    public update() {
        for (const { position, sprite, parent } of STATE.query({
            with: ["position", "sprite"],
            maybe: ["parent"],
        })) {
            this.handlePosition({ position, el: sprite.el, parent });
        }

        for (const { position, element, parent } of STATE.query({
            with: ["position", "element"],
            maybe: ["parent"],
        })) {
            this.handlePosition({ position, el: element.element, parent });
        }
    }

    private handlePosition({
        position,
        el,
        parent,
    }: {
        position: Position;
        el: HTMLElement;
        parent?: Parent;
    }) {
        const pos = { x: position.x, y: position.y };

        if (parent) {
            const parentPos = STATE.getComponentOf(parent.parentId, "position");
            if (parentPos) {
                pos.x += parentPos.x;
                pos.y += parentPos.y;
            }
        }

        this.setElementPosition(el, pos);
    }

    private setElementPosition(el: HTMLElement, pos: Vector) {
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
    }
}
