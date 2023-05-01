import { Entity } from ".";
import { Player, Position, Sprite } from "../components";
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
    position: { x: number; y: number };
}): Entity {
    if (isYou) {
        setPlayerNameInput(playerName);
    }

    return STATE.createEntity(`player-${id}`).add(
        new Player({ isYou, id, playerName, speed: 2 }),
        new Sprite({
            src: "/sprites/larry.png",
            size: { x: 32, y: 64 },
            label: playerName,
        }),
        new Position({ x: position.x, y: position.y }),
    );
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
    for (const { player, sprite } of STATE.query({
        with: ["player", "sprite"],
    })) {
        if (player.id !== playerId) {
            continue;
        }

        player.playerName = name;
        sprite.setLabel(name);

        if (player.isYou) {
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
