import {Event} from "./Event";

export class BaseObject {
    public name? : string;
    protected _attributes : Object = {};

    protected _oldAttributes: Object = {};

    protected _listeners: Object = {};

    public constructor(args : Object = {}) {
        console.debug('run base');
        let attributes = this.attributes();
        let properties = {};
        for (const attr in attributes) {
            if (this.hasOwnProperty(attr)) {
                throw `attribute ` + attr + ` already exist in property`;
            }
            (this._attributes as any)[attr] = (attributes as any)[attr];
            properties[attr] = BaseObject._getAccessor(this, attr);
        }
        Object.defineProperties(this, properties);

        // set property or attribute
        for(const key in args) {
            if (this.hasAttribute(key)) {
                (this._attributes as any)[key] = (args as any)[key];
            } else {

                (this as any)[key] = (args as any)[key];
            }
        }

        this.init();
    }

    public init() {}

    public hasAttribute(attribute : string) : Boolean
    {
        return this._attributes.hasOwnProperty(attribute);
    }

    public get listeners() : Object
    {
        return this._listeners;
    }

    public get className() : string
    {
        return this.constructor.name;
    }

    public get oldAttributes() : Object
    {
        return this._oldAttributes;
    }

    public attributes() : Object
    {
        return {};
    }

    public getAttribute(key : string) : any
    {
        if (typeof (this._attributes as any)[key] === 'undefined') {
            return false;
        }
        return (this._attributes as any)[key];
    }

    public getAttributes(only : Object|null = null) : Object|null
    {
        if (only === null) {
            return this._attributes;
        } else if (Array.isArray(only)) {
            let result = {};
            only.forEach((key : string) => {
                if (typeof (this._attributes as any)[key] != 'undefined') {
                    (result as any)[key] = (this._attributes as any)[key];
                }
            });
            return result;
        }
        return null;
    }

    get isDirtyAttribute()
    {
        return Object.entries(this._oldAttributes).length != 0;
    }

    protected static _getAccessor(obj : BaseObject, key : string) : Object
    {
        return {
            enumerable: true,
            configurable: true,
            get() {
                return (obj._attributes as any)[key];
            },
            set: function (value : any) {
                if (typeof (obj._oldAttributes as any)[key] === 'undefined' && value != (obj._attributes as any)[key]) {
                    (obj._oldAttributes as any)[key] = (obj._attributes as any)[key];
                }
                (obj._attributes as any)[key] = value;
            }
        };
    }
}