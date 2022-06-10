import {BaseObject, BaseObjectEvent} from "./base/base.object";
import {Collection} from "./collection";
import {Event} from "./base/event";

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
        this.emit(new Event(ModelEvent.BEFORE_VALIDATE, this));
        this.emit(new Event(ModelEvent.AFTER_VALIDATE, this));
        return true;
    }
}

export enum ModelEvent {
    BEFORE_VALIDATE = 'beforeValidate',
    AFTER_VALIDATE = 'afterValidate',
}
