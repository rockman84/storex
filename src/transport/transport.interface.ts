import {Model} from "../model";

export interface TransportInterface {
    // getOne() : Promise<any>;
    create(model: Model) : Promise<Response|boolean>;
    // update(model: Model) : Promise<any>;
    // delete(model: Model) : Promise<any>;
}