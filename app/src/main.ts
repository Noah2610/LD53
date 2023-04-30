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

const SERVER_URL = "0.0.0.0:8090";

const STATE: State = {
    entities: [],
    actions: new Map(),
};

let WS: WebSocket | null = null;

// @ts-ignore
window.STATE = STATE;

async function main() {
    setupPlayer();
    setupControls();
    setupSystems();

    await setupSocket();
    sendMessage({ type: "ping" });
}

function addNotification(
    type: "error" | "warning" | "success" | "info",
    message: string,
    { timeoutMs }: { timeoutMs?: number } = {},
) {
    const notifsEl = document.querySelector(".notifications");
    if (!notifsEl) {
        throw new Error("Expected .notifications element");
    }

    const notifEl = document.createElement("div");
    notifEl.classList.add("notification", type);
    notifEl.innerText = message;

    const closeEl = document.createElement("button");
    closeEl.classList.add("notification-close");
    closeEl.innerText = "x";
    closeEl.addEventListener("click", () => notifEl.remove());

    notifEl.appendChild(closeEl);
    notifsEl.appendChild(notifEl);

    if (timeoutMs) {
        setTimeout(() => notifEl.remove(), timeoutMs);
    }
}

function setupSocket(): Promise<WebSocket> {
    return new Promise((resolve) => {
        const ws = new WebSocket(`ws://${SERVER_URL}`);
        WS = ws;

        ws.addEventListener("open", (e) => {
            console.log("Connected to server");
            addNotification("success", "Connected to server", {
                timeoutMs: 2000,
            });

            resolve(ws);
        });

        ws.addEventListener("error", (e) => {
            console.error("Error connecting to server");
            addNotification("error", "Error connecting to server");
            ws.close();
        });

        ws.addEventListener("close", (e) => {
            console.log(`Disconnected from server: ${e.code} ${e.reason}`);
            addNotification(
                "warning",
                `Disconnected from server: ${e.code} ${e.reason}`,
            );
            ws.close();
        });

        ws.addEventListener("message", (event) => {
            try {
                const json = JSON.parse(event.data);
                onServerMessage(json);
            } catch (err) {
                console.error("Error parsing server message", err);
                addNotification(
                    "error",
                    `Error parsing server message: ${event.data}`,
                );
            }
        });
    });
}

function onServerMessage(message: Message) {
    switch (message.type) {
        case "pong": {
            console.log("Received pong from server");
            addNotification("success", "Received pong from server", {
                timeoutMs: 2000,
            });
            break;
        }
    }
}

// TODO
type Message = any;

function sendMessage(message: Message) {
    if (!WS) {
        throw new Error("No websocket connection");
    }

    WS.send(JSON.stringify(message));
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
