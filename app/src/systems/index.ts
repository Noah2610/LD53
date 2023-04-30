import { Position } from "../components";
import { STATE } from "../state";

export interface System {
    update?(): void;
}

class UpdateElementPositions implements System {
    public update() {
        for (const entity of STATE.entities) {
            const sprite = entity.getComponent("sprite");
            const position = entity.getComponent("position");

            if (sprite && position) {
                this.setElementPosition(sprite.el, position);
            }
        }
    }

    private setElementPosition(el: HTMLElement, pos: Position) {
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
    }
}

export function setupSystems() {
    function updateActions() {
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

    function handleControls() {
        for (const entity of STATE.entities) {
            const player = entity.getComponent("player");
            const position = entity.getComponent("position");

            if (!player || !position) {
                continue;
            }

            const STEP = player.speed;

            const up = STATE.actions.get("up");
            const down = STATE.actions.get("down");
            const left = STATE.actions.get("left");
            const right = STATE.actions.get("right");

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
        }
    }

    const SYSTEMS = [handleControls, updateElementPositions, updateActions];

    setInterval(() => SYSTEMS.forEach((sys) => sys()), 1);
}
