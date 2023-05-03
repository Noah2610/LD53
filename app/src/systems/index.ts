import { FPS } from "../config";
import { HandleAnimationContainers } from "./handleAnimationContainers";
import { HandleAnimations } from "./handleAnimations";
import { HandleControls } from "./handleControls";
import { HandleDecreaseVelocity } from "./handleDecreaseVelocity";
import { HandleDestroy } from "./handleDestroy";
import { HandleMaxVelocity } from "./handleMaxVelocity";
import { HandleParentDestroy } from "./handleParentDestroy";
import { HandleVelocity } from "./handleVelocity";
import { SyncPlayerPosition } from "./syncPlayerPosition";
import { UpdateActions } from "./updateActions";
import { UpdateElementPositions } from "./updateElementPositions";

const MS_PER_UPDATE = FPS / 60;

const SYSTEMS: System[] = [
    new HandleControls(),

    new HandleMaxVelocity(),
    new HandleVelocity(),
    new HandleDecreaseVelocity(),

    new HandleAnimationContainers(),
    new HandleAnimations(),

    new SyncPlayerPosition(),

    new UpdateElementPositions(),
    new UpdateActions(),
    new HandleParentDestroy(),
    new HandleDestroy(),
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
