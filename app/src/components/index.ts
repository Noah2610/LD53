import { PlayerLabel } from "./playerLabel";
import { BaseComponent } from "./_baseComponent";
import {
    Animation,
    Element,
    Parent,
    Player,
    PlayerSword,
    Position,
    Sprite,
} from "./_components";

export type Component = BaseComponent &
    (
        | Animation
        | Element
        | Parent
        | Player
        | PlayerLabel
        | PlayerSword
        | Position
        | Sprite
    );
export type ComponentName = Component["name"];
export type ComponentOfName<N extends ComponentName> = Component & { name: N };

export * from "./_components";
