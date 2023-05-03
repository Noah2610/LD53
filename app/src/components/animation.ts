import { BaseComponent } from "./_baseComponent";

export interface AnimationConfig {
    name: string;
    frames: AnimationFrame[];
}

/** array of [index, ms] */
export type AnimationFrame = [number, number];

export class Animation implements BaseComponent {
    public readonly name: "animation" = "animation";

    public animationName!: string;
    public frames!: AnimationFrame[];
    public frameIndex!: number;

    constructor(animation: AnimationConfig) {
        this.setAnimation(animation);
    }

    public setAnimation({ name, frames }: AnimationConfig) {
        this.animationName = name;
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
