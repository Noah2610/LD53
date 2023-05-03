import { System } from ".";
import { STATE } from "../state";

export class HandleDecreaseVelocity implements System {
    public update() {
        for (const { velocity, decreaseVelocity } of STATE.query({
            with: ["velocity", "decreaseVelocity"],
        })) {
            for (const axis of ["x", "y"] as const) {
                const decr = decreaseVelocity[axis];
                if (decr === null) {
                    continue;
                }

                const abs = Math.abs(velocity[axis]);

                if (abs > 0) {
                    const sign = Math.sign(velocity[axis]);
                    velocity[axis] = Math.max(abs - decr, 0) * sign;
                }
            }
        }
    }
}
