import { System } from ".";
import { doPlayerAttack } from "../entities/player";
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

            if (attack === "down") {
                doPlayerAttack(player.id);
            }

            if (anyMove) {
                STATE.conn?.sendAuthed({
                    type: "playerPosition",
                    payload: {
                        position: {
                            x: position.x,
                            y: position.y,
                        },
                    },
                });
            }
        }
    }
}
