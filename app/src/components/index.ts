import { PlayerLabel } from "./playerLabel";
import { BaseComponent } from "./_baseComponent";
import {
    Element,
    Parent,
    Player,
    PlayerSword,
    Position,
    Sprite,
} from "./_components";

export type Component = BaseComponent &
    (Player | Position | Sprite | Parent | Element | PlayerLabel | PlayerSword);
export type ComponentName = Component["name"];
export type ComponentOfName<N extends ComponentName> = Component & { name: N };

export * from "./_components";
