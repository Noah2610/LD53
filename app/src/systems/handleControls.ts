import { System } from ".";
import { STATE } from "../state";

export class HandleControls implements System {
    public update() {
        for (const { player, velocity } of STATE.query({
            with: ["player", "velocity"],
        })) {
            if (!player.isYou) {
                continue;
            }

            const STEP = player.acceleration;

            const up = STATE.actions.get("up");
            const down = STATE.actions.get("down");
            const left = STATE.actions.get("left");
            const right = STATE.actions.get("right");
            const attack = STATE.actions.get("attack");

            const anyMove = up || down || left || right;
            const anyKey = anyMove || attack;
            if (!anyKey) {
                continue;
            }

            if (up) {
                velocity.add({ y: -STEP });
            }
            if (down) {
                velocity.add({ y: STEP });
            }
            if (left) {
                velocity.add({ x: -STEP });
            }
            if (right) {
                velocity.add({ x: STEP });
            }

            const controller = STATE.getPlayer(player.id);
            if (!controller) {
                return;
            }

            // const prev = this.prevVelocity;
            // if (prev.x !== velocity.x || prev.y !== velocity.y) {
            // controller.syncVelocity(velocity);
            // }

            // this.prevVelocity = { x: velocity.x, y: velocity.y };

            if (attack === "down") {
                controller.attack();
            }
        }
    }
}
