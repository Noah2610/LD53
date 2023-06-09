export const ACTIONS = {
    up: ["w", "arrowup"],
    down: ["s", "arrowdown"],
    left: ["a", "arrowleft"],
    right: ["d", "arrowright"],

    attack: [" "],
};

export type ActionName = keyof typeof ACTIONS;

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const FPS = 60;

export const PLAYER_CONFIG = {
    speed: 10,
    acceleration: 2.0,
    deceleration: 1.0,
    attackDelayMs: 1000,
};
