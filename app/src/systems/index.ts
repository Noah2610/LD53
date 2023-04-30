import { Position } from "../components";
import { STATE } from "../state";

export interface System {
    update?(): void;
}

class UpdateElementPositions implements System {
    public update() {
        for (const { position, sprite } of STATE.query({
            with: ["position", "sprite"],
        })) {
            this.setElementPosition(sprite.el, position);
        }
    }

    private setElementPosition(el: HTMLElement, pos: Position) {
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
    }
}

class HandleControls implements System {
    public update() {
        for (const { player, position } of STATE.query({
            with: ["player", "position"],
        })) {
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

export function setupSystems() {
    const SYSTEMS: System[] = [
        new HandleControls(),
        new UpdateElementPositions(),
        new UpdateActions(),
    ];

    // TODO
    setInterval(() => SYSTEMS.forEach((sys) => sys.update && sys.update()), 1);
}
