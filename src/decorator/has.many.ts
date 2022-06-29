import {Model} from "../model";
import {Collection} from "../collection";

export interface HasManyOptions {
    collectionClass: typeof Collection;
    attribute : string;
    targetAttribute: string;
}
/**
 * decorator has many property
 */
export function hasMany(options?: HasManyOptions) {
    return (target: Model, property: string) => {
        const opts = {collectionClass: Collection, ...options};
        const objectClass = opts.collectionClass;
        Reflect.defineProperty(target, property, {
            enumerable: true,
            configurable: true,
            set(value: any) {
                if (value instanceof objectClass) {
                    this._hasMany[property] = value;
                }
            },
            get() {
                if (!(property in Object.keys(this._hasMany))) {
                    const collection = new (opts.collectionClass as any)();
                    // collection._parent = this;
                    this._hasMany[property] = collection;
                }
                return this._hasMany[property];
            }
        });
    }
}