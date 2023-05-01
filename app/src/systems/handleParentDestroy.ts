import { System } from ".";
import { STATE } from "../state";

export class HandleParentDestroy implements System {
    public update() {
        for (const { entity, parent } of STATE.query({
            with: ["parent"],
            maybe: ["playerLabel"],
        })) {
            const parentEntity = STATE.getEntity(parent.parentId);
            if (parentEntity && parentEntity.isAlive) {
                continue;
            }

            entity.destroy();
        }
    }
}
