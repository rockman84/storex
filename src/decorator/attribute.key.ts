import {Model} from "../model";
import "reflect-metadata";
import {Collection} from "../collection";

export function attributeKey() {
    return (target: Model, property: string) => {
        const metadata = Reflect.getMetadata("design:type", target, property);
        const objectClass = metadata.valueOf();

        Reflect.defineProperty(target, property, {
            set(value) {
                if (value instanceof objectClass) {
                    this._hasMany[property] = value;
                }
            },
            get() {
                if (!(property in this._hasMany)) {
                    this._hasMany[property] = '';
                }
                return this._hasMany[property];
            }
        });
    }
}