export class BaseObject {

    private _attributes : object = {};

    private _oldAttributes = [];

    /**
     * load data to attributes
     * @param args
     */
    load(args : object = {}) {
        for(const key in args) {
            if (this.hasAttribute(key)) {
                (this._attributes as any)[key] = (args as any)[key];
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
    public setAttribute(attr : string, value : any)
    {
        (this._attributes as any)[attr] = value;
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
    public get attributes() : Object
    {
        return this._attributes;
    }

}