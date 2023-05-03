import { Vector } from "ld53-lib/types";
import { System } from ".";
import { STATE } from "../state";

export class SyncPlayerPosition implements System {
    private prevPosition: Vector;

    constructor() {
        this.prevPosition = { x: 0, y: 0 };
    }

    public update() {
        for (const { player, position, velocity } of STATE.query({
            with: ["player", "playerIsYou", "position"],
            maybe: ["velocity"],
        })) {
            const controller = STATE.getPlayer(player.id);
            if (!controller) {
                continue;
            }

            if (
                position.x === this.prevPosition.x &&
                position.y === this.prevPosition.y
            ) {
                continue;
            }

            this.prevPosition = { x: position.x, y: position.y };

            controller.syncPosition(position, velocity);
        }
    }
}
