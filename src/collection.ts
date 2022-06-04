import {Model} from "./model";

export class Collection
{
    private _data : Model[] = [];

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