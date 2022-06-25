import {Model} from "../model";

export interface TransportInterface {
    createOne(model: Model, options?: object) : Promise<any>
    updateOne(model: Model, options?: object) : Promise<any>
    deleteOne(model: Model, options?: object) : Promise<any>
    getOne(input: string) : Promise<any>
    getMany(model: Model, requestOptions?: RequestInit) : Promise<any>
}