import { ActionName, CONTROLS } from "./config";
import { sendMessage, setupSocket } from "./connection";
import { setupPlayer } from "./entities";
import { STATE } from "./state";
import { setupSystems } from "./systems";
import "./style.css";

async function main() {
    setupPlayer();
    setupControls();
    setupSystems();

    await setupSocket();
    sendMessage({ type: "ping" });
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
