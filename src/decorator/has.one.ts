import {Model} from "../model";
import {getOrCreateMeta} from "./meta.entity";
import "reflect-metadata";

export interface HasOneOptions {
    attribute?: string;
    targetAttribute?: string;
    createModelWhenEmpty?:boolean;
}
/**
 * decorator has one property
 */
export function hasOne (modelClass : () => typeof Model, options?: HasOneOptions) {
    const defaultOptions = {attribute: null, targetAttribute: null, createModelWhenEmpty: true};
    const opts = {...defaultOptions, ...options};
    return (target : Model, property : string) => {
        const meta = getOrCreateMeta(target.constructor.name);
        if (!meta.hasOne.includes(property)) {
            meta.hasOne.push(property);
        }
        Reflect.defineProperty(target, property , {
            enumerable: true,
            configurable: true,
            set(value) {
                if (value instanceof modelClass()) {
                    this._hasOne[property] = value;
                }
                throw new Error(`value not instance of model`);
            },
            get() {
                if (opts.createModelWhenEmpty && !(property in this._hasOne)) {
                    this._hasOne[property] = new (modelClass() as any)();
                    if (opts.targetAttribute !== null && opts.attribute !== null) {
                        this._hasOne[property][opts.targetAttribute] = this[opts.attribute];
                    }
                }
                return this._hasOne[property];
            }
        });
    }
}