import "reflect-metadata";
import {getOrCreateMeta} from "./meta.entity";


/**
 * interface of attribute options
 */
export interface AttributeOptions {
    isIndex?: boolean;
    defaultValue?: any;
}

export const attribute = (options? : AttributeOptions) => {
    return (target: any, name: string) : void => {
        const opts = {...{defaultValue: null}, ...options}
        const key = name;
        const meta = getOrCreateMeta(target.constructor.name);
        if (!meta.attributes.includes(name)) {
            meta.attributes.push(name);
        }
        Reflect.defineProperty( target, name, {
            enumerable: true,
            configurable: true,
            get() {
                if (name in this._attributes) {
                    return this.getAttribute(key);
                }
                this.setAttribute(key, opts.defaultValue);
                return opts.defaultValue;
            },
            set(value) {
                this.setAttribute(key, typeof value !== 'undefined' ? value : opts.defaultValue);
            }
        });
    }
}