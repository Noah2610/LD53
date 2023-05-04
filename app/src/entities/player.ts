import { Vector } from "ld53-lib/types";
import { Entity } from ".";
import {
    Animation,
    AnimationContainer,
    DecreaseVelocity,
    Element,
    Facing,
    MaxVelocity,
    Parent,
    Player,
    PlayerIsYou,
    PlayerLabel,
    PlayerSword,
    Position,
    Sprite,
    Velocity,
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
    const size = { x: 16, y: 32 };
    const spritesheetSize = { x: 64, y: 64 };
    const swordSize = { x: 7, y: 28 };

    for (const s of [size, swordSize, spritesheetSize]) {
        s.x *= scale;
        s.y *= scale;
    }

    const { speed, deceleration } = PLAYER_CONFIG;

    const player = STATE.createEntity(getEntityIdFrom(clientId)).add(
        new Player({
            isYou,
            id: clientId,
            playerName,
            ...PLAYER_CONFIG,
        }),
        new Position({ ...position }),
        new Sprite({
            src: "/spritesheets/player.png",
            size,
            spritesheetSize,
            classNames: ["player"],
            // label: playerName,
        }),
        new Velocity({ x: 0, y: 0 }),
        new MaxVelocity({ x: speed, y: speed }),
        new DecreaseVelocity({ x: deceleration, y: deceleration }),
        new AnimationContainer(
            [
                {
                    name: "one",
                    frames: [
                        [0, 500],
                        [1, 500],
                        [2, 500],
                    ],
                },
                {
                    name: "two",
                    frames: [
                        [4, 500],
                        [5, 500],
                        [6, 500],
                    ],
                },
                {
                    name: "mixed",
                    frames: [
                        [0, 100],
                        [4, 100],
                        [1, 100],
                        [5, 100],
                        [2, 100],
                        [6, 100],
                    ],
                },
            ],
            "one",
        ),
        // new Animation({
        //     name: "mixed",
        //     frames: [
        //         [0, 100],
        //         [4, 100],
        //         [1, 100],
        //         [5, 100],
        //         [2, 100],
        //         [6, 100],
        //     ],
        // }),
    );

    if (isYou) {
        player.add(new PlayerIsYou());
    }

    //     // TODO
    //     // @ts-ignore
    //     window.player = player;
    //     let spriteIndex = 0;
    //     const spriteCount = 8;
    //     setInterval(() => {
    //         spriteIndex = (spriteIndex + 1) % spriteCount;
    //         if (spriteIndex === 3 || spriteIndex === 7) {
    //             spriteIndex = (spriteIndex + 1) % spriteCount;
    //         }
    //         const sprite = player.get("sprite")!;
    //         sprite.setSpriteIndex(spriteIndex);
    //     }, 500);

    STATE.createEntity(`player-sword-${clientId}`).add(
        new PlayerSword(clientId),
        new Sprite({
            src: "/sprites/sword.png",
            size: { ...swordSize },
            classNames: ["player-sword"],
        }),
        new Position({ x: size.x, y: size.y / 2 - swordSize.y / 2 - 8 }),
        new Parent(player.id),
        // new Facing("down"),
    );

    const labelEl = document.createElement("div");
    labelEl.classList.add("entity-label");
    labelEl.innerText = playerName;

    STATE.createEntity(`player-label-${clientId}`).add(
        new Element(labelEl),
        new Position({ x: size.x / 2, y: 0 }),
        new Parent(player.id),
        new PlayerLabel({ playerId: clientId, isYou }),
    );

    return player;
}
