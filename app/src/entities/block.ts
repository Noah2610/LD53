import { Vector } from "ld53-lib/types";
import { Collidable, Element, Hitbox, Position } from "../components";
import { STATE } from "../state";

export function createBlockEntity({
    position,
    size,
}: {
    position: Vector;
    size: Vector;
}) {
    const el = document.createElement("div");
    el.classList.add("block");
    el.style.width = `${size.x}px`;
    el.style.height = `${size.y}px`;

    const entity = STATE.createEntity().add(
        new Position({ ...position }),
        new Element(el),
        new Hitbox([
            {
                x1: 0,
                y1: 0,
                x2: size.x,
                y2: size.y,
            },
        ]),
        new Collidable("block"),
    );

    return entity;
}
