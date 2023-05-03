import { System } from ".";
import { STATE } from "../state";

export class HandleMaxVelocity implements System {
    public update() {
        for (const { velocity, maxVelocity } of STATE.query({
            with: ["velocity", "maxVelocity"],
        })) {
            for (const axis of ["x", "y"] as const) {
                const max = maxVelocity[axis];
                if (max === null) {
                    continue;
                }

                const sign = Math.sign(velocity[axis]);
                const abs = Math.abs(velocity[axis]);
                velocity[axis] = Math.min(abs, max) * sign;
            }
        }
    }
}
