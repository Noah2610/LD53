import { BaseComponent } from "./_baseComponent";

export class PlayerLabel implements BaseComponent {
    public readonly name = "playerLabel";
    public playerId: string;
    public isYou: boolean;

    constructor({ playerId, isYou }: { playerId: string; isYou: boolean }) {
        this.playerId = playerId;
        this.isYou = isYou;
    }
}
