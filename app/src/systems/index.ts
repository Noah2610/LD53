import { ComponentName, ComponentOfName, Position } from "../components";
import { Entity } from "../entities";
import { STATE } from "../state";

export function setupSystems() {
    function updateElementPositions() {
        function setElementPosition(el: HTMLElement, pos: Position) {
            el.style.left = `${pos.x}px`;
            el.style.top = `${pos.y}px`;
        }

        for (const entity of STATE.entities) {
            const sprite = findEntityComponent(entity, "sprite");
            const position = findEntityComponent(entity, "position");

            if (sprite && position) {
                setElementPosition(sprite.el, position);
            }
        }
    }

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
            const player = findEntityComponent(entity, "player");
            const position = findEntityComponent(entity, "position");

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

// TODO: Refactor to method of Entity
function findEntityComponent<N extends ComponentName>(
    entity: Entity,
    name: N,
): ComponentOfName<N> | null {
    return (
        (entity.components.find(
            (c) => c.name === name,
        ) as ComponentOfName<N> | null) ?? null
    );
}
