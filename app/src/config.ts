export const CONTROLS = {
    up: ["w", "arrowup"],
    down: ["s", "arrowdown"],
    left: ["a", "arrowleft"],
    right: ["d", "arrowright"],
};

export type ActionName = keyof typeof CONTROLS;

export const SERVER_URL = (import.meta as any).env.VITE_SERVER_URL;
