import { createTimer, Timer } from "timesub";
import { System } from ".";
import { Animation, Sprite } from "../components";
import { EntityId } from "../entities";
import { STATE } from "../state";

const TIMER_UPDATE_INTERVAL = 10;

export class HandleAnimations implements System {
    private timers: Map<EntityId, Timer>;
    private playingAnimations: Map<EntityId, string>;

    constructor() {
        this.timers = new Map();
        this.playingAnimations = new Map();
    }

    public update() {
        for (const { entity, sprite, animation } of STATE.query({
            with: ["sprite", "animation"],
        })) {
            if (!entity.isAlive) {
                this.removeTimerFor(entity.id);
                continue;
            }

            if (this.playingAnimations.get(entity.id) !== animation.name) {
                this.removeTimerFor(entity.id);
            }

            this.playingAnimations.set(entity.id, animation.name);

            const timer = this.getOrStartTimerFor(entity.id, animation);
            if (timer.isFinished) {
                this.nextFrame({ sprite, animation, timer });
            }
        }
    }

    private getOrStartTimerFor(entityId: EntityId, animation: Animation) {
        if (!this.timers.has(entityId)) {
            const timer = createTimer({
                duration: animation.getCurrentFrame()[1],
                updateInterval: TIMER_UPDATE_INTERVAL,
            });
            timer.play();
            this.timers.set(entityId, timer);
        }
        return this.timers.get(entityId)!;
    }

    private getTimerFor(entityId: EntityId): Timer | null {
        return this.timers.get(entityId) ?? null;
    }

    private removeTimerFor(entityId: EntityId) {
        const timer = this.getTimerFor(entityId);
        if (!timer) {
            return;
        }

        timer.reset();
        this.timers.delete(entityId);
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
