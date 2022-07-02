import {Model} from "../model";
import {Collection} from "../collection";
import {getOrCreateMeta} from "./meta.entity";
import {FetchTransport} from "../transport/fetch.transport";
import {ApiModel} from "../api.model";

export interface HasManyOptions {
    collection: any;
    attribute : string;
    targetAttribute: string;
    autoLoad?: boolean;
}

/**
 * decorator has many property
 */
export function hasMany(options?: HasManyOptions) {
    const opts = {...{collection: Collection}, ...options};
    return (target: any, property: string) => {
        const meta = getOrCreateMeta(target.constructor.name);
        if (!meta.hasMany.includes(property)) {
            meta.hasMany.push(property);
        }
        Reflect.defineProperty(target, property, {
            enumerable: true,
            configurable: true,
            set(data: object) {
                let collection = this._hasMany[property];
                if (typeof collection === 'undefined') {
                    collection = new (opts.collection as any)();
                    this._hasMany[property] = collection;
                }
                if (typeof data === 'object') {
                    collection.data = data;
                }

            },
            get() {
                const collection = this._hasMany[property];
                if (options?.autoLoad && this.transport instanceof FetchTransport && opts.targetAttribute) {
                    const query : object = [];
                    (query as any)[opts.targetAttribute] = this.getAttribute(opts.attribute)
                    collection.findAll(query);
                }
                return collection;
            }
        });
    }
}