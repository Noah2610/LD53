import { createTimer, Timer } from "timesub";
import { System } from ".";
import { Animation, AnimationContainer, Sprite } from "../components";
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
        const visitedEntities = new Set<EntityId>();

        for (const {
            entity,
            sprite,
            animation,
            animationContainer,
        } of STATE.query({
            with: ["sprite", "animation"],
            maybe: ["animationContainer"],
        })) {
            if (!entity.isAlive) {
                continue;
            }

            visitedEntities.add(entity.id);

            if (this.playingAnimations.get(entity.id) !== animation.name) {
                this.removeTimerFor(entity.id);
            }

            this.playingAnimations.set(entity.id, animation.name);
            const timer = this.getOrStartTimerFor(entity.id, animation);

            if (timer.isFinished) {
                this.nextFrame({
                    sprite,
                    animation,
                    animationContainer,
                    timer,
                });
            }
        }

        for (const entityId of this.playingAnimations.keys()) {
            if (visitedEntities.has(entityId)) {
                continue;
            }

            this.removeTimerFor(entityId);
            this.playingAnimations.delete(entityId);
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
        animationContainer,
        timer,
    }: {
        sprite: Sprite;
        animation: Animation;
        animationContainer?: AnimationContainer;
        timer: Timer;
    }) {
        const frame = animation.nextFrame();
        sprite.setSpriteIndex(frame[0]);
        timer.setDuration(frame[1]);
        timer.reset();
        timer.play();

        // ON ANIMATION LOOP
        if (animationContainer && animation.frameIndex === 0) {
            animationContainer.onAnimationLoop();
        }
    }
}
