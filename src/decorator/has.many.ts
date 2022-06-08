import {Model} from "../model";
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

export function hasMany() {
    return function (target: Model, property: string) {
        // let t = Reflect.getMetadata("design:type", target, property);
        // console.log(t.name);
        Reflect.defineProperty(target, property, {
            set(value) {
                console.log('hasmany set', this.author);
            },
            get() {
                console.log('hasmany get', typeof this);
            }
        });
    }
}


export function getHasMany(target: any, propertyKey: string) {
    return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}