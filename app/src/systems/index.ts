import { createTimer } from "timesub";
import { FpsCounter } from "../components/fpsCounter";
import { FPS } from "../config";
import { HandleAnimationContainers } from "./handleAnimationContainers";
import { HandleAnimations } from "./handleAnimations";
import { HandleControls } from "./handleControls";
import { HandleDecreaseVelocity } from "./handleDecreaseVelocity";
import { HandleDestroy } from "./handleDestroy";
import { HandleFacing } from "./handleFacing";
import { HandleFollow } from "./handleFollow";
import { HandleMaxVelocity } from "./handleMaxVelocity";
import { HandleParentDestroy } from "./handleParentDestroy";
import { HandleVelocity } from "./handleVelocity";
import { SyncPlayerPosition } from "./syncPlayerPosition";
import { UpdateActions } from "./updateActions";
import { UpdateElementPositions } from "./updateElementPositions";

const MS_PER_UPDATE = 1000 / FPS;

const SYSTEMS: System[] = [
    new HandleControls(),

    new HandleMaxVelocity(),
    new HandleVelocity(),
    new HandleDecreaseVelocity(),

    new HandleAnimationContainers(),
    new HandleAnimations(),

    new HandleFollow(),

    new SyncPlayerPosition(),

    new HandleFacing(),
    new UpdateElementPositions(),
    new UpdateActions(),
    new HandleParentDestroy(),
    new HandleDestroy(),

    new FpsCounter(),
];

export interface System {
    update?(): void;
}

export function setupSystems() {
    // TODO
    setInterval(update, MS_PER_UPDATE);
    // const timer = createTimer({
    //     duration: "infinite",
    //     updateInterval: MS_PER_UPDATE,
    // });
    // timer.on("update", update);
    // timer.play();
}

function update() {
    SYSTEMS.forEach((sys) => sys.update && sys.update());
}
