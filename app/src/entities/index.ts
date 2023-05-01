import { StateEntityApi } from "../state";

export type EntityId = string;

export class Entity implements StateEntityApi {
    public id: EntityId;

    public get: StateEntityApi["get"];
    public getComponents: StateEntityApi["getComponents"];
    public add: StateEntityApi["add"];
    public remove: StateEntityApi["remove"];
    public destroy: StateEntityApi["destroy"];

    private api: StateEntityApi;

    constructor(id: string, api: StateEntityApi) {
        this.id = id;
        this.api = api;

        this.get = this.api.get;
        this.getComponents = this.api.getComponents;
        this.add = this.api.add;
        this.remove = this.api.remove;
        this.destroy = this.api.destroy;
    }
}
