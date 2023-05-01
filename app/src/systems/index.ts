import { FPS } from "../config";
import { HandleControls } from "./handleControls";
import { HandleParentDestroy } from "./handleParentDestroy";
import { UpdateActions } from "./updateActions";
import { UpdateElementPositions } from "./updateElementPositions";

const MS_PER_UPDATE = FPS / 60;

const SYSTEMS: System[] = [
    new HandleControls(),
    new UpdateElementPositions(),
    new UpdateActions(),
    new HandleParentDestroy(),
];

export interface System {
    update?(): void;
}

export function setupSystems() {
    // TODO
    setInterval(update, MS_PER_UPDATE);
}

function update() {
    SYSTEMS.forEach((sys) => sys.update && sys.update());
}
