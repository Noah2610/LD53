import { System } from ".";
import { STATE } from "../state";

export class HandleVelocity implements System {
    public update() {
        for (const { position, velocity } of STATE.query({
            with: ["position", "velocity"],
        })) {
            position.add(velocity);
        }
    }
}
