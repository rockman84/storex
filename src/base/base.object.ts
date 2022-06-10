import {Event} from "./event";

export class BaseObject {

    protected _attributes : object = {};

    protected _oldAttributes : object = {};

    protected _listeners : object = {};

    constructor(args? : object) {
        for(const key in args) {
            if (key in this) {
                (this as any)[key] = (args as any)[key];
            }
        }
    }
    /**
     * get class name
     */
    public get className()
    {
        return this.constructor.name;
    }

    /**
     * set attribute value
     * @param attr
     * @param value
     */
    public async setAttribute(name : string, value : any)
    {
        if (this.hasAttribute(name)) {
            const oldValue = this.getAttribute(name);
            if (oldValue !== value) {
                (this._oldAttributes as any)[name] = this.getAttribute(name);
                this.emit(BaseObjectEvent.CHANGED_ATTRIBUTE);
            }
        }
        (this._attributes as any)[name] = value;
    }

    public setAttributes(params : object)
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
        if (typeof this._attributes === 'undefined') {
            return false;
        };
        return (name in this._attributes);
    }

    /**
     * get attribute value by name
     * @param name
     */
    public getAttribute(name : string)
    {
        return this.hasAttribute(name) ? (this._attributes as any)[name] : null;
    }

    /**
     * get all attributes key and value
     */
    public get attributes() : object
    {
        return this._attributes;
    }

    public get oldAttributes()
    {
        return this._oldAttributes;
    }

    public clearOldAttributes()
    {
        this._oldAttributes = {};
    }

    /**
     * load data to attributes
     * @param params
     */
    load(params : object) {
        for(const key in params) {
            if (this.hasAttribute(key)) {
                this.setAttribute(key, (params as any)[key]);
            }
        }
    }

    public get listeners() : object
    {
        return this._listeners;
    }

    public addListeners(name : string, callers : (e:Event, object:this) => void) : void
    {
        if (typeof (this._listeners as any)[name] === 'undefined') {
            (this._listeners as any)[name] = [];
        }
        (this._listeners as any)[name].push(callers);
    }

    public emit(event : BaseObjectEvent|Event|string) : void
    {
        const name = event instanceof Event ? event.name : event;
        if (typeof (this.listeners as any)[name] === 'undefined') {
            return;
        }
        for (const key of Object.keys((this.listeners as any)[name]) ) {
            (this.listeners as any)[name][key](event, this);
        }
    }
}

export enum BaseObjectEvent {
    CHANGED_ATTRIBUTE = 'changedAttribute',
}