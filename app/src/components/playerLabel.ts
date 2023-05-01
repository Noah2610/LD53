import { BaseComponent } from "./_baseComponent";

export class PlayerLabel implements BaseComponent {
    public name: "playerLabel";
    public playerId: string;
    public isYou: boolean;

    constructor({ playerId, isYou }: { playerId: string; isYou: boolean }) {
        this.name = "playerLabel";
        this.playerId = playerId;
        this.isYou = isYou;
    }
}
