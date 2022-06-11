import {BaseObject, BaseObjectEvent} from "./base/base.object";
import {Collection} from "./collection";
import {Event} from "./base/event";

export class Model extends BaseObject
{
    /**
     * has one mapper
     * @protected
     */
    protected _hasOne : object = {};

    /**
     * has many mapper
     * @protected
     */
    protected _hasMany : object = {};

    /**
     * errors mapper
     * @protected
     */
    protected _errors : object = {};

    protected _isNew : boolean = true;

    public addError(attribute: string, message : string) : void
    {
        if (!(attribute in this._errors)) {
            (this._errors as any)[attribute] = [];
        }
        (this._errors as any)[attribute].push(message);
    }

    public get errors() : object
    {
        return this._errors;
    }

    public rule() : object[]
    {
        return [];
    }

    public async validate() : Promise<boolean>
    {
        this.emit(new Event(ModelEvent.BEFORE_VALIDATE, this));
        this.emit(new Event(ModelEvent.AFTER_VALIDATE, this));
        return true;
    }

    public async find(params : object)
    {

    }
}

export enum ModelEvent {
    BEFORE_VALIDATE = 'beforeValidate',
    AFTER_VALIDATE = 'afterValidate',
}
