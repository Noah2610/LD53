import { BaseComponent } from "./_baseComponent";

export class Player implements BaseComponent {
    public readonly name = "player";
    public isYou: boolean;
    public id: string;
    public playerName: string;
    public speed: number;
    public attackDelayMs: number;

    public isAttacking: boolean;

    constructor({
        isYou,
        id,
        playerName,
        speed,
        attackDelayMs,
    }: {
        isYou: boolean;
        id: string;
        playerName: string;
        speed: number;
        attackDelayMs: number;
    }) {
        this.isYou = isYou;
        this.id = id;
        this.playerName = playerName;
        this.speed = speed;
        this.attackDelayMs = attackDelayMs;

        this.isAttacking = false;
    }
}
