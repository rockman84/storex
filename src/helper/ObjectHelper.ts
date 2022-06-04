
export class ObjectHelper
{

    static forEach(obj : Object, callback : CallableFunction)
    {
        if (Array.isArray(obj)) {
            obj.forEach(callback);
        } else {
            Object.entries(obj).forEach(([prop, val], index) => {
                callback(prop, val, index);
            });
        }
    }

    static isObject(value : any) : boolean
    {
        return typeof value === 'object' && value !== null;
    }

    static isArray(value : any) : boolean
    {
        return Array.isArray(value);
    }

    static merge(value : Object[], merge : Object)
    {
        if (ObjectHelper.isObject(value)) {
            Object.assign(value, merge);
        } else {
            value.concat(merge);
        }
    }

    static propertyExist(obj : Object, key : string)
    {
        if (ObjectHelper.isObject(obj)) {
            return obj.hasOwnProperty(key);
        }
    }
}
