export class BaseObject {

    protected _attributes : object = {};

    protected _oldAttributes : object = {};

    protected _listeners : object = {};

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
    public setAttribute(name : string, value : any)
    {
        if (this.hasAttribute(name)) {
            const oldValue = this.getAttribute(name);
            if (oldValue !== value) {
                (this._oldAttributes as any)[name] = this.getAttribute(name);
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

    /**
     * load data to attributes
     * @param params
     */
    load(params : object = {}) {
        for(const key in params) {
            if (this.hasAttribute(key)) {
                this.setAttribute(key, (params as any)[key]);
            }
        }
    }

}