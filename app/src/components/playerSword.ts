import { EntityId } from "../entities";
import { BaseComponent } from "./_baseComponent";

export class PlayerSword implements BaseComponent {
    public readonly name: "playerSword" = "playerSword";
    public playerId: EntityId;

    constructor(playerId: EntityId) {
        this.playerId = playerId;
    }
}
