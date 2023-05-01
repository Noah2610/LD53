import { Component, ComponentName, ComponentOfName } from "../components";
import { ActionName } from "../config";
import { Conn } from "../connection";
import { Entity, EntityId } from "../entities";
import { query, QueryOptions } from "../query";
import { genUuid } from "../util";
import { ComponentStores } from "./componentStore";

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

    constructor() {
        this.actions = new Map();
        this.conn = null;

        this.entities = new Map();
        this.stores = new ComponentStores();
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
        this.stores.removeAllComponentsFromEntity(entity);
        this.entities.delete(entity.id);
    }
}

export const STATE = new State();

// @ts-ignore
window.STATE = STATE;
