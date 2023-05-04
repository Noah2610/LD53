import { System } from ".";
import { STATE } from "../state";

export class HandleFollow implements System {
    public update() {
        for (const { follow, position } of STATE.query({
            with: ["follow", "position"],
        })) {
            const followEntity = STATE.getEntity(follow.entityId);
            const followPosition = followEntity?.get("position");
            if (!followPosition) {
                continue;
            }

            const pos = {
                x: followPosition.x + (follow.offset?.x || 0),
                y: followPosition.y + (follow.offset?.y || 0),
            };

            position.set(pos);
        }
    }
}
