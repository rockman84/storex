import {Model} from "./model";
import {BaseObject} from "./base/base.object";
import {Event} from "./base/event";

export class Collection extends BaseObject
{
    private _parent? : typeof Model|null;

    private _data : typeof Model[] = [];

    public get parent()
    {
        return this._parent;
    }

    public get data()
    {
        return this._data;
    }

    public clearData()
    {
        this._data = [];
    }

    public get count()
    {
        return this._data.length;
    }

    public push(item : typeof Model) : void
    {
        this.beforePush(item).then((result) => {
            result && this._data.push(item) && this.afterPush(item);
        });
    }

    public async beforePush(item : typeof Model) : Promise<boolean>
    {
        this.emit(new Event(CollectionEvent.BEFORE_PUSH, this, item));
        return true;
    }

    public afterPush(item : typeof Model) : void
    {
        this.emit(new Event(CollectionEvent.AFTER_PUSH, this, item));
        return;
    }

    public validateAll() : boolean
    {
        let valid = true;
        this._data.forEach(async (item : any, index : number) => {
            valid = await item.validate() && valid;
        });
        return valid;
    }
}

export enum CollectionEvent {
    BEFORE_PUSH = 'beforePush',
    AFTER_PUSH = 'afterPush'
}