import {Model} from "../model";
import "reflect-metadata";
import {BookModel} from "../../example/model/book.model";

export function hasOne () {
    return function (target : Model, name : string) {
        const metadata = Reflect.getMetadata('design:type', target, name);
        Reflect.defineProperty(target, name , {
            set(value) {
                if (value instanceof metadata.valueOf()) {
                    this._hasOne[name] = value;
                }
            },
            get() {
                if (!(name in this._hasOne)) {
                    this._hasOne[name] = new (metadata.valueOf() as any);
                }
                return this._hasOne[name];
            }
        });
    }
}