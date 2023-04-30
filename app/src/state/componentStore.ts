import { Component, ComponentName, ComponentOfName } from "../components";
import { Entity, EntityId } from "../entities";

export type ComponentStore<C extends Component = Component> = Map<EntityId, C>;

export class ComponentStores {
    private stores: Map<ComponentName, ComponentStore>;

    constructor() {
        this.stores = new Map();
    }

    public get<N extends ComponentName>(
        name: N,
    ): ComponentStore<ComponentOfName<N>> {
        if (!this.stores.has(name)) {
            this.stores.set(name, new Map());
        }

        return this.stores.get(name)! as ComponentStore<ComponentOfName<N>>;
    }

    public getComponentFromEntity<N extends ComponentName>(
        entity: Entity,
        componentName: N,
    ): ComponentOfName<N> | null {
        const store = this.get(componentName);
        const comp = store.get(entity.id);
        if (!comp) {
            return null;
        }

        return comp as ComponentOfName<N>;
    }

    public addComponentsToEntity(entity: Entity, components: Component[]) {
        for (const comp of components) {
            const store = this.get(comp.name);
            store.set(entity.id, comp);
        }
    }

    public removeComponentsFromEntity(entity: Entity, names: ComponentName[]) {
        for (const name of names) {
            const store = this.get(name);
            store.delete(entity.id);
        }
    }

    public iter(): IterableIterator<ComponentStore> {
        return this.stores.values();
    }
}
