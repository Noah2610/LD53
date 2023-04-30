export interface BaseComponent {
    name: string;
}

export type Component = BaseComponent & (Position | Sprite | Player);
export type ComponentName = Component["name"];
export type ComponentOfName<N extends ComponentName> = Component & { name: N };

export interface Position {
    name: "position";
    x: number;
    y: number;
}

export interface Sprite {
    name: "sprite";
    el: HTMLElement;
}

export interface Player {
    name: "player";
    speed: number;
}
