import { PlayerInfo } from "ld53-lib/types";

export class Player {
    public position: { x: number; y: number };

    constructor(info: PlayerInfo) {
        this.position = info.position;
    }
}
