import { System } from "../systems";

export class FpsCounter implements System {
    private lastUpdate: Date;
    private fpsEl: HTMLElement;

    constructor() {
        this.lastUpdate = new Date();
        this.fpsEl = document.querySelector(".fps")!;

        if (!this.fpsEl) {
            throw new Error("[FpsCounter] Expected .fps element");
        }
    }

    public update() {
        const now = new Date();

        const fps = 1000 / (now.getTime() - this.lastUpdate.getTime());
        this.fpsEl.innerText = fps.toString().padStart(2, "0");

        this.lastUpdate = now;
    }
}
