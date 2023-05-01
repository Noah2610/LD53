import { BaseComponent } from "./_baseComponent";
import { Player, Position, Sprite } from "./_components";

export type Component = BaseComponent & (Player | Position | Sprite);
export type ComponentName = Component["name"];
export type ComponentOfName<N extends ComponentName> = Component & { name: N };

export * from "./_components";
