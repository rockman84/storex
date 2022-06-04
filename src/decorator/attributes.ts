import {BaseObject} from "../base/base.object";

export function attribute(target: any, name: string) {
    let props = Symbol(name);
    let cls = Symbol(target);
    if (!(target instanceof BaseObject)) {
        throw Error('class must be instance of BaseObject');
    }
    Object.defineProperty( target, name, {
        enumerable: true,
        get() {
            if (this.hasAttribute(name)) {
                return this.getAttribute(name);
            }
            throw new Error('attribute not found');
        },
        set(v) {
            this.setAttribute(name, v);
        }
    });
}