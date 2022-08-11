import {Collection} from "../collection";
import {getOrCreateMeta} from "./meta.entity";

export interface HasManyOptions {
    attribute : string;
    targetAttribute: string;
    autoLoad?: boolean;
}

/**
 * decorator has many property
 */
export function hasMany(collectionClass : () => typeof Collection, options?: HasManyOptions) {
    const opts = options;
    return (target: any, property: string) => {
        const meta = getOrCreateMeta(target.constructor.name);
        if (!meta.hasMany.includes(property)) {
            meta.hasMany.push(property);
        }
        Reflect.defineProperty(target, property, {
            enumerable: true,
            configurable: true,
            set(data: object) {
                if (data instanceof Collection) {
                    this._hasMany[property] = data;
                }
                let collection = this._hasMany[property];
                if (typeof collection === 'undefined') {
                    collection = new (collectionClass() as any)(this);
                    this._hasMany[property] = collection;
                }
                if (typeof data === 'object') {
                    collection.setData(data);
                }

            },
            get() {
                if (!(property in this._hasMany)) {
                    this._hasMany[property] = new (collectionClass() as any)(this);
                }
                return this._hasMany[property];
                // const collection = this._hasMany[property];
                // if (options?.autoLoad && this.transport instanceof FetchTransport && opts.targetAttribute) {
                //     const query : object = [];
                //     (query as any)[opts.targetAttribute] = this.getAttribute(opts.attribute)
                //     collection.findAll(query);
                // }
                // return collection;
            }
        });
    }
}