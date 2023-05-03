import { System } from ".";
import { STATE } from "../state";

export class HandleDestroy implements System {
    public update() {
        for (const { entity } of STATE.query({
            with: ["destroyed"],
        })) {
            STATE.deleteEntityNow(entity);
        }
    }
}
