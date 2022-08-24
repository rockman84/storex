import {BaseObject, BaseObjectEvent} from "./base/base.object";
import {Collection} from "./collection";
import {Event} from "./base/event";
import {getOrCreateMeta} from "./decorator/meta.entity";
import {validate} from "class-validator";

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
    public async load(params : object) : Promise<boolean>
    {
        let load = false;

        this.emit(new Event(BaseObjectEvent.BEFORE_LOAD, this, params));

        for(const key of Object.keys(params)) {
            if (this.hasAttribute(key)) {
                await this.setAttribute(key, (params as any)[key]);
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
    public async setAttribute(name : string, value : any) : Promise<void>
    {
        const meta = getOrCreateMeta(this.className);
        if (meta.hasOne.includes(name)) {
            const model : Model = (this as any)[name];
            await model.setAttributes(value);
        } else if (meta.hasMany.includes(name)) {
            const collection : Collection = (this as any)[name];
            // console.log(collection);
            await collection.setData(value);
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

    public toJson()
    {
        const data = this.attributes;
        for (let key in this._hasMany) {
            (data as any)[key] = (this as any)[key].toJson();
        }
        for (let key in this._hasOne) {
            (data as any)[key] = (this._hasOne as any)[key].toJson();
        }
        return data;

    }

    /**
     * reset attributes value for old attributes then clear old attributes
     */
    public async reset() : Promise<void>
    {
        await this.setAttributes(this._oldAttributes);
        this.clearOldAttributes();
    }

    /**
     * set or add attributes
     * @param params
     */
    public async setAttributes(params : object) : Promise<void>
    {
        if (params === null) {
            return;
        }
        for(const key of Object.keys(params)) {
            await this.setAttribute(key, (params as any)[key]);
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
     * validate attributes value
     */
    public async validate() : Promise<boolean>
    {
        this.emit(new Event(ModelEvent.BEFORE_VALIDATE, this));
        this._errors = [];
        const validation = validate(this).then((errors) => {
            for (const error of errors) {
                for (const key in error.constraints) {
                    this.addError(error.property, error.constraints[key]);
                }
            }
            return errors.length === 0;
        });
        this.emit(new Event(ModelEvent.AFTER_VALIDATE, this));
        return validation;
    }
}

export enum ModelEvent {
    BEFORE_VALIDATE = 'beforeValidate',
    AFTER_VALIDATE = 'afterValidate',
}
