import {Model} from "../model";
import "reflect-metadata";
import {name} from "ts-jest/dist/transformers/hoist-jest";

const formatMetadataKey = Symbol("format");

export function hasMany() {
    return function (target: Model, property: string) {
        const metadata = Reflect.getMetadata("design:type", target, property);
        Reflect.defineProperty(target, property, {
            set(value) {
                if (value instanceof metadata.valueOf()) {
                    this._hasMany[name] = value;
                }
            },
            get() {
                if (!(name in this._hasMany)) {
                    this._hasMany[name] = new (metadata.valueOf() as any);
                }
                return this._hasMany[name];
            }
        });
    }
}


export function getHasMany(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}