import {Model} from "../model";
import {Collection} from "../collection";

export interface HasManyOptions {
    collectionClass?: typeof Collection;
    attribute? : string;
    targetAttribute?: string;
}
/**
 * decorator has many property
 */
export function hasMany(options?: HasManyOptions) {
    return (target: Model, property: string) => {
        const defaultOptions = {collectionClass: Collection, attribute: null, targetAttribute: null};
        const opts = {...defaultOptions, ...options};
        const objectClass = opts.collectionClass;
        if (objectClass instanceof Collection) {
            throw `${objectClass.name} @hasMany should instance Collection`;
        }
        Reflect.defineProperty(target, property, {
            set(value: any) {
                if (value instanceof objectClass) {
                    this._hasMany[property] = value;
                }
            },
            get() {
                if (!(property in this._hasMany)) {
                    const collection = new (objectClass as any)();
                    collection._parent = this;
                    this._hasMany[property] = collection;
                }
                return this._hasMany[property];
            }
        });
    }
}