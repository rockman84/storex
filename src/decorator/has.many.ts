import {Model} from "../model";
import {Collection} from "../collection";
import "reflect-metadata";

export interface HasManyOptions {
    attribute : string;
    targetAttribute: string;
}
/**
 * decorator has many property
 */
export function hasMany(options?: HasManyOptions) {
    return (target: Model, property: string) => {
        const defaultOptions = {attribute: null, targetAttribute: null};
        const opts = {...defaultOptions, ...options};
        const metadata = Reflect.getMetadata("design:type", target, property);
        const objectClass = metadata.valueOf();
        if (objectClass instanceof Collection) {
            throw new Error(` ${metadata.name} @hasMany should instance Collection`);
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