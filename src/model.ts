import {BaseObject, BaseObjectEvent} from "./base/base.object";
import {Collection} from "./collection";
import {Event} from "./base/event";
import {getOrCreateMeta} from "./decorator/meta.entity";

export class Model extends BaseObject
{
    /**
     * attributes mapping
     * @protected
     */
    protected _attributes : object = {};

    /**
     * old attribute mapping
     * @protected
     */
    protected _oldAttributes : object = {};

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

    /**
     * constructor
     * @param args
     */
    constructor(args? : object) {
        super();
        for(const key in args) {
            if (key in this) {
                (this as any)[key] = (args as any)[key];
            }
        }
    }

    /**
     * add error message
     * @param attribute
     * @param message
     */
    public addError(attribute: string, message : string) : void
    {
        if (!(attribute in this._errors)) {
            (this._errors as any)[attribute] = [];
        }
        (this._errors as any)[attribute].push(message);
    }

    /**
     * get errors messages
     */
    public get errors() : object
    {
        return this._errors;
    }

    public getError(name : string)
    {
        return (this._errors as any)[name];
    }

    /**
     * load data to exist attributes
     * @param params
     */
    load(params : object) : boolean
    {
        let load = false;

        this.emit(new Event(BaseObjectEvent.BEFORE_LOAD, this, params));

        for(const key of Object.keys(params)) {
            if (this.hasAttribute(key)) {
                this.setAttribute(key, (params as any)[key]);
                load = true;
            }
        }

        this.emit(new Event(BaseObjectEvent.AFTER_LOAD, this, params));

        return load;
    }

    /**
     * set attribute value
     * @param name
     * @param value
     */
    public setAttribute(name : string, value : any) : void
    {
        const meta = getOrCreateMeta(this.className);
        if (meta.hasOne.includes(name)) {
            const model : Model = (this._hasOne as any)[name];
            model.setAttributes(value);
        } else if ((name in this._hasMany)) {
            const collection : Collection = (this._hasMany as any)[name];
            collection.data = value;
        } else if (meta.attributes.includes(name)) {
            const oldValue = this.getAttribute(name);
            if (
                (typeof oldValue !== 'undefined') &&
                (typeof (this._oldAttributes as any)[name] === 'undefined') &&
                oldValue !== value
            ) {
                (this._oldAttributes as any)[name] = oldValue;
                this.emit(BaseObjectEvent.CHANGED_ATTRIBUTE);
            }
            (this._attributes as any)[name] = value;
        }
    }

    /**
     * reset attributes value for old attributes then clear old attributes
     */
    public reset() : void
    {
        this.setAttributes(this._oldAttributes);
        this.clearOldAttributes();
    }

    /**
     * set or add attributes
     * @param params
     */
    public setAttributes(params : object) : void
    {
        for(const key of Object.keys(params)) {
            this.setAttribute(key, (params as any)[key]);
        }
    }

    /**
     * check attribute has exist
     * @param name
     */
    public hasAttribute(name : string) : boolean
    {
        const meta = getOrCreateMeta(this.className);
        return meta.attributes.includes(name);
    }

    /**
     * get attribute value by name
     * @param name
     */
    public getAttribute(name : string) : any
    {
        return this.hasAttribute(name) ? (this._attributes as any)[name] : null;
    }

    /**
     * get attributes by name
     * @param only
     */
    public getAttributesBy(only: string[]) : object
    {
        const result = {};
        only.forEach((key) => {
            if (this.hasAttribute(key)) {
                const value = this.getAttribute(key);
                (result as any)[key] = value;
            }
        });
        return result;
    }

    /**
     * get all attributes key and value
     */
    public get attributes() : object
    {
        return this._attributes;
    }

    /**
     * check attributes is dirty
     */
    get isDirtyAttribute() : boolean
    {
        return Object.entries(this._oldAttributes).length !== 0;
    }

    /**
     * get all old attributes
     */
    public get oldAttributes() : object
    {
        return this._oldAttributes;
    }

    /**
     * clear all old attributes
     */
    public clearOldAttributes() : void
    {
        this._oldAttributes = {};
    }

    /**
     * set rule attributes
     */
    protected rule() : object[]
    {
        return [];
    }

    /**
     * validate attributes value
     */
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
