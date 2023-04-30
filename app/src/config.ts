export const CONTROLS = {
    up: ["w", "arrowup"],
    down: ["s", "arrowdown"],
    left: ["a", "arrowleft"],
    right: ["d", "arrowright"],
};

export type ActionName = keyof typeof CONTROLS;

// TODO: .env
export const SERVER_URL = "0.0.0.0:8090";
