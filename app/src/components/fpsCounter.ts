import { createTimer, Timer } from "timesub";
import { System } from "../systems";

export class FpsCounter implements System {
    private lastUpdate: Date;
    private fpsEl: HTMLElement;
    private timer: Timer;
    private fpsNumbers: number[];

    constructor() {
        this.lastUpdate = new Date();
        this.fpsEl = document.querySelector(".fps")!;
        this.timer = createTimer({
            duration: "infinite",
            updateInterval: 500,
        });
        this.fpsNumbers = [];

        this.timer.play();
        this.timer.on("update", this.displayAverage.bind(this));

        if (!this.fpsEl) {
            throw new Error("[FpsCounter] Expected .fps element");
        }
    }

    public update() {
        const now = new Date();

        const fps = 1000 / (now.getTime() - this.lastUpdate.getTime());
        this.fpsNumbers.push(fps);

        this.lastUpdate = now;
    }

    private displayAverage() {
        if (this.fpsNumbers.length === 0) {
            return;
        }

        const avg =
            this.fpsNumbers.reduce((a, b) => a + b, 0) / this.fpsNumbers.length;
        this.fpsEl.innerText = avg.toFixed(2).padStart(2, "0");
        this.fpsNumbers = [];
    }
}
