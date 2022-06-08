import {BaseObject} from "../base/base.object";
import "reflect-metadata";

export function attribute() {
    return (target: BaseObject, name: string) : void => {
        Reflect.defineProperty( target, name, {
            enumerable: true,
            configurable: true,
            get() {
                if (this.hasAttribute(name)) {
                    return this.getAttribute(name);
                }
                this.setAttribute(name, null);
                return null;
            },
            set(value) {
                this.setAttribute(name, value);
            }
        });
    }
}