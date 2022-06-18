import {BaseObject} from "./base.object";

export class Event {
    public name: string;

    public target: BaseObject;

    public params: any;

    constructor(name : string, target: BaseObject, params : any = null) {
        this.name = name;
        this.target = target;
        this.params = params;
    }
}