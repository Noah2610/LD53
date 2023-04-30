import "./style.css";

interface State {
    entities: Entity[];
    actions: Map<ActionName, "down" | "press" | "up">;
}

interface Entity {
    id: string;
    components: Component[];
}

interface BaseComponent {
    name: string;
}

type Component = BaseComponent & (Position | Sprite | Player);

type ComponentName = Component["name"];

type ComponentOfName<N extends ComponentName> = Component & { name: N };

interface Position {
    name: "position";
    x: number;
    y: number;
}

interface Sprite {
    name: "sprite";
    el: HTMLElement;
}

interface Player {
    name: "player";
    speed: number;
}

const CONTROLS = {
    up: ["w", "arrowup"],
    down: ["s", "arrowdown"],
    left: ["a", "arrowleft"],
    right: ["d", "arrowright"],
};

type ActionName = keyof typeof CONTROLS;

const STATE: State = {
    entities: [],
    actions: new Map(),
};

// @ts-ignore
window.STATE = STATE;

function main() {
    setupPlayer();
    setupControls();

    setupSystems();
}

function setupPlayer() {
    const el = document.querySelector<HTMLElement>(".player.entity")!;

    if (!el) {
        throw new Error("Expected .player element");
    }

    const player: Entity = {
        id: "player",
        components: [
            { name: "player", speed: 2 },
            { name: "sprite", el },
            { name: "position", x: 0, y: 0 },
        ],
    };

    STATE.entities.push(player);
}

function setupControls() {
    function onKeyDown(key: string) {
        for (const a in CONTROLS) {
            const action = a as ActionName;
            const keys = CONTROLS[action];
            if (keys.includes(key)) {
                STATE.actions.set(action, "down");
            }
        }
    }

    function onKeyUp(key: string) {
        for (const a in CONTROLS) {
            const action = a as ActionName;
            const keys = CONTROLS[action];
            if (keys.includes(key)) {
                STATE.actions.set(action, "up");
            }
        }
    }

    document.addEventListener("keydown", (e) => {
        onKeyDown(e.key.toLowerCase());
    });
    document.addEventListener("keyup", (e) => {
        onKeyUp(e.key.toLowerCase());
    });
}

function moveEntity(id: string, { x, y }: { x?: number; y?: number }) {
    const entity = findEntity(id);
    if (!entity) {
        throw new Error(`Entity not found: "${id}"`);
    }

    const position = findEntityComponent(entity, "position");
    if (!position) {
        return;
    }

    if (x !== undefined) {
        position.x += x;
    }
    if (y !== undefined) {
        position.y += y;
    }
}

function findEntity(id: string): Entity | null {
    return STATE.entities.find((e) => e.id === id) ?? null;
}

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

function setupSystems() {
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

window.onload = main;
