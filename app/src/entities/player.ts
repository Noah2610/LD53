import { Vector } from "ld53-lib/types";
import { Entity } from ".";
import {
    Element,
    Parent,
    Player,
    PlayerLabel,
    Position,
    Sprite,
} from "../components";
import { STATE } from "../state";

export function setupPlayer({
    id,
    playerName,
    isYou,
    position,
}: {
    id: string;
    playerName: string;
    isYou: boolean;
    position: Vector;
}): Entity {
    if (isYou) {
        setPlayerNameInput(playerName);
    }

    const scale = 2;
    const size = { x: 11, y: 32 };
    const swordSize = { x: 7, y: 28 };

    for (const key in size) {
        // @ts-ignore
        size[key] *= scale;
    }
    for (const key in swordSize) {
        // @ts-ignore
        swordSize[key] *= scale;
    }

    const player = STATE.createEntity(`player-${id}`).add(
        new Player({ isYou, id, playerName, speed: 2 }),
        new Sprite({
            src: "/sprites/player.png",
            size: size,
            // label: playerName,
        }),
        new Position({ ...position }),
    );

    STATE.createEntity(`player-sword-${id}`).add(
        new Sprite({
            src: "/sprites/sword.png",
            size: { ...swordSize },
        }),
        new Position({ x: size.x, y: size.y / 2 - swordSize.y / 2 - 8 }),
        new Parent(player.id),
    );

    const labelEl = document.createElement("div");
    labelEl.classList.add("entity-label");
    labelEl.innerText = playerName;

    STATE.createEntity(`player-label-${id}`).add(
        new Element(labelEl),
        new Position({ x: size.x / 2, y: size.y + 12 }),
        new Parent(player.id),
        new PlayerLabel({ playerId: id, isYou }),
    );

    return player;
}

// TODO
export function removePlayer(playerId: string) {
    for (const { entity, player } of STATE.query({
        with: ["player"],
    })) {
        if (player.id !== playerId) {
            continue;
        }

        entity.destroy();
    }
}

// TODO
export function setPlayerPosition(
    playerId: string,
    pos: { x: number; y: number },
) {
    for (const { player, position } of STATE.query({
        with: ["player", "position"],
    })) {
        if (player.id !== playerId) {
            continue;
        }

        position.x = pos.x;
        position.y = pos.y;
    }
}

// TODO
export function setPlayerName(playerId: string, name: string) {
    for (const { playerLabel, element } of STATE.query({
        with: ["playerLabel", "element"],
    })) {
        if (playerLabel.playerId !== playerId) {
            continue;
        }

        element.element.innerText = name;
        // sprite.setLabel(name);

        if (playerLabel.isYou) {
            setPlayerNameInput(name);
        }
    }
}

function setPlayerNameInput(name: string) {
    const input = document.querySelector<HTMLInputElement>(
        "input.player-name-input",
    );
    if (input) {
        input.value = name;
    }
}
