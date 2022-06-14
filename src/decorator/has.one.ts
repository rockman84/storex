import {Model} from "../model";
import "reflect-metadata";

export interface HasOneOptions {
    modelClass: typeof Model;
    attribute?: string;
    targetAttribute?: string;
    createModelWhenEmpty?:boolean;
}
/**
 * decorator has one property
 */
export function hasOne (options:HasOneOptions) {
    const defaultOptions = {attribute: null, targetAttribute: null, createModelWhenEmpty: true};
    const opts = {...defaultOptions, ...options};
    return (target : Model, property : string) => {
        Reflect.defineProperty(target, property , {
            enumerable: true,
            configurable: true,
            set(value) {
                if (value instanceof options.modelClass) {
                    this._hasOne[property] = value;
                }
                throw `value not instance of model`;
            },
            get() {
                if (opts.createModelWhenEmpty && !(property in this._hasOne)) {
                    this._hasOne[property] = new (options.modelClass as any)();
                    if (opts.targetAttribute !== null && opts.attribute !== null) {
                        this._hasOne[property][opts.targetAttribute] = this[opts.attribute];
                    }
                }
                return this._hasOne[property];
            }
        });
    }
}