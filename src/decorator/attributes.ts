import {BaseObject} from "../base/base.object";
import {Model} from "../model";

export function attribute(target: Model, name: string) {
    Object.defineProperty( target, name, {
        enumerable: true,
        get() {
            if (this.hasAttribute(name)) {
                return this.getAttribute(name);
            }
            throw new Error(`attribute ${name} not found`);
        },
        set(value) {
            this.setAttribute(name, value);
        }
    });
}