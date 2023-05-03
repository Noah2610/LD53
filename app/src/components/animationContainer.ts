import { AnimationConfig, AnimationFrame } from "./animation";
import { BaseComponent } from "./_baseComponent";

interface AnimationState {
    name: string;
    behavior: AnimationBehavior;
}

type AnimationBehavior = "once" | "loop";

export class AnimationContainer implements BaseComponent {
    public readonly name = "animationContainer";

    private animations: Record<string, AnimationConfig>;
    private animationStack: AnimationState[];

    constructor(animations: AnimationConfig[], defaultAnimation?: string) {
        this.animations = animations.reduce(
            (map, anim) => ({
                ...map,
                [anim.name]: anim,
            }),
            {},
        );
        this.animationStack = [];

        if (defaultAnimation) {
            this.push(defaultAnimation, "loop");
        }
    }

    public push(name: string, behavior: AnimationBehavior) {
        if (!(name in this.animations)) {
            throw new Error(
                `[AnimationContainer.pushAnimation] Expected animation with name ${name}`,
            );
        }

        const current = this.getCurrentState();
        if (current?.name === name) {
            return;
        }

        this.animationStack.push({
            name,
            behavior,
        });
    }

    public pop() {
        this.animationStack.pop();
    }

    public getCurrent(): (AnimationConfig & AnimationState) | null {
        const state = this.getCurrentState();
        if (!state) {
            return null;
        }

        const animation = this.animations[state.name]!;
        return {
            ...state,
            ...animation,
        };
    }

    public onAnimationLoop() {
        const anim = this.getCurrentState();
        if (!anim) {
            return;
        }

        if (anim.behavior === "once") {
            this.pop();
        }
    }

    private getCurrentState(): AnimationState | null {
        return this.animationStack[this.animationStack.length - 1] || null;
    }
}
