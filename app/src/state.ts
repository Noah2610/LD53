import { Component, ComponentName, ComponentOfName } from "./components";
import { ActionName } from "./config";
import { Entity, EntityId } from "./entities";
import { genUuid } from "./util";

export interface StateEntityApi {
    get: <N extends ComponentName>(name: N) => ComponentOfName<N> | null;
    add: (...components: Component[]) => void;
    remove: (...componentNames: ComponentName[]) => void;
    destroy: () => void;
}

type ComponentStore = Map<EntityId, Component>;

export class State {
    public actions: Map<ActionName, "down" | "press" | "up">;
    public ws: WebSocket | null;

    private entities: Set<Entity>;
    private stores: Map<ComponentName, ComponentStore>;

    constructor() {
        this.actions = new Map();
        this.ws = null;

        this.entities = new Set();
        this.stores = new Map();
    }

    public createEntity(id?: EntityId): Entity {
        const api: StateEntityApi = {
            get: (name) => this.getComponentFromEntity(entity, name),
            add: (...components: Component[]) =>
                this.addComponentsToEntity(entity, components),
            remove: (...names: ComponentName[]) =>
                this.removeComponentsFromEntity(entity, names),
            destroy: () => this.destroyEntity(entity),
        };

        const entity = new Entity(id ?? genUuid(), api);
        this.entities.add(entity);

        return entity;
    }

    private getStore(name: ComponentName): ComponentStore {
        if (!this.stores.has(name)) {
            this.stores.set(name, new Map());
        }

        return this.stores.get(name)!;
    }

    private getComponentFromEntity<N extends ComponentName>(
        entity: Entity,
        componentName: N,
    ): ComponentOfName<N> | null {
        const store = this.getStore(componentName);
        const comp = store.get(entity.id);
        if (!comp) {
            return null;
        }

        return comp as ComponentOfName<N>;
    }

    private addComponentsToEntity(entity: Entity, components: Component[]) {
        for (const comp of components) {
            const store = this.getStore(comp.name);
            store.set(entity.id, comp);
        }
    }

    private removeComponentsFromEntity(entity: Entity, names: ComponentName[]) {
        for (const name of names) {
            const store = this.getStore(name);
            store.delete(entity.id);
        }
    }

    private destroyEntity(entity: Entity) {
        this.entities.delete(entity);

        for (const store of this.stores.values()) {
            store.delete(entity.id);
        }
    }
}

export const STATE = new State();

// @ts-ignore
window.STATE = STATE;
