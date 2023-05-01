import { Vector } from "ld53-lib/types";
import { Parent, Position } from "../components";
import { STATE } from "../state";

export interface System {
    update?(): void;
}

class UpdateElementPositions implements System {
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
            without: ["sprite"],
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

class HandleControls implements System {
    public update() {
        for (const { player, position } of STATE.query({
            with: ["player", "position"],
        })) {
            if (!player.isYou) {
                continue;
            }

            const STEP = player.speed;

            const up = STATE.actions.get("up");
            const down = STATE.actions.get("down");
            const left = STATE.actions.get("left");
            const right = STATE.actions.get("right");

            const anyKey = up || down || left || right;
            if (!anyKey) {
                continue;
            }

            if (up) {
                position.y -= STEP;
            }
            if (down) {
                position.y += STEP;
            }
            if (left) {
                position.x -= STEP;
            }
            if (right) {
                position.x += STEP;
            }

            STATE.conn?.sendAuthed({
                type: "playerPosition",
                payload: {
                    position: {
                        x: position.x,
                        y: position.y,
                    },
                },
            });
        }
    }
}

class UpdateActions implements System {
    public update() {
        for (const [action, state] of STATE.actions.entries()) {
            switch (state) {
                case "down": {
                    STATE.actions.set(action, "press");
                    break;
                }
                case "up": {
                    STATE.actions.delete(action);
                }
            }
        }
    }
}

class HandleParentDestroy implements System {
    public update() {
        for (const { entity, parent } of STATE.query({
            with: ["parent"],
            maybe: ["playerLabel"],
        })) {
            const parentEntity = STATE.getEntity(parent.parentId);
            if (parentEntity && parentEntity.isAlive) {
                continue;
            }

            entity.destroy();
        }
    }
}

export function setupSystems() {
    const SYSTEMS: System[] = [
        new HandleControls(),
        new UpdateElementPositions(),
        new UpdateActions(),
        new HandleParentDestroy(),
    ];

    // TODO
    setInterval(() => SYSTEMS.forEach((sys) => sys.update && sys.update()), 1);
}
