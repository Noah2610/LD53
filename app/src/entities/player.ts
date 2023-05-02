import { Vector } from "ld53-lib/types";
import { Entity } from ".";
import {
    Element,
    Parent,
    Player,
    PlayerLabel,
    PlayerSword,
    Position,
    Sprite,
} from "../components";
import { PLAYER_CONFIG } from "../config";
import { STATE } from "../state";
import { PlayerController } from "../state/playerController";

const getEntityIdFrom = (id: string) => `player-${id}`;
const getPlayerFrom = (id: string) => STATE.getEntity(getEntityIdFrom(id));

export function createPlayerEntity({
    clientId,
    playerName,
    isYou,
    position,
}: {
    clientId: string;
    playerName: string;
    isYou: boolean;
    position: Vector;
}): Entity {
    if (isYou) {
        PlayerController.setNameInput(playerName);
    }

    const scale = 2;
    const size = { x: 11, y: 32 };
    const swordSize = { x: 7, y: 28 };

    for (const s of [size, swordSize]) {
        s.x *= scale;
        s.y *= scale;
    }

    const player = STATE.createEntity(getEntityIdFrom(clientId)).add(
        new Player({
            isYou,
            id: clientId,
            playerName,
            ...PLAYER_CONFIG,
        }),
        new Sprite({
            src: "/sprites/player.png",
            size: size,
            classNames: ["player"],
            // label: playerName,
        }),
        new Position({ ...position }),
    );

    STATE.createEntity(`player-sword-${clientId}`).add(
        new PlayerSword(clientId),
        new Sprite({
            src: "/sprites/sword.png",
            size: { ...swordSize },
            classNames: ["player-sword"],
        }),
        new Position({ x: size.x, y: size.y / 2 - swordSize.y / 2 - 8 }),
        new Parent(player.id),
    );

    const labelEl = document.createElement("div");
    labelEl.classList.add("entity-label");
    labelEl.innerText = playerName;

    STATE.createEntity(`player-label-${clientId}`).add(
        new Element(labelEl),
        new Position({ x: size.x / 2, y: size.y + 12 }),
        new Parent(player.id),
        new PlayerLabel({ playerId: clientId, isYou }),
    );

    return player;
}
