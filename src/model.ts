import {BaseObject, BaseObjectEvent} from "./base/base.object";
import {Collection} from "./collection";

export class Model extends BaseObject
{
    protected _hasOne : object = {};
    protected _hasMany : object = {};

    protected _errors : object = {};

    public static getCollectionClass() : typeof Collection
    {
        return Collection;
    }

    public get errors() : object
    {
        return this._errors;
    }

    public async validate() : Promise<boolean>
    {
        return true;
    }
}

export enum ModelEvent {
    BEFORE_VALIDATE = 'beforeValidate',
    AFTER_VALIDATE = 'afterValidate',
}
