import {Model} from "../model";
import "reflect-metadata";

export function hasOne (type : string = Model.name) {
    return function (target : Model, name : string) {
        let t = Reflect.metadata('design:type', target);
        console.log(t.name);
        Reflect.defineProperty(target, name , {
            set(value) {

            },
            get() {

            }
        });
    }
}