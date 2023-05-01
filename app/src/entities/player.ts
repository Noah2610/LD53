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

const getEntityIdFrom = (id: string) => `player-${id}`;
const getPlayerFrom = (id: string) => STATE.getEntity(getEntityIdFrom(id));

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

    for (const s of [size, swordSize]) {
        s.x *= scale;
        s.y *= scale;
    }

    const player = STATE.createEntity(getEntityIdFrom(id)).add(
        new Player({
            isYou,
            id,
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

    STATE.createEntity(`player-sword-${id}`).add(
        new PlayerSword(id),
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
    const entity = getPlayerFrom(playerId);
    const player = entity?.get("player");

    if (!entity || !player) {
        return;
    }

    entity.destroy();
}

// TODO
export function setPlayerPosition(
    playerId: string,
    pos: { x: number; y: number },
) {
    const entity = getPlayerFrom(playerId);
    const position = entity?.get("position");

    if (!entity || !position) {
        return;
    }

    position.x = pos.x;
    position.y = pos.y;
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

export function doPlayerAttack(id: string) {
    const entity = getPlayerFrom(id);
    const player = entity?.get("player");
    const sword = STATE.getEntity(`player-sword-${id}`);
    const swordSprite = sword?.get("sprite");

    if (!swordSprite || !sword || !entity || !player || player.isAttacking) {
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

    player.isAttacking = true;

    swordSprite.el.classList.add("player-sword-attacking");
    swordSprite.el.addEventListener("animationend", stopAttacking);

    animationEndTimeout = setTimeout(stopAttacking, player.attackDelayMs);
}
