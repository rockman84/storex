import {Model} from "../model";
import {Collection} from "../collection";

export interface TransportInterface {
    createOne(model: Model, options?: object) : Promise<any>
    updateOne(model: Model, options?: object) : Promise<any>
    deleteOne(model: Model, options?: object) : Promise<any>
    getOne(input: string) : Promise<any>
    getMany(model: Collection, requestOptions?: RequestInit) : Promise<any>
}