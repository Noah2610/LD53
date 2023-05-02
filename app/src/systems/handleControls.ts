import { System } from ".";
import { STATE } from "../state";

export class HandleControls implements System {
    public update() {
        for (const { player, position } of STATE.query({
            with: ["player", "position"],
        })) {
            if (!player.isYou) {
                continue;
            }

            const STEP = player.speed;

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

            const pos = { x: position.x, y: position.y };

            if (up) {
                pos.y -= STEP;
            }
            if (down) {
                pos.y += STEP;
            }
            if (left) {
                pos.x -= STEP;
            }
            if (right) {
                pos.x += STEP;
            }

            const controller = STATE.getPlayer(player.id);
            if (!controller) {
                return;
            }

            controller.setPosition(pos);

            if (attack === "down") {
                controller.attack();
            }
        }
    }
}
