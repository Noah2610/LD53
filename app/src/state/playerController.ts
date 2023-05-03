import { ClientMessagePlayerPosition, Vector } from "ld53-lib/types";
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

    public setPosition(pos: Vector, vel?: Vector) {
        const entity = this.getEntity();
        const position = entity?.get("position");
        const velocity = entity?.get("velocity");

        if (!entity || !position) {
            return;
        }

        const changed = position.x !== pos.x || position.y !== pos.y;
        if (!changed) {
            return;
        }

        position.set(pos);

        if (vel && velocity) {
            velocity.set(vel);
        }

        // if (this.isYou) {
        //     STATE.conn?.sendAuthed({
        //         type: "playerPosition",
        //         payload: {
        //             position: {
        //                 x: position.x,
        //                 y: position.y,
        //             },
        //         },
        //     });
        // }
    }

    public setVelocity(vel: Vector) {
        const entity = this.getEntity();
        const velocity = entity?.get("velocity");

        if (!entity || !velocity) {
            return;
        }

        const changed = velocity.x !== vel.x || velocity.y !== vel.y;
        if (!changed) {
            return;
        }

        velocity.set(vel);

        if (this.isYou) {
            this.syncVelocity(vel);
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

    public syncPosition(position: Vector, velocity?: Vector) {
        if (!this.isYou || !STATE.conn) {
            return;
        }

        const payload: ClientMessagePlayerPosition["payload"] = {
            position: {
                x: position.x,
                y: position.y,
            },
        };

        if (velocity) {
            payload.velocity = {
                x: velocity.x,
                y: velocity.y,
            };
        }

        STATE.conn.sendAuthed({
            type: "playerPosition",
            payload,
        });
    }

    public syncVelocity(velocity: Vector) {
        if (!this.isYou || !STATE.conn) {
            return;
        }

        STATE.conn.sendAuthed({
            type: "playerVelocity",
            payload: {
                velocity: {
                    x: velocity.x,
                    y: velocity.y,
                },
            },
        });
    }
}
