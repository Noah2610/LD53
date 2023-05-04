import { Vector } from "ld53-lib/types";
import { System } from ".";
import { Position } from "../components";
import { STATE } from "../state";

export class UpdateElementPositions implements System {
    public update() {
        for (const { position, sprite } of STATE.query({
            with: ["position", "sprite"],
        })) {
            this.handlePosition({ position, el: sprite.el });
        }

        for (const { position, element } of STATE.query({
            with: ["position", "element"],
        })) {
            this.handlePosition({ position, el: element.element });
        }
    }

    private handlePosition({
        position,
        el,
    }: {
        position: Position;
        el: HTMLElement;
    }) {
        const pos = { x: position.x, y: position.y };
        this.setElementPosition(el, pos);
    }

    private setElementPosition(el: HTMLElement, pos: Vector) {
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
    }
}
