import {BaseObject} from "../base/base.object";
import "reflect-metadata";

export interface AttributeOptions {
    name: string;
};

export function attribute(options? : AttributeOptions) {
    return (target: BaseObject, name: string) : void => {
        // const metadata = Reflect.getMetadata('design:type', target, name);
        const key = name;
        Reflect.defineProperty( target, name, {
            enumerable: true,
            configurable: true,
            get() {
                if (this.hasAttribute(key)) {
                    return this.getAttribute(key);
                }
                this.setAttribute(key, null);
                return null;
            },
            set(value) {
                this.setAttribute(key, value);
            }
        });
    }
}