import {Model} from "../model";
import "reflect-metadata";

export function hasOne () {
    return (target : Model, property : string) => {
        const metadata = Reflect.getMetadata('design:type', target, property);
        Reflect.defineProperty(target, property , {
            set(value) {
                if (value instanceof metadata.valueOf()) {
                    this._hasOne[property] = value;
                }
            },
            get() {
                if (!(property in this._hasOne)) {
                    this._hasOne[property] = new (metadata.valueOf() as any);
                }
                return this._hasOne[property];
            }
        });
    }
}