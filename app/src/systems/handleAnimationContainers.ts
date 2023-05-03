import { System } from ".";
import { Animation } from "../components";
import { EntityId } from "../entities";
import { STATE } from "../state";

export class HandleAnimationContainers implements System {
    private playingAnimations: Map<EntityId, string>;

    constructor() {
        this.playingAnimations = new Map();
    }

    public update() {
        for (const {
            entity,
            animationContainer,
            animation: animationOpt,
        } of STATE.query({
            with: ["animationContainer"],
            maybe: ["animation"],
        })) {
            const animData = animationContainer.getCurrent();
            if (!animData) {
                entity.remove("animation");
                continue;
            }

            const playingAnim = this.playingAnimations.get(entity.id);
            if (playingAnim === animData.name) {
                continue;
            }

            let animation: Animation;

            if (!animationOpt) {
                animation = new Animation(animData);
                entity.add(animation);
                this.playingAnimations.set(entity.id, animData.name);
            } else {
                animation = animationOpt;
            }

            animation.setAnimation(animData);
            this.playingAnimations.set(entity.id, animData.name);

            // if (this.playingAnimations.has(entity.id)) {
            //     // check if finished
            //     continue;
            // }

            // this.playingAnimations.add(entity.id)
        }
    }
}
