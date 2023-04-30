import { ActionName, CONTROLS } from "./config";
import { setupSocket } from "./connection";
import { setupPlayer } from "./entities";
import { STATE } from "./state";
import { setupSystems } from "./systems";
import "./style.css";

async function main() {
    setupControls();
    setupPlayerNameInput();
    setupSystems();

    // TODO:
    // this player <-> socket sync doesn't belong here...
    await setupSocket({
        onConnected: (conn) => {
            conn.send({ type: "ping" });
        },

        onAuthed: (conn) => {
            if (!conn.clientId) {
                throw new Error("Expected Conn to have clientId");
            }

            const entity = setupPlayer({
                id: conn.clientId,
                playerName: "Player", // TODO
                isYou: true,
                position: { x: 100, y: 100 },
            });

            const player = entity.get("player");
            const position = entity.get("position");

            if (!player || !position) {
                throw new Error(
                    "Expected player to have player and position components",
                );
            }

            conn.sendAuthed({
                type: "join",
                payload: {
                    position: {
                        x: position.x,
                        y: position.y,
                    },
                },
            });
        },

        onDisconnected: (conn) => {
            conn.sendAuthed({ type: "leave" });
        },
    });
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
        const target = e.target as HTMLElement;
        if (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.tagName === "BUTTON"
        ) {
            return;
        }
        onKeyDown(e.key.toLowerCase());
    });
    document.addEventListener("keyup", (e) => {
        const target = e.target as HTMLElement;
        if (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.tagName === "BUTTON"
        ) {
            return;
        }
        onKeyUp(e.key.toLowerCase());
    });
}

function setupPlayerNameInput() {
    const form = document.querySelector<HTMLFormElement>("#player-name-form");
    if (!form) {
        throw new Error("Expected to find #player-name-form element");
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!STATE.conn) {
            return;
        }

        const formData = new FormData(form);
        const name = formData.get("player-name") as string | null;
        if (!name) {
            return;
        }

        STATE.conn.setPlayerName(name);
    });
}

// function moveEntity(id: string, { x, y }: { x?: number; y?: number }) {
//     const entity = findEntity(id);
//     if (!entity) {
//         throw new Error(`Entity not found: "${id}"`);
//     }

//     const position = findEntityComponent(entity, "position");
//     if (!position) {
//         return;
//     }

//     if (x !== undefined) {
//         position.x += x;
//     }
//     if (y !== undefined) {
//         position.y += y;
//     }
// }

// function findEntity(id: string): Entity | null {
//     return STATE.entities.find((e) => e.id === id) ?? null;
// }

window.onload = main;
