import {Model} from "../model";
import {Collection} from "../collection";
import {ResponseTransport} from "./response.transport";

export interface TransportInterface {
    /**
     * create one base
     * @param model
     * @param attributes
     * @param query
     * @param options
     */
    createOne(model: Model, attributes: object, query? : object, options?: object) : Promise<ResponseTransport>

    /**
     * update one base
     * @param model
     * @param attributes
     * @param query
     * @param options
     */
    updateOne(model: Model, attributes: object, query? : object, options?: object) : Promise<ResponseTransport>

    /**
     * delete one base
     * @param model
     * @param query
     * @param options
     */
    deleteOne(model: Model, query? : object, options?: object) : Promise<ResponseTransport>

    /**
     * get one
     * @param model
     * @param query
     * @param options
     */
    getOne(model: Model, query? : object, options?: object) : Promise<ResponseTransport>

    /**
     * get Many
     * @param collection
     * @param query
     * @param options
     */
    getMany(collection: Collection, query? : object, options?: object) : Promise<ResponseTransport>
}