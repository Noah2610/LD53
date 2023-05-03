import { BaseComponent } from "./_baseComponent";

export class Player implements BaseComponent {
    public readonly name = "player";
    public isYou: boolean;
    public id: string;
    public playerName: string;
    public speed: number;
    public acceleration: number;
    public attackDelayMs: number;

    public isAttacking: boolean;

    constructor({
        isYou,
        id,
        playerName,
        speed,
        acceleration,
        attackDelayMs,
    }: {
        isYou: boolean;
        id: string;
        playerName: string;
        speed: number;
        acceleration: number;
        attackDelayMs: number;
    }) {
        this.isYou = isYou;
        this.id = id;
        this.playerName = playerName;
        this.speed = speed;
        this.acceleration = acceleration;
        this.attackDelayMs = attackDelayMs;

        this.isAttacking = false;
    }
}
