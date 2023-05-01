import { Player, Position, Sprite } from "./_components";

interface BaseComponent {
    name: string;
}

export type Component = BaseComponent & (Player | Position | Sprite);
export type ComponentName = Component["name"];
export type ComponentOfName<N extends ComponentName> = Component & { name: N };

export * from "./_components";
