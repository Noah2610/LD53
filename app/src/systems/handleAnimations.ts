import { createTimer, Timer } from "timesub";
import { System } from ".";
import { Animation, Sprite } from "../components";
import { Entity, EntityId } from "../entities";
import { STATE } from "../state";

export class HandleAnimations implements System {
    private timers: Map<EntityId, Timer>;

    constructor() {
        this.timers = new Map();
    }

    public update() {
        for (const { entity, sprite, animation } of STATE.query({
            with: ["sprite", "animation"],
        })) {
            const timer = this.getTimerFor(entity.id, animation);
            if (timer.isFinished) {
                this.nextFrame({ sprite, animation, timer });
            }
        }
    }

    private getTimerFor(entityId: EntityId, animation: Animation) {
        if (!this.timers.has(entityId)) {
            const timer = createTimer({
                duration: animation.getCurrentFrame()[1],
            });
            timer.play();
            this.timers.set(entityId, timer);
        }
        return this.timers.get(entityId)!;
    }

    private nextFrame({
        sprite,
        animation,
        timer,
    }: {
        sprite: Sprite;
        animation: Animation;
        timer: Timer;
    }) {
        const frame = animation.nextFrame();
        sprite.setSpriteIndex(frame[0]);
        timer.setDuration(frame[1]);
        timer.reset();
        timer.play();
    }
}
