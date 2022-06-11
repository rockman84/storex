import {Model} from "../model";
import "reflect-metadata";

export interface HasOneOptions {
    attribute?: string;
    targetAttribute?: string;
    createModelWhenEmpty?:boolean;
}
/**
 * decorator has one property
 */
export function hasOne (options?:HasOneOptions) {
    const defaultOptions = {attribute: null, targetAttribute: null, createModelWhenEmpty: true};
    const opts = {...defaultOptions, ...options};
    return (target : Model, property : string) => {
        const metadata = Reflect.getMetadata('design:type', target, property);
        Reflect.defineProperty(target, property , {
            set(value) {
                if (value instanceof metadata.valueOf()) {
                    this._hasOne[property] = value;
                }
            },
            get() {
                if (opts.createModelWhenEmpty && !(property in this._hasOne)) {
                    this._hasOne[property] = new (metadata.valueOf() as any)();
                    if (opts.targetAttribute !== null && opts.attribute !== null) {
                        this._hasOne[property][opts.targetAttribute] = this[opts.attribute];
                    }
                }
                return this._hasOne[property];
            }
        });
    }
}