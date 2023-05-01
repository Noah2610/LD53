export class Player {
    public readonly name: "player";
    public isYou: boolean;
    public id: string;
    public playerName: string;
    public speed: number;

    constructor({
        isYou,
        id,
        playerName,
        speed,
    }: {
        isYou: boolean;
        id: string;
        playerName: string;
        speed: number;
    }) {
        this.name = "player";
        this.isYou = isYou;
        this.id = id;
        this.playerName = playerName;
        this.speed = speed;
    }
}
