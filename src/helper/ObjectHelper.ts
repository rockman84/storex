
export class ObjectHelper
{

    static isObject(value : any) : boolean
    {
        return typeof value === 'object' && value !== null;
    }

    static isArray(value : any) : boolean
    {
        return Array.isArray(value);
    }

    static merge(value : object[], merge : object)
    {
        if (ObjectHelper.isObject(value)) {
            Object.assign(value, merge);
        } else {
            value.concat(merge);
        }
    }
}
