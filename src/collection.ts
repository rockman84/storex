import {Model} from "./model";
import {BaseObject} from "./base/base.object";

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
            this._data.push(item);
            this.afterPush(item);
        });
    }

    public async beforePush(item : typeof Model) : Promise<boolean>
    {
        return true;
    }

    public afterPush(item : typeof Model) : void
    {
        return;
    }
}