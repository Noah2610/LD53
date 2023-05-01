import { StateEntityApi } from "../state";

export type EntityId = string;

export class Entity implements StateEntityApi {
    public id: EntityId;

    public get: StateEntityApi["get"];
    public getComponents: StateEntityApi["getComponents"];
    public add: StateEntityApi["add"];
    public remove: StateEntityApi["remove"];

    public isAlive: boolean;

    private api: StateEntityApi;
    private _destroy: StateEntityApi["destroy"];

    constructor(id: string, api: StateEntityApi) {
        this.id = id;
        this.api = api;
        this.isAlive = true;

        this.get = this.api.get;
        this.getComponents = this.api.getComponents;
        this.add = this.api.add;
        this.remove = this.api.remove;
        this._destroy = this.api.destroy;
    }

    public destroy() {
        this._destroy();
    }
}
