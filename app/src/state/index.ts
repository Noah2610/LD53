import { Vector } from "ld53-lib/types";
import { Component, ComponentName, ComponentOfName } from "../components";
import { ActionName } from "../config";
import { Conn } from "../connection";
import { Entity, EntityId } from "../entities";
import { query, QueryOptions } from "../query";
import { genUuid } from "../util";
import { ComponentStores } from "./componentStore";
import { PlayerController } from "./playerController";

export interface StateEntityApi {
    get: <N extends ComponentName>(name: N) => ComponentOfName<N> | null;
    getComponents: () => Component[];
    add: (...components: Component[]) => Entity;
    remove: (...componentNames: ComponentName[]) => Entity;
    destroy: () => void;
}

export class State {
    public actions: Map<ActionName, "down" | "press" | "up">;
    public conn: Conn | null;

    private entities: Map<EntityId, Entity>;
    private stores: ComponentStores;
    private playerControllers: Map<string, PlayerController>;

    constructor() {
        this.actions = new Map();
        this.conn = null;

        this.entities = new Map();
        this.stores = new ComponentStores();
        this.playerControllers = new Map();
    }

    public createEntity(id?: EntityId): Entity {
        const api: StateEntityApi = {
            get: (name) => this.stores.getComponentFromEntity(entity, name),

            getComponents: () => this.stores.getComponentsFromEntity(entity),

            add: (...components: Component[]) => {
                this.stores.addComponentsToEntity(entity, components);
                for (const comp of components) {
                    if (comp.onCreate) {
                        comp.onCreate();
                    }
                }
                return entity;
            },

            remove: (...names: ComponentName[]) => {
                this.stores.removeComponentsFromEntity(entity, names);
                return entity;
            },

            destroy: () => this.destroyEntity(entity),
        };

        const entity = new Entity(id ?? genUuid(), api);
        this.entities.set(entity.id, entity);

        return entity;
    }

    public *query<
        W extends ComponentName | never = never,
        O extends ComponentName | never = never,
        M extends ComponentName | never = never,
    >(q: QueryOptions<W, O, M>) {
        yield* query(q, [...this.entities.values()], this.stores);
    }

    private destroyEntity(entity: Entity) {
        entity.isAlive = false;
        this.stores.removeAllComponentsFromEntity(entity);
        this.entities.delete(entity.id);
    }

    public getComponentOf<N extends ComponentName>(id: EntityId, name: N) {
        return this.stores.get(name).get(id) ?? null;
    }

    public getEntity(id: EntityId) {
        return this.entities.get(id) ?? null;
    }

    public createPlayer({
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
        const player = new PlayerController({
            clientId,
            playerName,
            isYou,
            position,
        });

        this.playerControllers.set(clientId, player);

        return this.getEntity(player.entityId)!;
    }

    public getPlayer(clientId: string): PlayerController | null {
        return this.playerControllers.get(clientId) ?? null;
    }

    public removePlayer(clientId: string) {
        const controller = this.getPlayer(clientId);
        if (!controller) return;
        const entity = this.getEntity(controller.entityId);
        if (!entity) return;

        this.destroyEntity(entity);
        this.playerControllers.delete(clientId);
    }
}

export const STATE = new State();

// @ts-ignore
window.STATE = STATE;
