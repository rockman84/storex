import {Event} from "./event";

export class BaseObject {

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
     * listeners mapping
     * @protected
     */
    protected _listeners : object = {};

    /**
     * state of new object
     * @protected
     */
    protected _isNew : boolean = true;

    /**
     * constructor
     * @param args
     */
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
    public get className() : string
    {
        return this.constructor.name;
    }

    /**
     * set attribute value
     * @param name
     * @param value
     */
    public setAttribute(name : string, value : any) : void
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
        if (typeof this._attributes === 'undefined') {
            return false;
        }
        return (name in this._attributes);
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
     * get all attributes key and value
     */
    public get attributes() : object
    {
        return this._attributes;
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
     * get all listeners
     */
    public get listeners() : object
    {
        return this._listeners;
    }

    /**
     * add listeners
     * @param name
     * @param callers
     */
    public addListeners(name : string, callers : (e: Event|string, object: this) => void) : void
    {
        if (typeof (this._listeners as any)[name] === 'undefined') {
            (this._listeners as any)[name] = [];
        }
        (this._listeners as any)[name].push(callers);
    }

    /**
     * trigger listeners event
     * @param event
     */
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
    BEFORE_LOAD = 'beforeLoad',
    AFTER_LOAD = 'afterLoad',
}