import { Vector } from "ld53-lib/types";
import { STATE } from ".";
import { createPlayerEntity } from "../entities/player";

export class PlayerController {
    public clientId: string;
    public entityId: string;

    private isYou: boolean;

    constructor({
        clientId,
        playerName,
        isYou,
        position,
    }: {
        clientId: string;
        playerName: string;
        isYou: boolean;
        position: Vector;
    }) {
        this.clientId = clientId;
        this.isYou = isYou;

        const entity = createPlayerEntity({
            clientId,
            playerName,
            isYou,
            position,
        });

        this.entityId = entity.id;
    }

    public getEntity() {
        const entity = STATE.getEntity(this.entityId);
        if (!entity || !entity.isAlive) {
            return null;
        }
        return entity;
    }

    public static setNameInput(name: string) {
        const input = document.querySelector<HTMLInputElement>(
            "input.player-name-input",
        );
        if (input) {
            input.value = name;
        }
    }

    public setName(name: string) {
        for (const { playerLabel, element } of STATE.query({
            with: ["playerLabel", "element"],
        })) {
            if (playerLabel.playerId !== this.clientId) {
                continue;
            }

            element.element.innerText = name;
            // sprite.setLabel(name);

            if (playerLabel.isYou) {
                PlayerController.setNameInput(name);
            }
        }
    }

    public setPosition(pos: { x: number; y: number }) {
        const entity = this.getEntity();
        const position = entity?.get("position");

        if (!entity || !position) {
            return;
        }

        const changed = position.x !== pos.x || position.y !== pos.y;
        if (!changed) {
            return;
        }

        position.x = pos.x;
        position.y = pos.y;

        if (this.isYou) {
            STATE.conn?.sendAuthed({
                type: "playerPosition",
                payload: {
                    position: {
                        x: position.x,
                        y: position.y,
                    },
                },
            });
        }
    }

    public attack() {
        const entity = this.getEntity();
        const player = entity?.get("player");
        const sword = STATE.getEntity(`player-sword-${this.clientId}`);
        const swordSprite = sword?.get("sprite");

        if (
            !swordSprite ||
            !sword ||
            !entity ||
            !player ||
            player.isAttacking
        ) {
            return;
        }

        let animationEndTimeout: number | null = null;

        const stopAttacking = () => {
            player.isAttacking = false;

            if (animationEndTimeout !== null) {
                clearTimeout(animationEndTimeout);
                animationEndTimeout = null;
            }

            swordSprite.el.classList.remove("player-sword-attacking");
            swordSprite.el.removeEventListener("animationend", stopAttacking);
        };

        const startAttacking = () => {
            player.isAttacking = true;

            swordSprite.el.classList.add("player-sword-attacking");
            swordSprite.el.addEventListener("animationend", stopAttacking);

            animationEndTimeout = setTimeout(
                stopAttacking,
                player.attackDelayMs,
            );

            if (this.isYou) {
                STATE.conn?.sendAuthed({ type: "playerAttack" });
            }
        };

        startAttacking();
    }
}
