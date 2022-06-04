import {BaseObject} from "../base/base.object";

export function attribute(target: any, name: string) {
    if (!(target instanceof BaseObject)) {
        throw Error('class must be instance of BaseObject');
    }
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