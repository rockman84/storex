import {Model} from "./model";
import {BaseObject} from "./base/base.object";

export class Collection extends BaseObject
{
    private _parent? : Model|null;

    private _data : Model[] = [];

    public get parent()
    {
        return this._parent;
    }

    public get data()
    {
        return this._data;
    }

    public get count()
    {
        return this._data.length;
    }

    public clearData()
    {
        this._data = [];
    }
}