import { BaseComponent } from "./_baseComponent";

/** array of [index, ms] */
type AnimationFrame = [number, number];

export class Animation implements BaseComponent {
    public readonly name: "animation" = "animation";

    public frames: AnimationFrame[];
    public frameIndex: number;

    constructor({ frames }: { frames: AnimationFrame[] }) {
        this.frames = frames;
        this.frameIndex = 0;
    }

    public getCurrentFrame() {
        const frame = this.frames[this.frameIndex];
        if (!frame) {
            throw new Error(
                `[Animation.getCurrentFrame] Expected frame at index ${this.frameIndex}`,
            );
        }
        return frame;
    }

    public nextFrame(): AnimationFrame {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        return this.getCurrentFrame();
    }
}
