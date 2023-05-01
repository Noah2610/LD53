import { ComponentName, ComponentOfName } from "../components";
import { Entity } from "../entities";
import { ComponentStores } from "../state/componentStore";

type CN = ComponentName | never;

export interface QueryOptions<
    W extends CN = never,
    O extends CN = never,
    M extends CN = never,
> {
    with?: W[];
    without?: O[];
    maybe?: M[];
}

type QueryResult<W extends CN, O extends CN, M extends CN> = {
    entity: Entity;
} & QueryResultComponents<W, O, M>;

type QueryResultComponents<
    W extends CN = never,
    O extends CN = never,
    M extends CN = never,
> = { [N in W]: ComponentOfName<N> } & { [N in M]?: ComponentOfName<N> } & {
    [N in O]: undefined;
};

export function* query<
    W extends CN = never,
    O extends CN = never,
    M extends CN = never,
>(
    { with: with_, without, maybe }: QueryOptions<W, O, M>,
    entities: Entity[],
    stores: ComponentStores,
): Generator<QueryResult<W, O, M>, void, void> {
    const storesWith = with_?.map((name) => stores.get(name!));
    const storesWithout = without?.map((name) => stores.get(name!));
    const storesMaybe = maybe?.map((name) => stores.get(name!));

    for (const entity of entities) {
        const comps = {} as QueryResultComponents<W, O, M>;

        if (storesWith) {
            const compsWith = {} as QueryResultComponents<W, O, M>;
            let hasAll = true;
            for (const store of storesWith) {
                const comp = store.get(entity.id);
                if (!comp) {
                    hasAll = false;
                    break;
                }

                // @ts-ignore TODO
                compsWith[comp.name] = comp;
            }

            if (hasAll) {
                Object.assign(comps, compsWith);
            } else {
                continue;
            }
        }

        if (storesMaybe) {
            const compsMaybe = {} as QueryResultComponents<W, O, M>;
            for (const store of storesMaybe) {
                const comp = store.get(entity.id);
                if (comp) {
                    // @ts-ignore TODO
                    compsMaybe[comp.name] = comp;
                }
            }
            Object.assign(comps, compsMaybe);
        }

        if (storesWithout) {
            let shouldSkip = false;
            for (const store of storesWithout) {
                if (store.has(entity.id)) {
                    shouldSkip = true;
                    break;
                }
            }
            if (shouldSkip) {
                continue;
            }
        }

        yield {
            entity: entity,
            ...comps,
        };
    }

    //     if (with_) {
    //         with_
    //             .map((name) => stores.get(name))
    //             .forEach((store) => {
    //                 for (const entityId of entityIds) {
    //                     const comp = store.get(entityId);
    //                     if (comp) {
    //                         result.set(entityId, {
    //                             ...result.get(entityId),
    //                             [comp.name]: comp,
    //                         } as QueryResultComponents<W, O, M>);
    //                     } else {
    //                         entityIds.delete(entityId);
    //                         result.delete(entityId);
    //                     }
    //                 }

    //                 // if (!result) {
    //                 //     result = new Map();
    //                 //     for (const [id, comp] of store) {
    //                 //         result.set(id, {
    //                 //             [comp.name]: comp,
    //                 //         } as QueryResultComponents<W, O, M>);
    //                 //     }
    //                 //     return;
    //                 // }

    //                 // for (const [id, comps] of result) {
    //                 //     const comp = store.get(id);
    //                 //     if (comp) {
    //                 //         result.set(id, {
    //                 //             ...comps,
    //                 //             [comp.name]: comp,
    //                 //         });
    //                 //     } else {
    //                 //         result.delete(id);
    //                 //     }
    //                 // }
    //             });
    //     }

    //     if (maybe) {
    //         maybe
    //             .map((name) => stores.get(name))
    //             .forEach((store) => {
    //                 for (const entityId of entityIds) {
    //                     const comp = store.get(entityId);
    //                     if (comp) {
    //                         result.set(entityId, {
    //                             ...result.get(entityId),
    //                             [comp.name]: comp,
    //                         } as QueryResultComponents<W, O, M>);
    //                     }
    //                 }
    //             });
    //     }

    //     if (without) {
    //         without
    //             .map((name) => stores.get(name))
    //             .forEach((store) => {
    //                 for (const entityId of entityIds) {
    //                     if (store.has(entityId)) {
    //                         entityIds.delete(entityId);
    //                         result.delete(entityId);
    //                     }
    //                 }
    //             });
    //     }
}

// for (const x of query(
//     {
//         with: ["position"],
//         without: ["player"],
//         maybe: ["sprite"],
//     },
//     null as any,
//     null as any,
// )) {
//     x.position.name;
//     x.player.name;
//     x.sprite.name;
// }

export type Query = typeof query;
