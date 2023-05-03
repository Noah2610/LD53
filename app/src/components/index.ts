import { PlayerLabel } from "./playerLabel";
import { BaseComponent } from "./_baseComponent";
import {
    Animation,
    AnimationContainer,
    DecreaseVelocity,
    Destroyed,
    Element,
    MaxVelocity,
    Parent,
    Player,
    PlayerSword,
    Position,
    Sprite,
    Velocity,
} from "./_components";

export type Component = BaseComponent &
    (
        | Animation
        | AnimationContainer
        | DecreaseVelocity
        | Destroyed
        | Element
        | MaxVelocity
        | Parent
        | Player
        | PlayerLabel
        | PlayerSword
        | Position
        | Sprite
        | Velocity
    );
export type ComponentName = Component["name"];
export type ComponentOfName<N extends ComponentName> = Component & { name: N };

export * from "./_components";
